import { withBase } from '../utils/paths';

type PagefindUIOptions = {
  element: string;
  showSubResults: boolean;
  translations: {
    placeholder: string;
    zero_results: string;
  };
};

declare global {
  interface Window {
    PagefindUI?: new (options: PagefindUIOptions) => unknown;
  }
}

const isProductionBuild = import.meta.env.PROD;

function loadPagefindCss() {
  if (document.querySelector('link[data-pagefind-ui-css]')) return;

  const link = document.createElement('link');
  link.href = withBase('/pagefind/pagefind-ui.css');
  link.rel = 'stylesheet';
  link.dataset.pagefindUiCss = 'true';
  document.head.append(link);
}

async function loadPagefindUi() {
  if (window.PagefindUI) return Promise.resolve();
  if (!isProductionBuild) {
    throw new Error('Pagefind UI is not available');
  }

  loadPagefindCss();

  const existing = document.querySelector<HTMLScriptElement>('script[data-pagefind-ui]');
  if (existing) {
    return new Promise<void>((resolve, reject) => {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', reject, { once: true });
    });
  }

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = withBase('/pagefind/pagefind-ui.js');
    script.dataset.pagefindUi = 'true';
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.append(script);
  });
}

async function initSearchPage() {
  const el = document.getElementById('search');
  if (!el || el.dataset.pagefindReady === 'true') return;
  el.dataset.pagefindReady = 'true';
  try {
    await loadPagefindUi();
    if (!window.PagefindUI) throw new Error('Pagefind UI failed to load');
    el.replaceChildren();
    new window.PagefindUI({
      element: '#search',
      showSubResults: true,
      translations: {
        placeholder: 'Search posts...',
        zero_results: 'No results for [QUERY]',
      },
    });
    el.setAttribute('aria-busy', 'false');
  } catch {
    el.setAttribute('aria-busy', 'false');
    el.textContent = 'Search is available after a production build.';
  }
}

export function mountSearchPage() {
  void initSearchPage();
}
