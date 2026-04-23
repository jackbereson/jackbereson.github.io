# API conventions — jackbereson.github.io

There are three data modes in this site, toggled by `CONFIG.MODE` in `docs/blog.html` and
`docs/blog-post.html`. Only **one** is active in production (`devto`). Keep the other two working as
reference for future content migrations.

---

## Mode: `devto` (production)

Public dev.to REST API. No auth, no CORS issues from the browser.

### Endpoints used

| Call | URL | Response shape |
|---|---|---|
| List | `GET https://dev.to/api/articles?per_page=30&state=rising` | `Article[]` |
| Single | `GET https://dev.to/api/articles/{id}` | `Article` with full `body_html` |
| By path | `GET https://dev.to/api/articles/{username}/{slug}` | `Article` (alternate lookup) |

### The `tag_list` gotcha 🐛

dev.to returns `tag_list` in **different shapes** depending on the endpoint:

| Endpoint | `tag_list` type |
|---|---|
| `/api/articles` (list) | `string[]` — e.g. `["javascript", "webdev"]` |
| `/api/articles/{id}` (single) | `string` — e.g. `"javascript, webdev"` |

**Always normalize** before using:

```js
const tagArr = Array.isArray(a.tag_list)
  ? a.tag_list
  : typeof a.tag_list === 'string'
    ? a.tag_list.split(/,\s*/).filter(Boolean)
    : Array.isArray(a.tags)
      ? a.tags
      : typeof a.tags === 'string'
        ? a.tags.split(/,\s*/).filter(Boolean)
        : [];
```

This function lives in `scripts/build-posts.js` as `normalizeTags()` and inline in `docs/blog-post.html`.
If you need it in a third place, factor it out rather than duplicating.

### Mapping dev.to → our `post` shape

```js
{
  _id:        String(a.id),
  slug:       a.slug,
  url:        a.url,                                 // original dev.to URL
  title:      a.title,
  excerpt:    a.description || '',
  category:   (tagArr[0] || 'general').toUpperCase(),
  tags:       tagArr,
  author:     a.user?.name || 'dev.to',
  authorImg:  a.user?.profile_image_90 || a.user?.profile_image || '',
  readTime:   a.reading_time_minutes || 5,
  publishedAt: a.published_at || a.created_at,
  reactions:  a.positive_reactions_count || 0,
  comments:   a.comments_count || 0,
  coverImage: a.cover_image || a.social_image || `https://picsum.photos/seed/${a.id}/1200/675`,
  bodyHtml:   a.body_html || '',                     // only on single-article responses
}
```

### Cover image fallback chain

1. `a.cover_image` — dev.to's preferred 1000×420 cover
2. `a.social_image` — fallback Twitter/OG image
3. `https://picsum.photos/seed/<article-id>/1200/675` — deterministic placeholder (same image every
   time for the same article, so it doesn't flicker between reloads)

### Rate limits

dev.to's public API is generous (no documented hard limit) but be polite. The build script makes
**1 + N** calls per CI run (1 list + 30 singles). That's fine. Don't hammer it from a loop.

---

## Mode: `atlas` (optional — experimental)

MongoDB Atlas Data API — HTTP-based access to a cluster without running a server.

### Setup (user's personal credentials, not committed)

```js
CONFIG.MODE          = 'atlas';
CONFIG.ATLAS_APP_ID  = 'your-atlas-app-id';
CONFIG.ATLAS_API_KEY = 'your-atlas-api-key';
CONFIG.ATLAS_CLUSTER = 'Cluster0';
CONFIG.ATLAS_DB      = 'blog';
CONFIG.ATLAS_COL     = 'blogs';
```

### Endpoint

```
POST https://data.mongodb-api.com/app/{APP_ID}/endpoint/data/v1/action/find
Headers: Content-Type: application/json, api-key: {API_KEY}
Body: { dataSource, database, collection, filter, sort, limit }
```

### Seeding

If Jack switches to Atlas mode, `/server/seed.js` has sample content that can be run against the
cluster (requires `.env` with `MONGODB_URI`).

---

## Mode: `express` (local dev only)

Pair with the Express server in `/server/`.

```js
CONFIG.MODE         = 'express';
CONFIG.EXPRESS_BASE = 'http://localhost:3001/api';
```

Routes:

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/blogs` | List (supports `?page`, `?limit`, `?tag`, `?category`) |
| GET | `/api/blogs/:id` | Single by ObjectId or slug |
| POST | `/api/blogs` | Create |
| PUT | `/api/blogs/:id` | Update |
| DELETE | `/api/blogs/:id` | Delete |

The server uses `helmet` + `cors` with an `ALLOWED_ORIGINS` env var. Don't run in prod — it's reference.

---

## Switching modes safely

1. Change `CONFIG.MODE` in **both** `docs/blog.html` and `docs/blog-post.html` (they're independent files).
2. Update `scripts/build-posts.js` if you want pre-rendered pages to use the new source — today it's
   hardcoded to dev.to.
3. Update the status badge label (`setBadge()`) so users see the correct "dev.to connected" / "Atlas
   connected" text.
4. Verify the fallback mock data still loads when the API is unreachable.
