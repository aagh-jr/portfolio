// Shared nav + footer injector

(function () {
  const PAGE = location.pathname.split('/').pop() || 'index.html';

  const links = [
    { href: 'index.html',    label: 'Home' },
    { href: 'projects.html', label: 'Projects' },
    { href: 'about.html',    label: 'About' },
    { href: 'contact.html',  label: 'Contact' },
  ];

  const nav = document.createElement('nav');
  nav.className = 'pf-nav';
  nav.innerHTML = `
    <div class="pf-nav-inner">
      <a href="index.html" class="pf-nav-logo">Abel Angel<span>.</span></a>
      <div class="pf-nav-links">
        ${links.map(l => `<a href="${l.href}" class="${PAGE === l.href ? 'active' : ''}">${l.label}</a>`).join('')}
      </div>
    </div>`;
  document.body.prepend(nav);

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  const footer = document.createElement('footer');
  footer.className = 'pf-footer';
  footer.innerHTML = `<strong>Abel Angel</strong> &nbsp;·&nbsp; Researcher, Designer, Builder &nbsp;·&nbsp; San Jose, CA`;
  document.body.append(footer);
})();
