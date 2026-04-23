---
name: security-review
description: Run a pre-deploy security audit tailored for this static site — checks for XSS risks in injected HTML, exposed secrets, unsafe CORS/CSP, and unpinned third-party resources. Use before pushing to master, or when the user asks to "audit", "check security", "review for secrets", or "check this is safe to deploy".
---

# Security review — jackbereson.github.io

This site is static HTML served from GitHub Pages + a dev.to API fetch. The threat surface is small
but specific:

1. **XSS via dev.to content** — we inject `a.body_html` straight into the DOM (trusting dev.to).
2. **Credential leaks** — if someone commits `.env` or bakes an Atlas API key into `blog.html`.
3. **Unsafe CORS** on the optional `/server/` (not deployed, but can't ship a credential-allowed
   wildcard origin even in reference code).
4. **Unpinned CDNs** — `fonts.googleapis.com` is acceptable, but any new `<script src="cdn…">` is not.

---

## Checklist

### 1. Scan for committed secrets

```bash
# Staged or committed secret patterns anywhere in the repo
git ls-files | xargs grep -lE 'API_KEY|SECRET|MONGODB_URI|ATLAS.*KEY|Bearer [A-Za-z0-9]{20,}' 2>/dev/null | grep -v '\.env\.example' | grep -v 'node_modules'
```

Any hit outside `.env.example` is a **blocker**.

### 2. Verify `.env` is gitignored

```bash
cat .gitignore | grep -E '\.env|node_modules'
git ls-files | grep -E '(^|/)\.env$' && echo "❌ .env is tracked!"
```

### 3. Scan for inline onclick with user-controlled data

```bash
grep -rn 'onclick=.*\${.*post\.' docs/
grep -rn 'onclick=.*\${.*article\.' docs/
```

Any match → **potential XSS** via dev.to-controlled strings in an onclick handler. Refactor to
`<a href="...">` or `data-href` + delegation per `.claude/rules/code-style.md`.

### 4. Check `body_html` rendering

The only place we accept unsanitized HTML is `a.body_html` from dev.to. Verify:

- It's only assigned via `innerHTML` to an element with class `.art-body` (style-constrained).
- **No** user-controlled data flows into it. The `id` and `slug` query params are used for **lookup**,
  not rendering.
- The external-link rewrite at the bottom of `render()` does `setAttribute('target', '_blank')`, not
  string concatenation into innerHTML.

```bash
grep -n 'innerHTML' docs/blog-post.html docs/blog.html scripts/build-posts.js
```

Each hit should be either:
- Our own template string (safe — we authored it).
- `post.bodyHtml` (accepted risk — dev.to is the content source).

### 5. Verify SRI or origin-pinning on external resources

```bash
grep -rn '<script src=' docs/
grep -rn '<link.*href="https://' docs/
```

Allowed external origins:
- `fonts.googleapis.com` / `fonts.gstatic.com` — Google Fonts (ubiquitous, trusted).
- No other `<script src="https://…">` should exist.

If you find an unpinned CDN script, **replace with a local copy** or add SRI hashes.

### 6. `/server/` CORS sanity (if in diff)

In `server/index.js`, confirm:

- `origin: (origin, cb) => { … }` reads from `ALLOWED_ORIGINS` env var, not `origin: '*'`.
- `credentials: true` is **not** set unless specific origins are listed.
- `.env.example` contains `ALLOWED_ORIGINS=` (empty) rather than a permissive default.

### 7. CI workflow permissions

```bash
cat .github/workflows/deploy.yml | grep -E 'permissions:|contents:|pages:|id-token:'
```

Should read:
```
permissions:
  contents: read
  pages: write
  id-token: write
```

If `contents: write` creeps in (or any org-level secret is referenced), flag it.

---

## Output format

Return a **prioritized** list:

```
SECURITY REVIEW — jackbereson.github.io
────────────────────────────────────────
🔴 BLOCKER    (n findings)   ← secrets, XSS holes
🟡 WARNING    (n findings)   ← unpinned CDN, loose CORS
🟢 CLEAN      (n findings)   ← things verified safe

🔴 1. docs/blog.html:L241 — inline onclick with dev.to title
     onclick="alert(\"${post.title}\")"
     Fix: switch to <a href>, remove inline JS.

🟡 1. docs/index.html:L16 — Google Fonts without SRI
     <link href="https://fonts.googleapis.com/…">
     Accepted risk (commonly trusted CDN). Add SRI if paranoid.

🟢 1. No tracked .env file.
🟢 2. No hardcoded Atlas API keys.
```

Cap output at **300 words**. No exploitation PoCs. No speculation — only flag what's actually in the
diff or repo.
