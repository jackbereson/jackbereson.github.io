---
name: deploy
description: Push the current branch and verify the GitHub Pages deploy finished successfully. Use when the user says "ship it", "push it", "deploy", "push đi", "push lên build thử", or any variant asking to publish pending commits. Also auto-invoke after finishing a feature that touches `/docs/`, `scripts/`, or `.github/workflows/`.
---

# Deploy workflow — jackbereson.github.io

The target is **GitHub Pages** deployed from `/docs/` via `.github/workflows/deploy.yml`. A typical deploy
is ~20–30 seconds from `git push` to "live on https://jackbereson.github.io".

---

## Pre-flight

```bash
git status
git log --oneline -3
git branch --show-current
```

Stop and ask the user if:
- Working tree is dirty (uncommitted changes exist).
- Current branch isn't `master` — the Pages workflow only triggers on `master`.
- An active run is already queued (`gh run list --limit 2`). Don't stack pushes unless the user asked.

---

## Push

```bash
git push origin master
```

If the push is rejected for being behind, **do not** force-push. Pull with rebase (`git pull --rebase origin master`)
and retry.

---

## Watch

Get the new run id:

```bash
gh run list --limit 2
```

For a single long-running check, use the non-polling form:

```bash
gh run watch <run-id>
```

Don't spam `gh run list` in a loop — either use `watch` or just wait ~30s and re-check once.

---

## Verify live

Three smoke checks after the run goes green:

```bash
curl -sI https://jackbereson.github.io/ | head -5
curl -sI https://jackbereson.github.io/blog.html | head -5
# Pick a slug from the build-posts log:
curl -sI "https://jackbereson.github.io/posts/<slug>.html" | head -5
```

All should return `HTTP/2 200` and a `last-modified` within the last minute.

If anything returns 404 or a stale `last-modified`:
- GitHub Pages sometimes serves cached HTML for 30–60s after deploy. Wait and retry once.
- Browser cache can also lie — remind the user to hard-refresh (Cmd+Shift+R).

---

## `build-posts.js` step specifics

This step has `continue-on-error: true`. Meaning:

- **Succeeded**: `docs/posts/*.html` and `docs/posts/index.json` were regenerated. Social scrapers see
  baked-in meta for the 30 latest dev.to rising articles.
- **Failed**: the previous run's `docs/posts/` is served (since GitHub Pages keeps the artifact). The
  blog list still works via client-side fetch. Only *direct* `/posts/<slug>.html` URLs that existed
  in the prior build remain valid; newer articles fall back to `/blog-post.html?id=...`.

Either way, the deploy step succeeds. Check `gh run view <id> --log` for the build-posts output if
pages look stale.

---

## Failure playbook

| Symptom | Likely cause | Fix |
|---|---|---|
| `deploy-pages` step fails with "Pages site not found" | Pages not enabled in repo settings | Enable Settings → Pages → Source: GitHub Actions |
| `build-posts.js` times out | dev.to rate-limit or outage | Acceptable; continue-on-error means deploy proceeded |
| Live site shows old HTML after deploy succeeded | Browser cache | Hard-refresh; or add `?v=N` to the URL |
| 404 on `/posts/<slug>.html` after deploy | Slug changed on dev.to between builds | User hits client-side fallback via `blog-post.html` — no action needed |
| Workflow never triggers | Push went to a non-`master` branch | `git push origin HEAD:master` |

---

## Report back

Give the user:

1. Commit SHA (first 7 chars) that was deployed.
2. Workflow run number + duration.
3. What changed (one-sentence summary).
4. Direct links to any affected live URLs.
5. Any caveats ("dev.to hiccup during build-posts — older /posts/ served", etc.).

Keep the report under **150 words** unless the user asked for details.
