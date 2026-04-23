# Testing & verification — jackbereson.github.io

There's no test framework in this repo (it's a ~5-file static site). "Testing" here means **smoke-checking
the live site and the CI pipeline** after a change lands. Follow this order, use the lightest tool that
answers the question.

---

## Tier 1 — Static sanity (no network)

Before pushing:

```bash
# HTML syntax roughly OK?
node -e "require('fs').readFileSync('docs/blog.html','utf8').length"

# Build script runs locally without throwing?
node scripts/build-posts.js

# Files got generated?
ls docs/posts/ | head

# Clean up so generated files don't get committed
rm -rf docs/posts
```

---

## Tier 2 — Local preview (Chrome / Safari)

For anything that touches rendering, actually open it in a browser:

```bash
npx serve docs -p 4321 --no-clipboard
# open http://localhost:4321/blog.html
```

(The same port + args are stored in `.claude/launch.json` so the IDE "Preview" action works.)

Things to spot-check manually:

- **Console is clean** — no red errors, no `SyntaxError`, no CORS warnings.
- **Network tab** — the dev.to fetch returns 200, article cover images load.
- **Click a card** — URL updates; the detail page renders with cover, body, tags.
- **Cmd-click a card** — opens in a new tab (proves it's a real `<a href>`).
- **Nav from `/posts/<slug>.html`** — clicking Blog/Work/Résumé goes to the right place, not
  `/posts/blog.html`.

---

## Tier 3 — Live site

After `git push origin master`:

```bash
gh run list --limit 2
```

Wait for the latest run to show `completed / success` (~20–30s). Then:

```bash
curl -sI https://jackbereson.github.io/ | head -5
curl -sI https://jackbereson.github.io/blog.html | head -5
curl -sI https://jackbereson.github.io/posts/<some-slug>.html | head -5
```

All three should return `HTTP/2 200`.

For SEO-critical changes, use WebFetch:

```
WebFetch(
  "https://jackbereson.github.io/posts/<slug>.html",
  "Quote the <title>, og:title, og:image, og:description, and the JSON-LD headline. Is the JSON-LD valid JSON?"
)
```

**Caveat:** WebFetch does **not** execute JavaScript. So on `blog.html` it will see "Fetching posts…"
instead of the rendered cards — that's expected and not a bug. The pre-rendered `/posts/<slug>.html`
pages, in contrast, have everything baked in and should report the full metadata.

---

## Tier 4 — Social previews

Only needed for SEO changes. Use external validators:

| Platform | Tool |
|---|---|
| Google rich results | https://search.google.com/test/rich-results |
| Facebook card | https://developers.facebook.com/tools/debug/ |
| Twitter/X card | https://cards-dev.twitter.com/validator (may require auth) |
| Generic | https://www.opengraph.xyz/ |

If a user reports "my post preview on Slack is wrong": Slack caches aggressively. Tell them to
unfurl-refresh by adding `?v=1` or wait ~1 hour.

---

## Regression checklist for big changes

When touching **anything** that generates cards or detail pages:

1. ☐ Grid cards click through (anchors not onclick)
2. ☐ Hero-featured cards click through
3. ☐ Cmd-click opens new tab
4. ☐ Direct URL access (`/posts/<slug>.html`) works
5. ☐ Dynamic fallback (`/blog-post.html?id=<id>`) still works when a slug is NOT in `posts/index.json`
6. ☐ Nav links from inside `/posts/` resolve correctly
7. ☐ OG meta on `/posts/<slug>.html` matches the article (not `"Loading article…"`)
8. ☐ JSON-LD validates (paste into Google's tool)
9. ☐ Page loads in <1s on throttled Fast 3G

---

## When something is broken in production

1. `gh run list --limit 5` — what's the last successful deploy?
2. `gh run view <last-bad-run-id> --log-failed` — what broke?
3. Reproduce locally: `node scripts/build-posts.js` with network logging (`NODE_DEBUG=https`).
4. If dev.to is down: the `continue-on-error` guard means the deploy still succeeded, but `/posts/` may
   be empty. Client-side fallback in `blog.html` will still fetch dev.to at runtime, so the list works.
   Detail pages only break if someone had a `/posts/<slug>.html` bookmarked — they'll get a Pages 404.
