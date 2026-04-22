#!/usr/bin/env node
/**
 * Pre-render dev.to articles into docs/posts/<slug>.html with full static
 * SEO tags (Open Graph, Twitter card, canonical, JSON-LD BlogPosting) and
 * the article body baked in. The list page (blog.html) links straight to
 * these pre-built files for articles that exist in the manifest, and falls
 * back to ./blog-post.html?id=... for anything else.
 *
 * Requires Node >= 18 (global fetch).
 */
'use strict';

const fs   = require('fs');
const path = require('path');

const SITE          = 'https://jackbereson.github.io';
const PER_PAGE      = 30;
const STATE         = 'rising';
const ROOT          = path.resolve(__dirname, '..');
const DOCS          = path.join(ROOT, 'docs');
const POSTS_DIR     = path.join(DOCS, 'posts');
const TEMPLATE_PATH = path.join(DOCS, 'blog-post.html');

async function main() {
  const t0 = Date.now();
  console.log('→ Fetching dev.to article list…');
  const listRes = await fetch(
    `https://dev.to/api/articles?per_page=${PER_PAGE}&state=${STATE}`,
    { headers: { 'User-Agent': 'jackbereson-site-build/1.0' } }
  );
  if (!listRes.ok) throw new Error(`dev.to list ${listRes.status}`);
  const list = await listRes.json();
  console.log(`  got ${list.length} articles`);

  // Fresh posts directory
  fs.mkdirSync(POSTS_DIR, { recursive: true });
  for (const f of fs.readdirSync(POSTS_DIR)) {
    if (f.endsWith('.html') || f === 'index.json') {
      fs.unlinkSync(path.join(POSTS_DIR, f));
    }
  }

  const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  const manifest = [];
  let ok = 0, skipped = 0;

  for (const stub of list) {
    try {
      const res = await fetch(`https://dev.to/api/articles/${stub.id}`, {
        headers: { 'User-Agent': 'jackbereson-site-build/1.0' },
      });
      if (!res.ok) { console.warn(`  skip ${stub.slug}: HTTP ${res.status}`); skipped++; continue; }
      const a = await res.json();

      const tagArr = normalizeTags(a);
      const safeSlug = sanitizeSlug(a.slug || stub.slug || String(a.id));
      const post = {
        id:          a.id,
        slug:        safeSlug,
        title:       a.title || 'Untitled',
        description: a.description || '',
        author:      a.user?.name || 'dev.to',
        authorImg:   a.user?.profile_image_90 || a.user?.profile_image || '',
        authorUrl:   a.user?.username ? `https://dev.to/${a.user.username}` : '',
        publishedAt: a.published_at || a.created_at || '',
        readTime:    a.reading_time_minutes || 5,
        reactions:   a.positive_reactions_count || 0,
        comments:    a.comments_count || 0,
        coverImage:  a.cover_image || a.social_image || `https://picsum.photos/seed/${a.id}/1200/675`,
        bodyHtml:    a.body_html || '',
        tags:        tagArr,
        category:    (tagArr[0] || 'general').toUpperCase(),
        sourceUrl:   a.url || '',
      };

      const html = renderTemplate(template, post);
      fs.writeFileSync(path.join(POSTS_DIR, `${safeSlug}.html`), html);

      manifest.push({
        id:          post.id,
        slug:        post.slug,
        title:       post.title,
        description: post.description,
        coverImage:  post.coverImage,
        publishedAt: post.publishedAt,
        tags:        post.tags,
        category:    post.category,
      });
      ok++;
    } catch (e) {
      console.warn(`  skip ${stub?.slug || stub?.id}: ${e.message}`);
      skipped++;
    }
  }

  const manifestObj = {
    generatedAt: new Date().toISOString(),
    count:       manifest.length,
    posts:       manifest,
  };
  fs.writeFileSync(
    path.join(POSTS_DIR, 'index.json'),
    JSON.stringify(manifestObj, null, 2)
  );

  const dt = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`✓ Prerendered ${ok} posts (${skipped} skipped) → docs/posts/ in ${dt}s`);
}

/* ─── Helpers ─────────────────────────────────────── */

function normalizeTags(a) {
  if (Array.isArray(a.tag_list)) return a.tag_list;
  if (typeof a.tag_list === 'string') return a.tag_list.split(/,\s*/).filter(Boolean);
  if (Array.isArray(a.tags))     return a.tags;
  if (typeof a.tags === 'string') return a.tags.split(/,\s*/).filter(Boolean);
  return [];
}

