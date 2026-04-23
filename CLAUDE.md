# Jack Bereson — Portfolio & Blog

Team instructions for Claude Code on this repo. Everything here is **committed** and shared across all contributors.
Personal overrides live in `CLAUDE.local.md` (gitignored).

---

## What this project is

Static marketing + blog site for Jack Bereson (Senior Fullstack Engineer), deployed to GitHub Pages at
**https://jackbereson.github.io**.

- **Zero runtime backend in production** — the live site is 100% static HTML/CSS/JS served from `/docs/`.
- **Blog content comes from dev.to** via their public REST API. Articles are pre-rendered to
  `docs/posts/<slug>.html` at CI time so that social scrapers (Facebook, Twitter/X, Slack, LinkedIn,
  iMessage) get real Open Graph + Twitter Card meta tags, and a client-side fallback fetches fresh posts
  when the user browses `/blog.html` live.
- **Optional Express + MongoDB backend** lives in `/server/` for when Jack wants self-hosted content.
  It is **not** deployed — keep it working as reference code but do not remove.

---

## Repo map

```
.
├── CLAUDE.md                      ← you are here (team instructions)
├── CLAUDE.local.md                ← personal overrides, gitignored
├── .claude/                       ← Claude Code control center
│   ├── settings.json              ← permissions + config (committed)
│   ├── settings.local.json        ← personal permissions (gitignored)
│   ├── commands/                  ← /project:* slash commands
│   ├── rules/                     ← modular instruction files
│   ├── skills/                    ← auto-invoked workflows
│   ├── agents/                    ← subagent personas
│   ├── launch.json                ← local preview config for `npx serve docs`
│   └── worktrees/                 ← Claude worktree sandboxes
├── .github/workflows/
│   └── deploy.yml                 ← GitHub Actions → GitHub Pages
├── docs/                          ← deployed artifacts (Pages serves from here)
│   ├── index.html                 ← portfolio home
│   ├── blog.html                  ← blog list (bento grid + hero featured)
│   ├── blog-post.html             ← dynamic fallback detail page (dev.to fetch)
│   ├── resume.html                ← résumé page
│   ├── common.js                  ← shared <nav> + <footer> injection
│   ├── posts/                     ← GENERATED per-article static files (gitignored)
│   │   ├── <slug>.html
│   │   └── index.json             ← manifest blog.html consults to prefer pre-built URLs
│   ├── images/, favicon*, etc.
│   └── le-thanh-vuong-js-fullstack-blockchain.pdf
├── scripts/
│   └── build-posts.js             ← Node 18+ script; prerenders dev.to articles
├── server/                        ← OPTIONAL Express + MongoDB Atlas API
│   ├── index.js
│   ├── models/Blog.js
│   ├── routes/blogs.js
│   ├── seed.js
│   └── .env.example
├── src/                           ← LEGACY PostHTML/SCSS/Webpack source
│   ├── js/, scss/, views/, images/
│   └── (currently unused — /docs is authored directly)
├── webpack.config.js              ← legacy
├── posthtml.json                  ← legacy
├── package.json                   ← legacy build toolchain (npm run build)
└── README.MD
```

**Rule of thumb:** edit `/docs/` directly. The `/src/` + `webpack.config.js` + `posthtml.json` toolchain
is from an earlier incarnation of the site. Do **not** run `npm run build` — it will clobber `/docs/`
with stale output (`"clean": "rimraf docs/*"`). If you need to use SCSS or module partials again, first
audit and modernize the build pipeline.

---

## Deploy flow

1. Push to `master` → `.github/workflows/deploy.yml` fires.
2. Workflow steps (in order):
   - `actions/checkout@v4`
   - `actions/setup-node@v4` (Node 20)
   - **`node scripts/build-posts.js`** — fetches dev.to rising articles, writes `docs/posts/<slug>.html`
     and `docs/posts/index.json`. Guarded by `continue-on-error: true` so a dev.to blip doesn't block the deploy.
   - `actions/configure-pages@v5`
   - `actions/upload-pages-artifact@v3` with path `./docs`
   - `actions/deploy-pages@v4`
3. Pages URL: **https://jackbereson.github.io** (no custom domain).

Typical end-to-end deploy: **~20–30 seconds** from push to live.

---

## Design system (in-line, no CSS file)

