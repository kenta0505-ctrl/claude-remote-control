#!/usr/bin/env node
// claude-chrome — drive the Chromium that ships inside a Claude Code remote
// session. State survives across invocations: `open` a page, then `text`,
// `click`, `type` and `screenshot` all act on that same live tab.
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { connect, isRunning, paths, readState, resetProfile, start, stop, writeState } from '../src/session.mjs'
import { activePage, armCapture, describe, isEvaluable, listPages, locate, pageText, readLogs, settle, withTimeout } from '../src/actions.mjs'

const USAGE = `claude-chrome <command> [args]

Session
  start [--headed]        launch the shared Chromium (auto-runs when needed)
  stop                   shut it down
  restart                stop, then start
  status                 show port, pid, open tabs
  reset                  delete the browser profile (cookies, logins)

Navigate
  open <url>             open <url> in the active tab
  new <url>              open <url> in a new tab and make it active
  reload | back | forward
  tabs                   list open tabs
  tab <index>            switch the active tab

Read
  text [--limit N]       visible text of the active tab
  html [--limit N]       outerHTML of the active tab
  title                  url + title
  find <selector>        count, text and visibility of matching elements
  console [--clear]      console messages and page errors captured on the page
  screenshot [path] [--full]

Act
  click <selector>
  type <selector> <text> [--enter]  fill a field (append --enter to submit)
  press <key>            e.g. Enter, Escape, Control+A
  select <selector> <value>
  wait <selector> [--timeout MS]
  eval <js>              evaluate JS in the page and print the JSON result

Selectors use Playwright syntax: "#id", ".cls", "[name=q]",
"text=Sign in", 'role=button[name="Save"]'. "@Sign in" is short for text=.
`

function parseFlags(argv) {
  const flags = {}
  const rest = []
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith('--')) {
      const [k, inline] = a.slice(2).split('=')
      if (inline !== undefined) flags[k] = inline
      else if (argv[i + 1] && !argv[i + 1].startsWith('--') && k !== 'enter' && k !== 'full' && k !== 'clear' && k !== 'headed') flags[k] = argv[++i]
      else flags[k] = true
    } else rest.push(a)
  }
  return { flags, rest }
}

function out(value) {
  if (typeof value === 'string') console.log(value)
  else console.log(JSON.stringify(value, null, 2))
}

function requireArg(rest, i, name) {
  const v = rest[i]
  if (v === undefined) throw new Error(`Missing <${name}>. See: claude-chrome --help`)
  return v
}

async function withPage(fn, opts) {
  const { browser, context } = await connect()
  try {
    const page = await activePage(context, opts)
    return await fn(page, context)
  } finally {
    await browser.close() // detaches CDP only; Chromium keeps running
  }
}

