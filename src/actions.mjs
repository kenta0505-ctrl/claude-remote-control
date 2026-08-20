// Page-level helpers. Everything takes an already-connected context so that a
// single CLI command performs exactly one CDP connection.
import { readState, writeState } from './session.mjs'

// Injected into every document we navigate. It has to live in page JS rather
// than in CDP state, because the CLI disconnects as soon as a command finishes
// and Chromium tears down CDP-registered hooks with the client.
const CAPTURE_SRC = `(() => {
  if (window.__claudeChromeCapture) return;
  window.__claudeChromeCapture = true;
  const buf = (window.__claudeChromeLogs = []);
  const push = (type, text) => {
    buf.push({ type, text: String(text).slice(0, 4000), at: Date.now() });
    if (buf.length > 500) buf.splice(0, buf.length - 500);
  };
  for (const level of ['log', 'info', 'warn', 'error', 'debug']) {
    const orig = console[level].bind(console);
    console[level] = (...args) => {
      try {
        push(level, args.map((a) => {
          if (a instanceof Error) return a.stack || a.message;
          if (typeof a === 'object') { try { return JSON.stringify(a); } catch { return '[object]'; } }
          return a;
        }).join(' '));
      } catch {}
      orig(...args);
    };
  }
  window.addEventListener('error', (e) => push('pageerror', (e.error && e.error.stack) || e.message));
  window.addEventListener('unhandledrejection', (e) => push('pageerror', 'Unhandled rejection: ' + e.reason));
})()`

// page.evaluate() takes no timeout and waits forever for an execution context,
// which never appears on chrome-error:// or about: pages. Every evaluate in
// this module therefore goes through a race.
export function withTimeout(promise, ms, label) {
  let timer
  return Promise.race([
    promise.finally(() => clearTimeout(timer)),
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
    }),
  ])
}

export function isEvaluable(page) {
  return /^(https?|file):/.test(page.url())
}

// Registers the capture as an init script so it runs before the page's own
// scripts. Chromium drops CDP-registered init scripts when the client
// disconnects, i.e. when the CLI process exits -- so this must be called in the
// same command that performs the navigation, before the navigation starts.
export async function armCapture(page) {
  try {
    await page.addInitScript(CAPTURE_SRC)
  } catch {
    /* best effort */
  }
}

// Injects the capture into the document that is already loaded. Catches logs
// emitted from then on; anything logged before injection is lost, which is why
// navigations arm the init script first.
export async function installCapture(page) {
  if (!isEvaluable(page)) return
  try {
    await withTimeout(page.evaluate(CAPTURE_SRC), 5000, 'console capture')
  } catch {
    /* blank, error or cross-origin document */
  }
}

export function listPages(context) {
  return context.pages().filter((p) => !p.isClosed())
}

export async function activePage(context, { create = true } = {}) {
  const pages = listPages(context)
  const idx = readState().activeTab ?? 0
  if (pages[idx]) return pages[idx]
  if (pages.length) {
    writeState({ activeTab: pages.length - 1 })
    return pages[pages.length - 1]
  }
  if (!create) throw new Error('No open tab. Run: claude-chrome open <url>')
  const page = await context.newPage()
  writeState({ activeTab: listPages(context).indexOf(page) })
  return page
}

export async function settle(page, { timeout = 15_000 } = {}) {
  try {
    await page.waitForLoadState('load', { timeout })
  } catch {
    /* slow or streaming page: carry on with whatever rendered */
  }
  await installCapture(page)
}

export async function describe(page) {
  const title = await withTimeout(page.title(), 5000, 'title').catch(() => '')
  return { url: page.url(), title }
}

export async function pageText(page, { limit = 20_000 } = {}) {
  if (!isEvaluable(page)) return `[no readable document at ${page.url()}]`
  const text = await withTimeout(
    page.evaluate(() => {
      const root = document.body || document.documentElement
      return root ? root.innerText : ''
    }),
    15_000,
    'text',
  )
  const clean = text.replace(/\n{3,}/g, '\n\n').trim()
  return clean.length > limit ? `${clean.slice(0, limit)}\n…[truncated ${clean.length - limit} chars]` : clean
}

export async function readLogs(page, { clear = false } = {}) {
  if (!isEvaluable(page)) return []
  return withTimeout(
    page.evaluate((doClear) => {
      const buf = window.__claudeChromeLogs || []
      const copy = buf.slice()
      if (doClear) buf.length = 0
      return copy
    }, clear),
    10_000,
    'console',
  )
}

// Accepts Playwright selector syntax (`#id`, `.cls`, `text=Sign in`,
// `[name=q]`, `role=button[name="Save"]`). A leading `@` is shorthand for text.
export function locate(page, selector) {
  const s = selector.startsWith('@') ? `text=${selector.slice(1)}` : selector
  return page.locator(s).first()
}