Every page in `/docs/` inlines its CSS in a `<style>` block. Design tokens are duplicated per file — if
you change them, change them **in all three** (`index.html`, `blog.html`, `blog-post.html`, and the
template used by `scripts/build-posts.js` via `docs/blog-post.html`). See `.claude/rules/code-style.md`
for the full token list and component conventions.

Key vibes: **glassmorphism** over a dark `#05060f` stage, Inter font, indigo (`#6366f1`) + pink (`#ec4899`)
gradient accents, animated orbs with `filter: blur(80px)`, scanline + grain overlays.

---

## Blog data flow

```
┌────────────────────────────────────────────────────────────────────┐
│ blog.html (client)                                                 │
│  1. GET ./posts/index.json           → set of pre-built slugs      │
│  2. GET dev.to /api/articles         → list of 30 rising articles  │
│  3. render cards; for each article,                                │
│     href = PREBUILT ? ./posts/<slug>.html                          │
│                     : ./blog-post.html?id=<id>&slug=<slug>         │
└────────────────────────────────────────────────────────────────────┘

Pre-built path (covers 90% of traffic + social previews):
/posts/<slug>.html  ← fully static, og:*, twitter:*, JSON-LD baked in

Dynamic fallback (for articles newer than the last CI build):
/blog-post.html?id=<id>
  → init() fetches dev.to /api/articles/<id>
  → updateMeta(post) rewrites og:*/twitter:*/canonical/description,
     injects JSON-LD BlogPosting
  → render(post) builds the article DOM
  → guard: if <html data-prerendered="true">, skip fetch
```

**dev.to API gotcha:** the list endpoint returns `tag_list` as an **array**, the single-article endpoint
returns it as a **comma-separated string**. Always normalize — see `.claude/rules/api-conventions.md`.

---

## When making changes

- **Editing `/docs/*.html`**: update design tokens in **all three** pages + `scripts/build-posts.js` if
  you're changing anything used inside article pages.
- **Adding a new page under `/docs/`**: include the SEO block (canonical, OG, Twitter, JSON-LD) — see
  `index.html` as the reference template.
- **Changing `common.js`**: remember it runs on both root (`/blog.html`) and nested (`/posts/foo.html`)
  pages. The `PREFIX` logic at the top handles that — don't hardcode `./`.
- **Changing `scripts/build-posts.js`**: run it locally (`node scripts/build-posts.js`) before pushing
  to verify the regex replacements still match the template. Then `rm -rf docs/posts` so you don't
  accidentally commit the output.
- **Server changes**: `/server/` is not deployed, so no risk to prod — but keep it runnable (`npm install`
  inside `/server/` + `.env` with `MONGODB_URI`).

## When NOT to do things

- **Don't add Node dependencies to the root `package.json` for anything that ships to prod.** The deploy
  serves `/docs/` verbatim — the root toolchain is dev-only. If you need runtime JS, inline it or add a
  file under `/docs/`.
- **Don't commit `/docs/posts/`.** It's in `.gitignore`. CI regenerates it every run.
- **Don't use `npm run build`.** It's the legacy PostHTML pipeline and will wipe `/docs/`.

---

## Modular rules

The `.claude/rules/` folder contains focused instruction files. Consult them when touching the
matching area:

- **`code-style.md`** — HTML/CSS/JS conventions, design tokens, component patterns.
- **`testing.md`** — how to verify a change (curl, WebFetch, `gh run list`, local preview).
- **`api-conventions.md`** — dev.to API quirks, Express/Atlas fallback modes, data normalization.

---

## Slash commands

Available under `.claude/commands/`:

- `/project:review` — review pending changes for quality, SEO, and design consistency.
- `/project:fix-issue` — pick up a GitHub issue and implement a fix end-to-end.
- `/project:deploy` — push the current branch and monitor the Pages deploy to completion.

---

## Subagents & Skills

- **`.claude/agents/code-reviewer.md`** — diff-focused code review persona.
- **`.claude/agents/security-auditor.md`** — security audit persona for this static + dev.to setup.
- **`.claude/skills/security-review/`** — pre-deploy checklist (XSS, secrets, CORS, 3rd-party pins).
- **`.claude/skills/deploy/`** — push-and-verify workflow with GitHub Actions polling.
