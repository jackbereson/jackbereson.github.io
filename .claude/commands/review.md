---
description: Review pending changes for quality, SEO impact, and design consistency
allowed-tools: Bash, Read, Grep, Glob, WebFetch
---

# /project:review

You are reviewing the pending changes on the current branch of **jackbereson.github.io**.

Be pragmatic — this is a small static site, not an enterprise app. Focus on things that actually matter here.

## 1. Survey the diff

Run in parallel:

```bash
git status
git diff --stat
git diff
git log --oneline -5
```

## 2. Checklist — only flag what's truly wrong

For each changed file, ask:

### `docs/*.html`

- **Inline onclick vs `<a href>`** — card navigation must use real anchor tags, never
  `onclick="location.href=..."` with embedded JSON.stringify (past bug: quote-in-quote broke handlers).
- **Design tokens** — `--accent-1` is `#6366f1`, `--accent-2` is `#ec4899`. If tokens changed, did
  the change propagate to `index.html`, `blog.html`, `blog-post.html`?
- **SEO block** — new pages must include canonical, OG, Twitter, favicon links. Cross-check with
  `index.html` as the reference.
- **common.js compatibility** — any page including `common.js` must have `<div id="site-header">`
  and `<div id="site-footer">` placeholders.

### `docs/common.js`

- Links must use the `${PREFIX}` prefix logic — pages under `/posts/<slug>.html` resolve `./` as
  `/posts/` and 404 on nav clicks.

### `scripts/build-posts.js`

- Does the regex still match the current `docs/blog-post.html` template? (Run the script locally to
  verify: `node scripts/build-posts.js && ls docs/posts/ | head`.)
- Path rewrites (`./common.js` → `../common.js`) still correct for every asset linked from blog-post.html?

### `.github/workflows/deploy.yml`

- `continue-on-error: true` preserved on the `build-posts` step so dev.to hiccups don't kill deploys?
- Node version still ≥ 18 (required for global `fetch`)?

### `server/**`

- `.env` files must never be committed. Double-check `.env` isn't in the diff.

## 3. SEO spot-check (only when a page changed)

If a live URL is relevant, fetch it and verify title/meta/JSON-LD are present in the HTML source:

```
WebFetch(https://jackbereson.github.io/..., "Is the JSON-LD schema present? Quote the og:title and og:image values verbatim.")
```

## 4. Deliver

Return:

1. **Verdict** — ✅ ship it / ⚠️ small asks / ❌ blocking issue
2. **Findings** — bullet list, each bullet cites file:line
3. **Suggestions** — only if actionable and worth the effort

Keep it **under 400 words** unless there's a serious issue. No vibes reviews.
