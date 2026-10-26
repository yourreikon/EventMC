/* Accessible, lightweight navigation polish. Works on GitHub Pages and uses no API. */
(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === '_blank') return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.pathname === location.pathname && url.hash) return;
    if (url.pathname.split('/').pop().includes('.')) {
      event.preventDefault(); document.body.classList.add('page-leaving');
      window.setTimeout(() => { location.href = url.href; }, 110);
    }
  });
})();
