---
description: Pick up a GitHub issue by number and implement a fix end-to-end
allowed-tools: Bash, Read, Edit, Write, Grep, Glob, WebFetch
argument-hint: "<issue-number>"
---

# /project:fix-issue

Implement a fix for GitHub issue `$ARGUMENTS`.

## 1. Read the issue

```bash
gh issue view $ARGUMENTS --comments
```

Read **all comments**, not just the body — context often lives in discussion.

## 2. Reproduce if relevant

For bugs on the live site:

```bash
curl -sI https://jackbereson.github.io/<page>
```

Then `WebFetch(url, "describe page state")` to confirm the bug manifests server-side, or note that it's
a client-only issue (dev.to API failure, etc.) that requires an actual browser.

## 3. Scope the fix

Match the complaint to a subsystem:

| Area | Entry files |
|---|---|
| Nav / footer behaviour | `docs/common.js` |
| Blog list / filtering | `docs/blog.html` |
| Dynamic detail page | `docs/blog-post.html` |
| Pre-rendered posts | `scripts/build-posts.js` + `docs/blog-post.html` (template) |
| Deploy / CI | `.github/workflows/deploy.yml` |
| Portfolio home | `docs/index.html` |
| Résumé page | `docs/resume.html` |

If the bug is in a pre-rendered post, the root cause is almost always in `scripts/build-posts.js` or
the `docs/blog-post.html` template — **not** in the generated file (which is CI output).

## 4. Implement

- Make the minimal change required. Don't refactor opportunistically unless the issue asks for it.
- Preserve the conventions in `.claude/rules/code-style.md`.
- If touching anchor/link/navigation code, re-read the "quote-in-quote" bug history — use
  `<a href="...">` or `data-href` + delegation, **never** inline onclick with JSON.stringify.

## 5. Verify

- **HTML/JS change**: open `.claude/launch.json`'s preview (`npx serve docs -p 4321`) and smoke-test.
- **`scripts/build-posts.js` change**: run `node scripts/build-posts.js` locally; confirm posts
  generate without errors; `rm -rf docs/posts` before committing.
- **CI change**: no local test possible — push to a branch and watch `gh run watch`.

## 6. Commit

Follow the repo's commit style — short imperative subject, blank line, explanatory body. Include the
issue reference: `Fixes #<issue-number>` on its own line. Keep the
`Co-Authored-By: Claude ... <noreply@anthropic.com>` trailer.

## 7. Open PR (if on a branch)

```bash
gh pr create --title "..." --body "..."
```

If directly on master (the default for this solo repo), just push and verify the deploy:

```bash
git push origin master
gh run list --limit 2
```

Report back with: the file(s) changed, what the root cause was (in one sentence), and the commit SHA.
