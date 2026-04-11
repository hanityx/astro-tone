export function mountImageLightbox() {
  const dialog = document.getElementById('lightbox');
  if (!(dialog instanceof HTMLDialogElement) || dialog.dataset.lightboxReady === 'true') return;
  dialog.dataset.lightboxReady = 'true';

  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCap = document.getElementById('lightbox-caption');
  const closeBtn = dialog.querySelector('.lightbox-close');

  if (
    !(lightboxImg instanceof HTMLImageElement) ||
    !(lightboxCap instanceof HTMLParagraphElement) ||
    !(closeBtn instanceof HTMLButtonElement)
  ) {
    return;
  }

  const openLightbox = (src: string, alt: string, caption: string) => {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightboxCap.textContent = caption;
    lightboxCap.hidden = !caption;
    dialog.showModal();
  };

  document.querySelectorAll<HTMLImageElement>('.prose img').forEach((img) => {
    if (img.closest('a') || img.dataset.lightboxBound === 'true') return;
    img.dataset.lightboxBound = 'true';
    img.classList.add('is-zoomable');
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
    img.setAttribute('aria-haspopup', 'dialog');
    img.setAttribute('aria-label', `${img.alt || 'Image'} preview`);

    const open = () => {
      const src = img.getAttribute('data-src') ?? img.currentSrc ?? img.src;
      const caption =
        img.nextElementSibling?.tagName === 'EM'
          ? ((img.nextElementSibling as HTMLElement).textContent ?? '')
          : '';
      openLightbox(src, img.alt, caption);
    };

    img.addEventListener('click', open);
    img.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open();
      }
    });
  });

  closeBtn.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
}