const commands = {
  async start(rest, flags) {
    const r = await start({ headed: !!flags.headed })
    out(r.alreadyRunning ? { alreadyRunning: true, port: r.port } : { started: true, port: r.port, pid: r.pid })
  },

  async stop() {
    out(await stop())
  },

  async restart(rest, flags) {
    await stop()
    out(await start({ headed: !!flags.headed }))
  },

  async status() {
    const p = paths()
    const state = readState()
    const running = await isRunning(state.port || p.DEFAULT_PORT)
    if (!running) return out({ running: false, port: state.port || p.DEFAULT_PORT, chromium: p.CHROME_BIN, log: p.LOG_FILE })
    const { browser, context } = await connect({ autostart: false })
    try {
      const tabs = await Promise.all(listPages(context).map(async (pg, i) => ({ index: i, active: i === (readState().activeTab ?? 0), ...(await describe(pg)) })))
      out({ running: true, port: state.port, pid: state.pid, headed: !!state.headed, profile: p.PROFILE_DIR, tabs })
    } finally {
      await browser.close()
    }
  },

  async reset() {
    await stop()
    out(resetProfile())
  },

  async open(rest) {
    const url = normalizeUrl(requireArg(rest, 0, 'url'))
    return withPage(async (page) => {
      await armCapture(page)
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45_000 })
      await settle(page)
      out(await describe(page))
    })
  },

  async new(rest) {
    const url = normalizeUrl(rest[0] || 'about:blank')
    const { browser, context } = await connect()
    try {
      const page = await context.newPage()
      writeState({ activeTab: listPages(context).indexOf(page) })
      await armCapture(page)
      if (url !== 'about:blank') {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45_000 })
      }
      await settle(page)
      out({ activeTab: readState().activeTab, ...(await describe(page)) })
    } finally {
      await browser.close()
    }
  },

  async reload() {
    return withPage(async (page) => {
      await armCapture(page)
      await page.reload({ waitUntil: 'domcontentloaded' })
      await settle(page)
      out(await describe(page))
    })
  },

  // History navigation can be served from the back/forward cache, which fires
  // no document lifecycle event -- wait for the commit only.
  async back() {
    return withPage(async (page) => {
      await armCapture(page)
      await page.goBack({ waitUntil: 'commit', timeout: 15_000 }).catch(() => {})
      await settle(page, { timeout: 8000 })
      out(await describe(page))
    })
  },

  async forward() {
    return withPage(async (page) => {
      await armCapture(page)
      await page.goForward({ waitUntil: 'commit', timeout: 15_000 }).catch(() => {})
      await settle(page, { timeout: 8000 })
      out(await describe(page))
    })
  },

  async tabs() {
    const { browser, context } = await connect()
    try {
      const active = readState().activeTab ?? 0
      const tabs = await Promise.all(listPages(context).map(async (pg, i) => ({ index: i, active: i === active, ...(await describe(pg)) })))
      out(tabs)
    } finally {
      await browser.close()
    }
  },

  async tab(rest) {
    const idx = Number(requireArg(rest, 0, 'index'))
    const { browser, context } = await connect()
    try {
      const pages = listPages(context)
      if (!pages[idx]) throw new Error(`No tab ${idx}. There are ${pages.length}.`)
      writeState({ activeTab: idx })
      await pages[idx].bringToFront().catch(() => {})
      out({ activeTab: idx, ...(await describe(pages[idx])) })
    } finally {
      await browser.close()
    }
  },

  async title() {
    return withPage(async (page) => out(await describe(page)))
  },

  async text(rest, flags) {
    return withPage(async (page) => out(await pageText(page, { limit: Number(flags.limit || 20_000) })))
  },

  async html(rest, flags) {
    return withPage(async (page) => {
      const limit = Number(flags.limit || 20_000)
      const html = await withTimeout(page.content(), 15_000, 'html')
      out(html.length > limit ? `${html.slice(0, limit)}\n<!-- truncated ${html.length - limit} chars -->` : html)
    })
  },

  async find(rest) {
    const selector = requireArg(rest, 0, 'selector')
    return withPage(async (page) => {
      const all = page.locator(selector.startsWith('@') ? `text=${selector.slice(1)}` : selector)
      const count = await all.count()
      const sample = []
      for (let i = 0; i < Math.min(count, 10); i++) {
        const el = all.nth(i)
        sample.push({
          index: i,
          text: (await el.innerText().catch(() => '')).slice(0, 200),
          visible: await el.isVisible().catch(() => false),
          tag: await el.evaluate((n) => n.tagName.toLowerCase()).catch(() => '?'),
        })
      }
      out({ selector, count, sample })
    })
  },

  async console(rest, flags) {
    return withPage(async (page) => {
      const logs = await readLogs(page, { clear: !!flags.clear })
      if (!logs.length) {
        console.error('(no captured output; only pages navigated through claude-chrome are instrumented)')
      }
      out(logs)
    })
  },

  async screenshot(rest, flags) {
    const target = resolve(rest[0] || 'screenshot.png')
    return withPage(async (page) => {
      mkdirSync(dirname(target), { recursive: true })
      await page.screenshot({ path: target, fullPage: !!flags.full })
      out({ saved: target, fullPage: !!flags.full })
    })
  },

  async click(rest, flags) {
    const selector = requireArg(rest, 0, 'selector')
    return withPage(async (page) => {
      await armCapture(page)
      const el = locate(page, selector)
      await el.click({ timeout: Number(flags.timeout || 15_000) })
      await settle(page, { timeout: 8000 })
      out({ clicked: selector, ...(await describe(page)) })
    })
  },

  async type(rest, flags) {
    const selector = requireArg(rest, 0, 'selector')
    const value = requireArg(rest, 1, 'text')
    return withPage(async (page) => {
      const el = locate(page, selector)
      await el.fill(value, { timeout: Number(flags.timeout || 15_000) })
      if (flags.enter) {
        await el.press('Enter')
        await settle(page, { timeout: 8000 })
      }
      out({ typed: selector, submitted: !!flags.enter, ...(await describe(page)) })
    })
  },

  async press(rest) {
    const key = requireArg(rest, 0, 'key')
    return withPage(async (page) => {
      await page.keyboard.press(key)
      await settle(page, { timeout: 5000 })
      out({ pressed: key, ...(await describe(page)) })
    })
  },

  async select(rest) {
    const selector = requireArg(rest, 0, 'selector')
    const value = requireArg(rest, 1, 'value')
    return withPage(async (page) => {
      const picked = await locate(page, selector).selectOption(value)
      out({ selector, selected: picked })
    })
  },

  async wait(rest, flags) {
    const selector = requireArg(rest, 0, 'selector')
    return withPage(async (page) => {
      await locate(page, selector).waitFor({ state: 'visible', timeout: Number(flags.timeout || 30_000) })
      out({ visible: selector, ...(await describe(page)) })
    })
  },

  async eval(rest) {
    const src = requireArg(rest, 0, 'js')
    return withPage(async (page) => {
      if (!isEvaluable(page)) throw new Error(`Cannot evaluate JS on ${page.url()}`)
      const run = (body) => withTimeout(page.evaluate(body), Number(flags.timeout || 20_000), 'eval')
      const result = await run(`(async () => { return (${src}) })()`).catch(async (err) => {
        // Allow statement bodies too, not just expressions.
        if (!/SyntaxError|Unexpected/.test(String(err))) throw err
        return run(`(async () => { ${src} })()`)
      })
      out(result === undefined ? 'undefined' : result)
    })
  },
}

function normalizeUrl(url) {
  if (/^[a-z][a-z0-9+.-]*:/i.test(url)) return url
  if (/^localhost(:\d+)?(\/|$)/.test(url) || /^\d+\.\d+\.\d+\.\d+(:\d+)?/.test(url)) return `http://${url}`
  return `https://${url}`
}

const argv = process.argv.slice(2)
const name = argv[0]

if (!name || name === '--help' || name === '-h' || name === 'help') {
  console.log(USAGE)
  process.exit(name ? 0 : 1)
}

const handler = commands[name]
if (!handler) {
  console.error(`Unknown command: ${name}\n`)
  console.error(USAGE)
  process.exit(1)
}

const { flags, rest } = parseFlags(argv.slice(1))
try {
  await handler(rest, flags)
} catch (err) {
  console.error(`claude-chrome ${name}: ${err.message}`)
  process.exit(1)
}