function sanitizeSlug(s) {
  return String(s || 'post')
    .replace(/[^a-zA-Z0-9\-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120) || 'post';
}

function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(s) {
  return escapeHtml(s);
}

function fmtDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

function renderTemplate(tpl, post) {
  const pageUrl   = `${SITE}/posts/${post.slug}.html`;
  const desc      = (post.description || '').slice(0, 300) ||
                    `An article from Jack Bereson's engineering blog.`;
  const image     = post.coverImage;
  const fullTitle = `${post.title} — Jack Bereson`;

  let out = tpl;

  // 1. Flag the page as prerendered so the inline fetcher in blog-post.html skips
  out = out.replace('<html lang="en">', '<html lang="en" data-prerendered="true">');

  // 2. <title>
  out = out.replace(
    /<title>[\s\S]*?<\/title>/,
    `<title>${escapeHtml(fullTitle)}</title>`
  );

  // 3. <meta name="description">
  out = out.replace(
    /<meta name="description" content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${escapeAttr(desc)}" />`
  );

  // 4. canonical
  out = out.replace(
    /<link rel="canonical" id="meta-canonical" href="[^"]*"\s*\/?>/,
    `<link rel="canonical" id="meta-canonical" href="${escapeAttr(pageUrl)}" />`
  );

  // 5. OG / Twitter meta (match by id="…")
  const replaceMetaById = (id, val) => {
    const re = new RegExp(
      `(<meta[^>]+id="${id}"[^>]*\\bcontent=")[^"]*(")`
    );
    out = out.replace(re, (_, a, b) => a + escapeAttr(val) + b);
  };
  replaceMetaById('og-url',         pageUrl);
  replaceMetaById('og-title',       fullTitle);
  replaceMetaById('og-description', desc);
  replaceMetaById('og-image',       image);
  replaceMetaById('tw-title',       fullTitle);
  replaceMetaById('tw-description', desc);
  replaceMetaById('tw-image',       image);

  // 6. Inject article:* meta + JSON-LD BlogPosting just before </head>
  const articleMeta = [
    post.publishedAt && `<meta property="article:published_time" content="${escapeAttr(post.publishedAt)}" />`,
    post.author      && `<meta property="article:author"         content="${escapeAttr(post.author)}" />`,
    post.category    && `<meta property="article:section"        content="${escapeAttr(post.category)}" />`,
    ...(post.tags || []).slice(0, 6).map(t =>
      `<meta property="article:tag" content="${escapeAttr(t)}" />`
    ),
  ].filter(Boolean).join('\n  ');

  const ld = {
    '@context':      'https://schema.org',
    '@type':         'BlogPosting',
    headline:        post.title,
    description:     desc,
    image:           [image],
    datePublished:   post.publishedAt || undefined,
    author: {
      '@type': 'Person',
      name:    post.author,
      url:     post.authorUrl || undefined,
    },
    publisher: {
      '@type': 'Person',
      name:    'Jack Bereson',
      url:     'https://jackbereson.github.io/',
    },
    mainEntityOfPage: pageUrl,
    keywords:        (post.tags || []).join(', ') || undefined,
  };
  const ldScript =
    `<script type="application/ld+json" id="ld-article">\n` +
    JSON.stringify(ld, null, 2) +
    `\n</script>`;

  out = out.replace(
    '</head>',
    `  ${articleMeta}\n  ${ldScript}\n</head>`
  );

  // 7. Bake the article body into <div id="article">…</div>
  const bakedArticle = renderArticleHTML(post);
  out = out.replace(
    /<div id="article">[\s\S]*?<\/div>\s*<\/main>/,
    `<div id="article">\n${bakedArticle}\n    </div>\n  </main>`
  );

  // 8. Fix the back-link and Résumé/link asset paths since pre-rendered
  //    files live under /posts/ instead of the docs root.
  out = out.replace(/href="\.\/blog\.html"/g,  'href="../blog.html"');
  out = out.replace(/href="\.\/resume\.html"/g, 'href="../resume.html"');
  out = out.replace(/href="\.\/index\.html"/g,  'href="../index.html"');
  out = out.replace(/href="\.\/common\.js"/g,   'href="../common.js"');
  out = out.replace(/src="\.\/common\.js"/g,    'src="../common.js"');
  out = out.replace(/href="\.\/apple-touch-icon\.png"/g,   'href="../apple-touch-icon.png"');
  out = out.replace(/href="\.\/favicon-32x32\.png"/g,      'href="../favicon-32x32.png"');
  out = out.replace(/href="\.\/favicon-16x16\.png"/g,      'href="../favicon-16x16.png"');
  out = out.replace(/href="\.\/site\.webmanifest"/g,       'href="../site.webmanifest"');

  return out;
}

function renderArticleHTML(post) {
  const tagsHtml = (post.tags || []).slice(0, 8)
    .map(t => `<span class="art-tag">${escapeHtml(t)}</span>`).join('');

  const meta = [
    post.publishedAt ? `<span>${escapeHtml(fmtDate(post.publishedAt))}</span>` : '',
    `<span class="dot">${post.readTime || 5} min read</span>`,
    post.reactions ? `<span class="dot">❤ ${post.reactions}</span>` : '',
    post.comments  ? `<span class="dot">💬 ${post.comments}</span>`  : '',
  ].filter(Boolean).join('');

  const author = post.author ? `
          <div class="art-author">
            ${post.authorImg ? `<img src="${escapeAttr(post.authorImg)}" alt="${escapeAttr(post.author)}">` : ''}
            <span class="art-author-name">${escapeHtml(post.author)}</span>
          </div>` : '';

  const sourceFooter = post.sourceUrl ? `
        <div class="art-footer">
          <div class="art-footer-left">
            <div class="art-footer-title">Originally published on dev.to</div>
            <div class="art-footer-sub">This article is mirrored here from its original source.</div>
          </div>
          <a class="art-source-btn" href="${escapeAttr(post.sourceUrl)}" target="_blank" rel="noopener">
            Read on dev.to
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M7 17 17 7M8 7h9v9"/>
            </svg>
          </a>
        </div>` : '';

  return `        <span class="art-cat">${escapeHtml(post.category)}</span>
        <h1 class="art-title">${escapeHtml(post.title)}</h1>
        ${post.description ? `<p class="art-excerpt">${escapeHtml(post.description)}</p>` : ''}
        <div class="art-meta">${author}
          ${author && meta ? '<span class="sep">·</span>' : ''}
          ${meta}
        </div>
        ${post.coverImage ? `<div class="art-cover" style="background-image:url('${escapeAttr(post.coverImage)}')"></div>` : ''}
        <article class="art-body">${post.bodyHtml}</article>
        ${tagsHtml ? `<div class="art-tags">${tagsHtml}</div>` : ''}${sourceFooter}`;
}

main().catch(e => { console.error('✗ Build failed:', e); process.exit(1); });
