# Code style — jackbereson.github.io

Conventions for editing `/docs/*.html`, `docs/common.js`, and `scripts/build-posts.js`.

---

## HTML

- **5-space indent inside `<head>` tokens, 2-space elsewhere** — match existing file.
- Self-closing tags: `<meta ... />` with the trailing slash, for consistency with how `index.html`
  was authored.
- Always include `lang="en"` on `<html>`.
- Every page needs:
  ```html
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>…</title>
  <meta name="description" content="…" />
  <meta name="theme-color" content="#0a0a0a" />
  <link rel="canonical" href="…" />
  ```
- SEO block order: title → description → author/keywords → theme-color → robots → canonical →
  favicons → Open Graph → Twitter → JSON-LD.

### Navigation placeholders

Pages that want the shared nav/footer use these two divs (common.js replaces them on load):

```html
<div id="site-header"></div>
…
<div id="site-footer"></div>
<script src="./common.js"></script>
```

For pre-rendered pages under `/posts/`, the script src is rewritten to `../common.js` by
`scripts/build-posts.js`.

---

## CSS (inline in `<style>` per page)

### Design tokens (duplicated in every page — keep them in sync!)

```css
:root {
  --bg:                  #0a0a0a;
  --bg-2:                #111113;
  --ink:                 #ffffff;
  --ink-2:               rgba(255,255,255,0.72);
  --ink-3:               rgba(255,255,255,0.52);
  --ink-4:               rgba(255,255,255,0.36);
  --glass-bg:            rgba(255,255,255,0.06);
  --glass-bg-strong:     rgba(255,255,255,0.12);
  --glass-border:        rgba(255,255,255,0.14);
  --glass-border-strong: rgba(255,255,255,0.22);
  --accent-1: #6366f1;  /* indigo */
  --accent-2: #ec4899;  /* pink */
  --accent-3: #f59e0b;  /* amber */
  --accent-4: #10b981;  /* emerald */
}
```

### Typography

- Primary font: **Inter** (300–900), loaded from Google Fonts with `preconnect`.
- Code font: **JetBrains Mono**, only on pages that render code (`blog-post.html`).
- Heading gradient pattern:
  ```css
  background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.75) 100%);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
  ```

### Layout primitives

- **Glassmorphism card**:
  ```css
  background: rgba(255,255,255,0.055);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  ```
- **Orbs** (atmospheric background): `position:absolute; border-radius:50%; filter:blur(80px); opacity:0.45`
  with `@keyframes float1/2/3` (18s/22s/26s).
- **Grid overlay**: two crossing `linear-gradient(1px transparent)`s at `60px` spacing with a radial mask.
- **Grain overlay**: inline SVG `feTurbulence` with `mix-blend-mode: overlay` at 0.05 opacity.
- **Scanline**: 2px gradient bar with `@keyframes scan` running 6s linear infinite.

### Responsive

- Primary breakpoint: `@media (max-width: 900px)` — collapses menu and hero layouts.
- Secondary: `@media (max-width: 640px)` — tightens padding on article pages.

---

## JavaScript

### Style

- Use `const` by default, `let` only when reassignment is required. No `var`.
- Arrow functions for callbacks. Named `function` declarations for top-level utilities (easier to trace
  in DevTools).
- Template literals for HTML building.
- `document.getElementById` for known IDs, `querySelector` for anything else.
- No frameworks. No bundler. No npm dependencies in shipped code.

### Card navigation — LESSONS FROM PAST BUGS

Pick ONE of these patterns. Do **not** invent new ones.

✅ **Real anchor tag** (preferred for semantic HTML, middle-click to new tab, right-click menu,
    prefetching, SEO):

```js
const href = `./blog-post.html?id=${encodeURIComponent(id)}&amp;slug=${encodeURIComponent(slug)}`;
return `<a class="blog-card" href="${href}">…</a>`;
```

✅ **`data-href` + delegation** (for cards that must be `<article>` or `<div>` for other reasons):

```js
return `<article class="blog-card" data-href="./post.html?id=${encodeURIComponent(id)}">…</article>`;

// Once, at script bottom:
document.addEventListener('click', e => {
  const el = e.target.closest('[data-href]');
  if (el) location.href = el.getAttribute('data-href');
});
```

❌ **NEVER** inline onclick with `JSON.stringify(...)`:

```js
// Bug: JSON.stringify returns a string with " at both ends,
// which terminates the onclick=" attribute early → SyntaxError.
return `<article onclick="location.href=${JSON.stringify(url)}">`;
```

### Fetch patterns

- Always wrap with `AbortSignal.timeout(ms)`:
  ```js
  fetch(url, { signal: AbortSignal.timeout(8000) })
  ```
- Always have a fallback path (mock data or cached manifest) so the page works when dev.to is down.
- Normalize tag arrays — see `.claude/rules/api-conventions.md`.

### DOM updates

- Build HTML as a template string, assign via `innerHTML` / `outerHTML`. Avoid repeated `createElement`
  when inserting many items.
- For lists, use `requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('in')))` to
  trigger CSS `transition` reveals (double-RAF forces layout recalculation).

---

## `scripts/build-posts.js`

- Node 18+ required (global `fetch`). Don't introduce dependencies — the script is intentionally
  dependency-free so CI doesn't need `npm install`.
- Use `require()` (CommonJS) — the file has no `"type": "module"` in root `package.json` and adding one
  would break the legacy toolchain.
- When adding new meta replacement, use `replaceMetaById(id, val)` — matching by `id="..."` is safer
  than matching by `property="..."` (which has multiple occurrences).
- Every user-supplied string that ends up in HTML must go through `escapeHtml()` or `escapeAttr()`.
  The only exception is `post.bodyHtml` which is already sanitized HTML from dev.to.

---

## Quick reference

| Want to… | File |
|---|---|
| Change hero headline | `docs/index.html` |
| Add a blog section | `docs/blog.html` |
| Adjust post detail layout | `docs/blog-post.html` + `scripts/build-posts.js` (template) |
| Update shared nav | `docs/common.js` |
| Change what gets pre-rendered | `scripts/build-posts.js` (`PER_PAGE`, `STATE`) |
| Modify deploy pipeline | `.github/workflows/deploy.yml` |
