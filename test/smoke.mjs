#!/usr/bin/env node
// End-to-end smoke test: serves test/fixture over HTTP, then drives it with the
// CLI exactly the way a caller would (one process per command).
import { execFile } from 'node:child_process'
import { createReadStream, existsSync } from 'node:fs'
import { createServer } from 'node:http'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

const run = promisify(execFile)
const here = dirname(fileURLToPath(import.meta.url))
const CLI = resolve(here, '..', 'bin', 'claude-chrome.mjs')
const FIXTURE = join(here, 'fixture')
const PORT = 8399
const workdir = mkdtempSync(join(tmpdir(), 'claude-chrome-smoke-'))

const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript' }

const server = createServer((req, res) => {
  const path = req.url === '/' ? '/index.html' : req.url.split('?')[0]
  const file = join(FIXTURE, path)
  if (!file.startsWith(FIXTURE) || !existsSync(file)) {
    res.writeHead(404).end('not found')
    return
  }
  res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' })
  createReadStream(file).pipe(res)
})

async function cli(...args) {
  const { stdout } = await run(process.execPath, [CLI, ...args], {
    env: { ...process.env, CLAUDE_CHROME_HOME: workdir, CLAUDE_CHROME_PORT: '9333' },
    timeout: 90_000,
  })
  return stdout.trim()
}

const results = []
function check(name, ok, detail = '') {
  results.push({ name, ok })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok || !detail ? '' : ` — ${detail}`}`)
}

await new Promise((r) => server.listen(PORT, '127.0.0.1', r))
const base = `http://localhost:${PORT}`

try {
  const started = JSON.parse(await cli('start'))
  check('start', started.started === true || started.alreadyRunning === true)

  const opened = JSON.parse(await cli('open', `${base}/`))
  check('open', opened.title === 'claude-chrome fixture', opened.title)

  const text = await cli('text')
  check('text', text.includes('Fixture page') && text.includes('nothing yet'))

  const found = JSON.parse(await cli('find', '#go'))
  check('find', found.count === 1 && found.sample[0].text === 'Search')

  const typed = JSON.parse(await cli('type', '#q', 'hello world', '--enter'))
  check('type --enter', typed.submitted === true)
  check('form handled input', (await cli('eval', "document.getElementById('out').textContent")) === 'submitted: hello world')

  await cli('click', '#boom')
  const logs = JSON.parse(await cli('console'))
  check('console captures console.error', logs.some((l) => l.text.includes('boom clicked')))
  check('console captures page errors', logs.some((l) => l.type === 'pageerror' && l.text.includes('undefinedFn')))

  // A reload runs with the capture already installed, so even logs emitted
  // during initial script evaluation are recorded.
  await cli('reload')
  const afterReload = JSON.parse(await cli('console'))
  check('capture survives navigation', afterReload.some((l) => l.text.includes('fixture loaded')))

  const nav = JSON.parse(await cli('click', '@Second page'))
  check('click navigates', nav.url.endsWith('/second.html'), nav.url)
  const back = JSON.parse(await cli('back'))
  check('back', back.url === `${base}/`, back.url)

  const shot = JSON.parse(await cli('screenshot', join(workdir, 'shot.png'), '--full'))
  check('screenshot', existsSync(shot.saved))

  const tab = JSON.parse(await cli('new', `${base}/second.html`))
  check('new tab', tab.title === 'second', tab.title)
  const tabs = JSON.parse(await cli('tabs'))
  check('tabs lists both', tabs.length >= 2 && tabs.some((t) => t.active))
  const switched = JSON.parse(await cli('tab', '0'))
  check('tab switch', switched.activeTab === 0)

  // about:blank has no execution context; commands must fail fast, not hang.
  await cli('new', 'about:blank')
  const blank = await cli('text')
  check('no hang on about:blank', blank.startsWith('[no readable document'), blank.slice(0, 60))
} finally {
  await cli('stop').catch(() => {})
  server.close()
  rmSync(workdir, { recursive: true, force: true })
}

const failed = results.filter((r) => !r.ok)
console.log(`\n${results.length - failed.length}/${results.length} passed`)
process.exit(failed.length ? 1 : 0)
