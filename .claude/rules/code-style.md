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

### Theming — light is the default

Every page ships **two** token blocks in its inline `<style>`:

- `:root { … }` — the **light** theme (the default) with `color-scheme: light`
- `html[data-theme="dark"] { … }` — the dark overrides with `color-scheme: dark`

An anti-FOUC boot script sits in `<head>` **before** the `<style>` block and stamps
`data-theme` from `localStorage` prior to first paint:

```html
<script>
  (function () {
    try {
      var t = localStorage.getItem('theme');
      if (t === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    } catch (e) {}
  })();
</script>
```

Light is the default deliberately — we do **not** read `prefers-color-scheme`. Only an explicit
toggle click (persisted to `localStorage.theme`) switches to dark.

The toggle button markup + CSS live in `docs/common.js`, not in the page `<style>` blocks, so they
aren't duplicated five times. `applyTheme()` there also rewrites `<meta name="theme-color">`
(`#f4f6fc` light / `#0a0a0a` dark).

**Rule: never hardcode a color that differs between themes.** Add a token to both blocks instead.

### Design tokens (duplicated in every page — keep them in sync!)

```css
:root {
  color-scheme: light;

  --bg:                  #f4f6fc;   /* dark: #0a0a0a */
  --bg-2:                #ffffff;   /* dark: #111113 */
  --ink:                 #0b1220;   /* dark: #ffffff */
  --ink-2:               rgba(11,18,32,0.72);
  --ink-3:               rgba(11,18,32,0.56);
  --ink-4:               rgba(11,18,32,0.40);
  --glass-bg:            rgba(255,255,255,0.70);
  --glass-bg-strong:     rgba(255,255,255,0.92);
  --glass-border:        rgba(11,18,32,0.10);
  --glass-border-strong: rgba(11,18,32,0.18);

  /* Brand accents — identical in both themes */
  --accent-1: #6366f1;  /* indigo */
  --accent-2: #ec4899;  /* pink */
  --accent-3: #f59e0b;  /* amber */
  --accent-4: #10b981;  /* emerald */

  /* Raised surfaces (cards sitting on --bg) */
  --surf-1: rgba(255,255,255,0.72);
  --surf-2: rgba(255,255,255,0.86);
  --surf-3: #ffffff;

  /* Interaction tints laid over a surface */
  --hov-1: rgba(11,18,32,0.05);
  --hov-2: rgba(11,18,32,0.09);
  --hov-3: rgba(11,18,32,0.13);
  --hov-4: rgba(11,18,32,0.20);

  /* Inverted "solid" buttons */
  --solid-bg:   #0b1220;
  --solid-fg:   #ffffff;
  --solid-glow: rgba(11,18,32,0.22);

  --shadow-1: 0 6px 18px  rgba(11,18,32,0.10);
  --shadow-2: 0 8px 32px  rgba(11,18,32,0.10);
  --shadow-3: 0 12px 40px rgba(11,18,32,0.14);
  --shadow-4: 0 20px 60px rgba(11,18,32,0.18);

  /* Chrome */
  --nav-bg:        rgba(255,255,255,0.72);
  --nav-sheen:     rgba(255,255,255,0.90);
  --menu-bg:       rgba(11,18,32,0.05);
  --brand-mark-bg: linear-gradient(135deg, rgba(99,102,241,0.22), rgba(236,72,153,0.12));
  --panel-solid:   #e7eaf5;

  /* Atmosphere (orbs, grid, grain, scanline) */
  --stage-base:    #eef1fa;
  --main-mid:      #f2f4fb;
  --veil-rgb:      238,241,250;   /* used as rgba(var(--veil-rgb), α) in gradients */
  --orb-opacity:   0.30;
  --orb-a:         0.20;          /* per-stop alpha; scale with calc(var(--orb-a) * 0.8) */
  --grid-line:     rgba(99,102,241,0.12);
  --grid-line-2:   rgba(99,102,241,0.07);
  --grain-opacity: 0.035;
  --grain-blend:   multiply;      /* dark: overlay */
  --beam-core:     rgba(79,70,229,0.75);
  --beam-fade:     rgba(79,70,229,0);
  --beam-glow:     0 0 12px rgba(99,102,241,0.45), 0 0 24px rgba(99,102,241,0.25);
  --hero-shadow-1: none;
  --hero-shadow-2: none;

  /* Accent text that must stay readable on the page background.
     The pastel dark-theme accents (#a5b4fc, #c4b5fd …) are invisible on light —
     always use these for text, never --accent-1..4. */
  --accent-ink:  #4f46e5;
  --star-ink:    #b45309;
  --typing-grad: linear-gradient(135deg, #4f46e5, #c026d3, #0891b2);

  --code-bg: #f1f3fa;
  --img-bg:  #e7eaf5;
}
```

Page-specific extras: `games.html` adds `--scrim` / `--frame-bg`; `blog-post.html` adds
`--code-ink` / `--link-underline`; `resume.html` adds a per-hue readable-ink set
(`--ink-indigo`, `--ink-violet`, `--ink-pink`, `--ink-emerald`, `--ink-cyan`, `--ink-amber`).

### Theming gotchas

- **"Always-dark islands."** Card interiors that sit on a hardcoded dark overlay
  (`.card-overlay` in `games.html`, `.blog-tint`, `.proj-tint`) must **hardcode** light-on-dark
  text (`#fff`, `rgba(255,255,255,0.56)`), *not* `var(--ink-*)` — those flip to near-black on
  light and vanish against the overlay.
- **`background:` resets `background-clip`.** On an element using `background-clip: text` for
  gradient text, override with `background-image:`, or the label renders as a solid block.
- **Nav selector.** `common.js` injects `<header class="nav">`. Style `header.nav`, never
  `nav.nav` — that mismatch silently disabled the whole nav card on `resume.html` for a while.

### Typography

- Primary font: **Inter** (300–900), loaded from Google Fonts with `preconnect`.
- Code font: **JetBrains Mono**, only on pages that render code (`blog-post.html`).
- Heading gradient pattern (tokenized so it inverts with the theme):
  ```css
  background: linear-gradient(135deg, var(--ink) 0%, var(--ink-3) 100%);
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
