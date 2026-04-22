// Shared header + footer injected into every page that has
// <div id="site-header"></div> and <div id="site-footer"></div> placeholders.
(function () {
  const header = `
<header class="nav">
  <div class="nav-inner">
    <a href="./index.html" class="brand">
      <span class="brand-mark">JB</span>
      <span class="brand-text">
        <span class="brand-name">Jack Bereson</span>
        <span class="brand-sub">Senior Fullstack Engineer</span>
      </span>
    </a>
    <nav class="menu">
      <a href="./index.html#work">Work</a>
      <a href="./index.html#lab">Lab</a>
      <a href="./index.html#stack">Stack</a>
      <a href="./blog.html">Blog</a>
      <a href="./index.html#contact">Contact</a>
    </nav>
    <div class="nav-actions">
      <a href="https://github.com/jackbereson" target="_blank" class="btn-ghost">GitHub</a>
      <a href="./resume.html" class="btn-solid">
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
      <a href="./index.html">Portfolio</a> ·
      <a href="./resume.html">Resume</a> ·
      <a href="https://github.com/jackbereson" target="_blank">GitHub</a> ·
      <a href="./le-thanh-vuong-js-fullstack-blockchain.pdf" target="_blank">Download PDF</a>
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

  // Update year tokens
  const y = new Date().getFullYear();
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = y; });

  // Highlight active nav item based on current page / hash
  const menu = document.querySelector('.menu');
  if (menu) {
    const path = location.pathname.split('/').pop() || 'index.html';
    const hash = location.hash;
    menu.querySelectorAll('a').forEach(a => {
      const href = a.getAttribute('href') || '';
      if (path === 'blog.html'   && href === './blog.html')   { a.classList.add('active'); return; }
      if (path === 'resume.html' && href === './resume.html') { a.classList.add('active'); return; }
      if (path === 'index.html'  && hash && href === `./index.html${hash}`) { a.classList.add('active'); return; }
      if (path === 'index.html'  && !hash && href === './index.html#work')  { a.classList.add('active'); return; }
    });
  }
})();
