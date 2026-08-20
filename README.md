# claude-remote-control

Browser control for Claude Code **remote (cloud) sessions**.

Claude Code's built-in `/chrome` integration drives the Chrome on *your own
machine* through the Claude in Chrome extension. A remote session runs in a
container in the cloud, so it has no path to that browser and `/chrome` is
unavailable there. This repo covers both halves of the gap:

- **`bin/claude-chrome.mjs`** — a small CLI that drives the Chromium already
  installed inside the remote container, so Claude can navigate, read, click,
  type, screenshot and read console errors from a cloud session.
- **[`docs/claude-in-chrome-setup.ja.md`](docs/claude-in-chrome-setup.ja.md)** —
  how to enable the real `/chrome` integration on your local machine
  (Japanese).

## Quick start

```bash
npm install
node bin/claude-chrome.mjs open localhost:3000
node bin/claude-chrome.mjs text
node bin/claude-chrome.mjs click "@Sign in"
node bin/claude-chrome.mjs console
node bin/claude-chrome.mjs screenshot out.png
```

Chromium starts automatically on the first command and stays running, so tabs,
cookies and login state persist from one command to the next. `claude-chrome
stop` shuts it down; `claude-chrome reset` also wipes the profile.

## Commands

| Group | Commands |
| --- | --- |
| Session | `start [--headed]`, `stop`, `restart`, `status`, `reset` |
| Navigate | `open <url>`, `new <url>`, `reload`, `back`, `forward`, `tabs`, `tab <i>` |
| Read | `text`, `html`, `title`, `find <sel>`, `console [--clear]`, `screenshot [path] [--full]` |
| Act | `click <sel>`, `type <sel> <text> [--enter]`, `press <key>`, `select <sel> <val>`, `wait <sel>`, `eval <js>` |

Run `node bin/claude-chrome.mjs --help` for the full usage text.

Selectors use [Playwright syntax](https://playwright.dev/docs/other-locators):
`#id`, `.cls`, `[name=q]`, `text=Sign in`, `role=button[name="Save"]`.
`@Sign in` is shorthand for `text=Sign in`.

Output is JSON (or plain text for `text`/`html`/`eval`), so commands compose
with `jq`.

## How it works

Chromium is launched once with `--remote-debugging-port`, and every CLI
invocation reconnects over CDP with `playwright-core`. That is what makes state
survive across commands — each Bash call is a separate process, so nothing can
be held in memory between them.

Console output is captured by injecting a `console` patch into the page, which
stores messages on `window.__claudeChromeLogs`. Chromium discards
CDP-registered init scripts as soon as the client disconnects, so each
navigating command re-arms the hook immediately before it navigates. Only pages
navigated through `claude-chrome` are instrumented.

## Environment

| Variable | Default | Purpose |
| --- | --- | --- |
| `CLAUDE_CHROME_BIN` | `$PLAYWRIGHT_BROWSERS_PATH/chromium` | Chrome/Chromium binary |
| `CLAUDE_CHROME_PORT` | `9222` | CDP port |
| `CLAUDE_CHROME_HOME` | `~/.claude-chrome` | profile, state file and Chromium log |

Claude Code remote containers ship Chromium at `/opt/pw-browsers/chromium` and
set `PLAYWRIGHT_BROWSERS_PATH`, so no browser download is needed. Locally, point
`CLAUDE_CHROME_BIN` at your own Chrome.

## Limitations

- **Headless by default.** Containers have no display; `--headed` is only useful
  where an X display exists.
- **Egress policy applies.** A remote session's outbound network is limited by
  the environment's network policy. If the policy blocks a host, Chromium
  reports `ERR_TUNNEL_CONNECTION_FAILED` and the proxy logs a 403 — check
  `curl -sS "$HTTPS_PROXY/__agentproxy/status"`. Localhost and any allowed host
  work normally.
- **A fresh profile, not yours.** Unlike `/chrome`, this browser does not
  inherit your local logins. Sites requiring a login must be logged into from
  within the session, and MFA-protected sites generally can't be.
- **Console capture starts at the first `claude-chrome` navigation.** Logs
  emitted on a page you did not navigate to through the CLI are not recorded.

## Tests

```bash
npm run smoke
```

Serves `test/fixture` over HTTP and drives it through the CLI end to end —
navigation, form input, console and page-error capture, tabs, history,
screenshots, and the about:blank fast-fail path.
