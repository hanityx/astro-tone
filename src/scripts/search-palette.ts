type SearchItem = {
  title: string;
  description: string;
  category: string;
  href: string;
};

const MAX_RESULTS = 6;
let paletteApi: { open: () => void; close: () => void } | null = null;

function normalize(value: string) {
  return value.toLocaleLowerCase().trim();
}

function getItems(): SearchItem[] {
  const data = document.getElementById('search-palette-data');
  if (!data?.textContent) return [];

  try {
    const parsed = JSON.parse(data.textContent);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function scoreItem(item: SearchItem, query: string) {
  if (!query) return 1;
  const title = normalize(item.title);
  const category = normalize(item.category);
  const description = normalize(item.description);
  const haystack = `${title} ${category} ${description}`;

  if (title === query) return 100;
  if (title.startsWith(query)) return 80;
  if (title.includes(query)) return 60;
  if (category.includes(query)) return 40;
  if (description.includes(query)) return 20;
  if (query.split(/\s+/).every((part) => haystack.includes(part))) return 10;
  return 0;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return map[char];
  });
}

export function mountSearchPalette(root: ParentNode = document) {
  const dialog = root.querySelector('[data-search-palette]');
  if (!(dialog instanceof HTMLDialogElement)) return;
  if (dialog.dataset.ready === 'true') return;
  dialog.dataset.ready = 'true';

  const input = dialog.querySelector('[data-search-palette-input]');
  const results = dialog.querySelector('[data-search-palette-results]');
  if (!(input instanceof HTMLInputElement) || !(results instanceof HTMLElement)) return;

  const items = getItems();
  let activeIndex = 0;
  let renderedItems: SearchItem[] = [];

  const syncActiveItem = () => {
    results.querySelectorAll<HTMLElement>('[data-search-palette-item]').forEach((item) => {
      item.classList.toggle('is-active', Number(item.dataset.index || 0) === activeIndex);
    });
  };

  const render = () => {
    const query = normalize(input.value);
    renderedItems = items
      .map((item) => ({ item, score: scoreItem(item, query) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_RESULTS)
      .map(({ item }) => item);

    activeIndex = Math.min(activeIndex, Math.max(renderedItems.length - 1, 0));

    if (renderedItems.length === 0) {
      results.innerHTML = '<p class="search-palette-empty">No matching posts.</p>';
      return;
    }

    results.innerHTML = renderedItems
      .map(
        (item, index) => `
          <a
            class="search-palette-item${index === activeIndex ? ' is-active' : ''}"
            href="${escapeHtml(item.href)}"
            data-search-palette-item
            data-index="${index}"
          >
            <span class="search-palette-item-main">
              <span class="search-palette-item-title">${escapeHtml(item.title)}</span>
              <span class="search-palette-item-desc">${escapeHtml(item.description)}</span>
            </span>
            <span class="search-palette-item-meta">${escapeHtml(item.category)}</span>
          </a>
        `
      )
      .join('');
  };

  const open = () => {
    if (dialog.open) {
      requestAnimationFrame(() => input.focus());
      return;
    }

    dialog.showModal();
    input.value = '';
    activeIndex = 0;
    render();
    requestAnimationFrame(() => input.focus());
  };

  const close = () => {
    if (dialog.open) dialog.close();
  };

  document.addEventListener('keydown', (event) => {
    const target = event.target;
    const isEditable =
      target instanceof HTMLElement &&
      (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

    if (!dialog.open || (isEditable && target !== input)) return;

    if (event.key === 'Escape') {
      close();
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      activeIndex = Math.min(activeIndex + 1, renderedItems.length - 1);
      render();
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      render();
      return;
    }

    if (event.key === 'Enter' && renderedItems[activeIndex]) {
      event.preventDefault();
      window.location.href = renderedItems[activeIndex].href;
    }
  });

  input.addEventListener('input', () => {
    activeIndex = 0;
    render();
  });

  results.addEventListener('mouseover', (event) => {
    const item = (event.target as HTMLElement).closest<HTMLElement>('[data-search-palette-item]');
    if (!item) return;
    activeIndex = Number(item.dataset.index || 0);
    syncActiveItem();
  });

  dialog.addEventListener('cancel', () => {
    close();
  });

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) close();
  });

  paletteApi = { open, close };
}

export function openSearchPalette() {
  paletteApi?.open();
}
