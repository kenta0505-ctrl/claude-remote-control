---
name: remote-browser
description: Drive a real browser from a Claude Code remote (cloud) session, where the /chrome integration is unavailable. Use when the task needs to open a URL, test a local web app, click or fill a form, read console errors, or take a screenshot of a page.
---

# Browser control in a remote session

`/chrome` only works on a local machine (it talks to the Claude in Chrome
extension over native messaging). In a remote session, use the `claude-chrome`
CLI in this repo, which drives the container's bundled Chromium over CDP.

## Setup

```bash
npm install    # once per container; installs playwright-core only
```

Chromium starts automatically on the first command. State (tabs, cookies,
login) persists across commands, so treat it as one live browser session.

## Typical loop

```bash
node bin/claude-chrome.mjs open localhost:3000   # navigate
node bin/claude-chrome.mjs text                  # read what rendered
node bin/claude-chrome.mjs find "button"         # locate elements
node bin/claude-chrome.mjs click "@Sign in"      # act
node bin/claude-chrome.mjs console               # console + page errors
node bin/claude-chrome.mjs screenshot out.png
```

`node bin/claude-chrome.mjs --help` lists every command.

## Rules of thumb

- Prefer `text` over `html` — it is far cheaper in context. Reach for `html`
  or `eval` only when you need markup or attributes.
- `find <selector>` before `click`/`type` when unsure the element exists;
  it reports count, text and visibility.
- After any action that may navigate, check the returned `url`.
- `console` only reports pages navigated through this CLI. If it comes back
  empty, `reload` and re-check.
- Read `screenshot` output with the Read tool to actually look at the page.
- Stop the browser with `claude-chrome stop` when done with a long task.

## When it will not work

- **Blocked hosts.** `ERR_TUNNEL_CONNECTION_FAILED` means the environment's
  egress policy denied the host. Verify with
  `curl -sS "$HTTPS_PROXY/__agentproxy/status"` and report the blocked host to
  the user — do not try to route around it.
- **The user's logins.** This is a fresh profile, not their browser. Anything
  needing their account, or MFA, has to be done with `/chrome` locally
  (see `docs/claude-in-chrome-setup.ja.md`).
