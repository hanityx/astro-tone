let loading: Promise<typeof import('./search-palette')> | null = null;
let keyboardMounted = false;

function loadSearchPalette() {
  loading ??= import('./search-palette');
  return loading;
}

async function openSearchPalette(event?: Event) {
  event?.preventDefault();
  const dialog = document.querySelector('[data-search-palette]');
  if (dialog instanceof HTMLDialogElement && dialog.open) return;

  const { mountSearchPalette, openSearchPalette: open } = await loadSearchPalette();
  mountSearchPalette();
  open();
}

export function mountSearchPaletteTriggers(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-search-palette-trigger]').forEach((trigger) => {
    if (trigger.dataset.searchPaletteReady === 'true') return;
    trigger.dataset.searchPaletteReady = 'true';
    trigger.addEventListener('click', openSearchPalette);
  });

  if (keyboardMounted) return;
  keyboardMounted = true;
  document.addEventListener('keydown', (event) => {
    const target = event.target;
    const isEditable =
      target instanceof HTMLElement &&
      (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

    if (isEditable) return;
    if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase() === 'k') {
      void openSearchPalette(event);
    }
  });
}
