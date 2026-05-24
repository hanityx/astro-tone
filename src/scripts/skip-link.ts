export function mountSkipLinkFocus(root: ParentNode = document) {
  root.querySelectorAll<HTMLAnchorElement>('a[href="#main-content"]').forEach((link) => {
    if (link.dataset.skipLinkReady === 'true') return;
    link.dataset.skipLinkReady = 'true';

    link.addEventListener('click', () => {
      const target = document.getElementById('main-content');
      if (!target) return;

      if (!target.hasAttribute('tabindex')) {
        target.setAttribute('tabindex', '-1');
      }

      requestAnimationFrame(() => target.focus({ preventScroll: true }));
    });
  });
}
