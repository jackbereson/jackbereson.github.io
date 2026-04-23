---
description: Push the current branch and monitor the GitHub Pages deploy to completion
allowed-tools: Bash, WebFetch
---

# /project:deploy

Push committed changes and verify the site is live. Use this when the user says "push đi" / "deploy it" /
"ship it" and there are changes ready.

## 1. Pre-flight

```bash
git status
git log --oneline -3
git branch --show-current
```

**Stop and ask the user** if:
- There are uncommitted changes (`git status` shows modified files).
- The current branch is not `master` (the Pages workflow only fires on `master`).
- A previous deploy is still running: `gh run list --limit 2`.

## 2. Push

```bash
git push origin master
```

## 3. Watch the workflow

Poll once, then tell the user to expect ~20–30s:

```bash
gh run list --limit 2
```

If the user asks for live monitoring, prefer `gh run watch <run-id>` over busy-loops.

## 4. Verify the deploy

When the run reports `completed / success`:

```bash
curl -sI https://jackbereson.github.io/ | head -5
curl -sI https://jackbereson.github.io/blog.html | head -5
```

Both should return `HTTP/2 200`.

**Extra check** if `scripts/build-posts.js` ran in this deploy: pick one slug from the build log and
confirm it resolves:

```bash
curl -sI "https://jackbereson.github.io/posts/<slug>.html"
```

## 5. Report

Give the user:

1. Commit SHA(s) deployed
2. Pages workflow run number + duration
3. Direct link to the live site(s) affected
4. Any post-deploy concerns (e.g. "share a post to iMessage to verify the OG card refreshes")

## Failure modes

- **`continue-on-error` step failed** — the `build-posts` step is allowed to fail; the deploy still
  succeeds. Check `gh run view <run-id> --log` to see if dev.to blipped. The site falls back to
  client-side fetch automatically.
- **Deploy step failed** — usually a Pages permissions issue or Pages not enabled in repo settings.
  Read the full log with `gh run view <run-id> --log-failed`.
- **Live site returns old HTML** — browser cache. Tell the user to hard-refresh (Cmd+Shift+R). GitHub
  Pages itself usually updates within 5s of deploy success.
