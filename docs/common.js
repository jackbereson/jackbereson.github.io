// Shared header + footer injected into every page that has
// <div id="site-header"></div> and <div id="site-footer"></div> placeholders.
(function () {
  // Pages under /posts/<slug>.html need to climb one level to reach the
  // site root; everything else is already at the root.
  const PREFIX = location.pathname.includes('/posts/') ? '../' : './';

  // Theme tokens live inline in each page; only the toggle's own styling is
  // injected here so it isn't duplicated across five <style> blocks.
  const themeCss = `
.theme-toggle {
  /* Sized to match the .btn-ghost / .btn-solid siblings so the toggle reads as
     part of the button group. Their padding — and so their height — differs per
     page, hence the --btn-size / --btn-radius overrides in the page <style>. */
  width: var(--btn-size, 38px); height: var(--btn-size, 38px); flex-shrink: 0;
  display: inline-flex; align-items: center; justify-content: center;
  padding: 0; cursor: pointer; font: inherit;
  color: var(--ink);
  background: var(--glass-bg);
  border: 1px solid var(--glass-border-strong);
  border-radius: var(--btn-radius, 12px);
  transition: color 0.2s, background 0.2s, border-color 0.2s;
}
.theme-toggle:hover { background: var(--glass-bg-strong); border-color: var(--hov-4); }
.theme-toggle:focus-visible { outline: 2px solid var(--accent-1, #6366f1); outline-offset: 2px; }
.theme-toggle svg { width: 17px; height: 17px; }
.theme-toggle .ic-moon { display: none; }
html[data-theme="dark"] .theme-toggle .ic-sun  { display: none; }
html[data-theme="dark"] .theme-toggle .ic-moon { display: block; }
@media print { .theme-toggle { display: none; } }
`;

  const themeStyle = document.createElement('style');
  themeStyle.textContent = themeCss;
  document.head.appendChild(themeStyle);

  const header = `
<header class="nav">
  <div class="nav-inner">
    <a href="${PREFIX}index.html" class="brand">
      <span class="brand-mark">JB</span>
      <span class="brand-text">
        <span class="brand-name">Jack Bereson</span>
        <span class="brand-sub">Senior Fullstack Engineer</span>
      </span>
    </a>
    <nav class="menu">
      <a href="${PREFIX}index.html#work">Work</a>
      <a href="${PREFIX}index.html#lab">Lab</a>
      <a href="${PREFIX}index.html#stack">Stack</a>
      <a href="${PREFIX}blog.html">Blog</a>
      <a href="${PREFIX}games.html">Games</a>
      <a href="${PREFIX}index.html#contact">Contact</a>
    </nav>
    <div class="nav-actions">
      <button type="button" class="theme-toggle" id="themeToggle" aria-label="Switch color theme" title="Switch light / dark">
        <svg class="ic-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
        <svg class="ic-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>
      </button>
      <a href="https://github.com/jackbereson" target="_blank" class="btn-ghost">GitHub</a>
      <a href="${PREFIX}resume.html" class="btn-solid">
        Résumé
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </a>
    </div>
  </div>
</header>
`;

  const footer = `
<footer class="site-foot">
  <div class="container">
    <div>© <span data-year></span> Jack Bereson. All rights reserved.</div>
    <div>
      <a href="${PREFIX}index.html">Portfolio</a> ·
      <a href="${PREFIX}resume.html">Resume</a> ·
      <a href="https://github.com/jackbereson" target="_blank">GitHub</a> ·
      <a href="${PREFIX}le-thanh-vuong-js-fullstack-blockchain.pdf" target="_blank">Download PDF</a>
    </div>
  </div>
</footer>
`;

  function inject(id, html) {
    const slot = document.getElementById(id);
    if (!slot) return;
    slot.outerHTML = html;
  }

  inject('site-header', header);
  inject('site-footer', footer);

  // Theme switch. The <head> boot script already stamped data-theme before
  // first paint; this only handles flipping and persisting it.
  const THEME_META = { light: '#f4f6fc', dark: '#0a0a0a' };

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', THEME_META[theme]);
    const btn = document.getElementById('themeToggle');
    if (btn) {
      const next = theme === 'dark' ? 'light' : 'dark';
      btn.setAttribute('title', 'Switch to ' + next + ' theme');
      btn.setAttribute('aria-label', 'Switch to ' + next + ' theme');
    }
  }

  const toggle = document.getElementById('themeToggle');
  if (toggle) {
    applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
    toggle.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem('theme', next); } catch (e) { /* private mode */ }
    });
  }

  // Update year tokens
  const y = new Date().getFullYear();
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = y; });

  // Highlight active nav item based on current page / hash
  const menu = document.querySelector('.menu');
  if (menu) {
    const path   = location.pathname.split('/').pop() || 'index.html';
    const hash   = location.hash;
    const inPost = location.pathname.includes('/posts/') ||
                   path === 'blog-post.html' ||
                   path === 'blog.html';

    menu.querySelectorAll('a').forEach(a => {
      const href = a.getAttribute('href') || '';
      // Any blog list / detail / pre-rendered post lights up the Blog tab.
      if (inPost && href.endsWith('blog.html')) { a.classList.add('active'); return; }
      if (path === 'resume.html' && href.endsWith('resume.html')) { a.classList.add('active'); return; }
      if (path === 'index.html'  && hash && href.endsWith(`index.html${hash}`)) { a.classList.add('active'); return; }
      if (path === 'index.html'  && !hash && href.endsWith('index.html#work'))  { a.classList.add('active'); return; }
    });
  }
})();
