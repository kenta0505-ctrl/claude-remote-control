// Chromium lifecycle + CDP connection shared by every CLI command.
//
// Each CLI invocation is a separate process, so nothing can be held in memory
// between commands. Instead one long-lived Chromium is launched with a remote
// debugging port, and every command reconnects over CDP. Tabs, cookies and
// login state therefore survive across commands.
import { spawn } from 'node:child_process'
import { mkdirSync, openSync, readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { chromium } from 'playwright-core'

const STATE_DIR = process.env.CLAUDE_CHROME_HOME || join(homedir(), '.claude-chrome')
const STATE_FILE = join(STATE_DIR, 'state.json')
const PROFILE_DIR = join(STATE_DIR, 'profile')
const LOG_FILE = join(STATE_DIR, 'chromium.log')
const DEFAULT_PORT = Number(process.env.CLAUDE_CHROME_PORT || 9222)

const CHROME_BIN =
  process.env.CLAUDE_CHROME_BIN ||
  join(process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers', 'chromium')

export function readState() {
  if (!existsSync(STATE_FILE)) return {}
  try {
    return JSON.parse(readFileSync(STATE_FILE, 'utf8'))
  } catch {
    return {}
  }
}

export function writeState(patch) {
  mkdirSync(STATE_DIR, { recursive: true })
  const next = { ...readState(), ...patch }
  writeFileSync(STATE_FILE, JSON.stringify(next, null, 2))
  return next
}

function endpoint(port) {
  return `http://127.0.0.1:${port}`
}

async function probe(port) {
  try {
    const res = await fetch(`${endpoint(port)}/json/version`, {
      signal: AbortSignal.timeout(1500),
    })
    return res.ok ? await res.json() : null
  } catch {
    return null
  }
}

async function waitForPort(port, timeoutMs = 30_000) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    const info = await probe(port)
    if (info) return info
    await new Promise((r) => setTimeout(r, 200))
  }
  return null
}

export async function isRunning(port = DEFAULT_PORT) {
  return (await probe(port)) !== null
}

export async function start({ port = DEFAULT_PORT, headed = false, force = false } = {}) {
  const existing = await probe(port)
  if (existing && !force) return { alreadyRunning: true, port, version: existing }
  if (existing && force) await stop({ port })

  if (!existsSync(CHROME_BIN)) {
    throw new Error(
      `Chromium not found at ${CHROME_BIN}. Set CLAUDE_CHROME_BIN to a Chrome/Chromium binary.`,
    )
  }

  mkdirSync(STATE_DIR, { recursive: true })
  const args = [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${PROFILE_DIR}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--window-size=1440,900',
    'about:blank',
  ]
  // Containers have no X display and usually run as root, which Chromium's
  // sandbox refuses; headless + --no-sandbox is the only combination that
  // starts here.
  if (!headed) args.unshift('--headless=new')
  if (process.getuid?.() === 0) args.unshift('--no-sandbox')

  const out = openSync(LOG_FILE, 'a')
  const child = spawn(CHROME_BIN, args, {
    detached: true,
    stdio: ['ignore', out, out],
  })
  child.unref()

  const version = await waitForPort(port)
  if (!version) {
    throw new Error(`Chromium did not open port ${port}. See ${LOG_FILE}`)
  }
  writeState({ port, pid: child.pid, headed: !!headed, activeTab: 0 })
  return { alreadyRunning: false, port, pid: child.pid, version }
}

export async function stop({ port = DEFAULT_PORT } = {}) {
  const state = readState()
  const pid = state.pid
  if (pid) {
    try {
      process.kill(pid, 'SIGTERM')
    } catch {
      /* already gone */
    }
  }
  const deadline = Date.now() + 5000
  while (Date.now() < deadline && (await probe(port))) {
    await new Promise((r) => setTimeout(r, 150))
  }
  if (await probe(port)) {
    try {
      process.kill(pid, 'SIGKILL')
    } catch {
      /* ignore */
    }
  }
  writeState({ pid: null })
  return { stopped: true }
}

export function resetProfile() {
  rmSync(PROFILE_DIR, { recursive: true, force: true })
  return { removed: PROFILE_DIR }
}

// Connects to the running Chromium, auto-starting it when needed.
export async function connect({ port, autostart = true } = {}) {
  const state = readState()
  const p = port || state.port || DEFAULT_PORT
  if (!(await probe(p))) {
    if (!autostart) throw new Error(`No Chromium on port ${p}. Run: claude-chrome start`)
    await start({ port: p })
  }
  const browser = await chromium.connectOverCDP(endpoint(p))
  const context = browser.contexts()[0]
  if (!context) {
    await browser.close()
    throw new Error('Chromium has no browser context; try: claude-chrome restart')
  }
  return { browser, context, port: p }
}

export function paths() {
  return { STATE_DIR, STATE_FILE, PROFILE_DIR, LOG_FILE, CHROME_BIN, DEFAULT_PORT }
}
