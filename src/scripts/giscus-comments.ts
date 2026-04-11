import { onReady } from './mount';

const GISCUS_ORIGIN = 'https://giscus.app';
const GISCUS_CLIENT_SRC = `${GISCUS_ORIGIN}/client.js`;
const GISCUS_CUSTOM_THEME_HEIGHT_BUFFER = 40;
const themeCache = new Map<string, string>();
let themeObserver: MutationObserver | null = null;
let resizeMessageListenerMounted = false;
let lastGiscusResizeHeight: number | null = null;

const safeGetItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const isDarkTheme = (): boolean => {
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr === 'dark') return true;
  if (attr === 'light') return false;

  const stored = safeGetItem('theme');
  if (stored === 'dark') return true;
  if (stored === 'light') return false;

  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const resolveGiscusTheme = async (container: HTMLElement): Promise<string> => {
  if (container.dataset.themeMode !== 'custom') {
    return container.dataset.theme || 'preferred_color_scheme';
  }

  const isDark = isDarkTheme();
  const themePath = isDark ? container.dataset.darkThemePath : container.dataset.lightThemePath;
  if (!themePath) return container.dataset.theme || 'preferred_color_scheme';

  try {
    const themeUrl = new URL(themePath, window.location.href).toString();
    const isLocalPreview = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);
    if (!isLocalPreview) return themeUrl;
    if (themeCache.has(themeUrl)) return themeCache.get(themeUrl)!;

    const response = await fetch(themeUrl);
    if (!response.ok) throw new Error(`Giscus theme fetch failed: ${response.status}`);
    const css = await response.text();
    const compactCss = css
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s*([{}:;,>])\s*/g, '$1')
      .trim();
    const dataTheme = `data:text/css;charset=utf-8,${encodeURIComponent(compactCss)}`;
    themeCache.set(themeUrl, dataTheme);
    return dataTheme;
  } catch {
    return isDark ? 'noborder_dark' : 'noborder_light';
  }
};

const setDataAttribute = (
  script: HTMLScriptElement,
  name: string,
  value: string | undefined,
): void => {
  if (value) script.setAttribute(name, value);
};

const appendGiscusClient = async (container: HTMLElement): Promise<void> => {
  const theme = await resolveGiscusTheme(container);
  container.classList.remove('is-resized');
  container.innerHTML = '';

  const script = document.createElement('script');
  script.src = GISCUS_CLIENT_SRC;
  script.async = true;
  script.crossOrigin = 'anonymous';

  setDataAttribute(script, 'data-repo', container.dataset.repo);
  setDataAttribute(script, 'data-repo-id', container.dataset.repoId);
  setDataAttribute(script, 'data-category', container.dataset.category);
  setDataAttribute(script, 'data-category-id', container.dataset.categoryId);
  setDataAttribute(script, 'data-mapping', container.dataset.mapping);
  setDataAttribute(script, 'data-term', container.dataset.term);
  setDataAttribute(script, 'data-strict', container.dataset.strict);
  setDataAttribute(script, 'data-reactions-enabled', container.dataset.reactionsEnabled);
  setDataAttribute(script, 'data-emit-metadata', container.dataset.emitMetadata);
  setDataAttribute(script, 'data-input-position', container.dataset.inputPosition);
  setDataAttribute(script, 'data-lang', container.dataset.lang);
  setDataAttribute(script, 'data-loading', container.dataset.loading || 'eager');
  setDataAttribute(script, 'data-theme', theme);

  container.appendChild(script);
};

const mountResizeMessageListener = (): void => {
  if (resizeMessageListenerMounted) return;
  resizeMessageListenerMounted = true;

  const applyMeasuredHeight = (resizeHeight: number): void => {
    const container = document.getElementById('giscus-container');
    const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
    if (!container || !iframe) return;

    container.classList.add('is-resized');

    if (container.dataset.themeMode !== 'custom') return;

    iframe.style.height = `${Math.ceil(resizeHeight + GISCUS_CUSTOM_THEME_HEIGHT_BUFFER)}px`;
  };

  const scheduleMeasuredHeight = (resizeHeight: number): void => {
    window.requestAnimationFrame(() => applyMeasuredHeight(resizeHeight));
    [120, 500, 1200].forEach((delay) => {
      window.setTimeout(() => applyMeasuredHeight(resizeHeight), delay);
    });
  };

  window.addEventListener('message', (event) => {
    if (event.origin !== GISCUS_ORIGIN) return;

    const data = event.data as { giscus?: { resizeHeight?: unknown } } | null;
    const resizeHeight = data?.giscus?.resizeHeight;
    if (typeof resizeHeight !== 'number' || !Number.isFinite(resizeHeight)) return;

    lastGiscusResizeHeight = resizeHeight;
    scheduleMeasuredHeight(resizeHeight);
  });
};

const updateGiscusTheme = async (container: HTMLElement): Promise<void> => {
  const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
  if (!iframe?.contentWindow) return;

  const theme = await resolveGiscusTheme(container);
  iframe.contentWindow.postMessage({ giscus: { setConfig: { theme } } }, GISCUS_ORIGIN);

  if (lastGiscusResizeHeight !== null) {
    const resizeHeight = lastGiscusResizeHeight;
    window.setTimeout(() => {
      const giscusIframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
      if (!giscusIframe || container.dataset.themeMode !== 'custom') return;
      giscusIframe.style.height = `${Math.ceil(resizeHeight + GISCUS_CUSTOM_THEME_HEIGHT_BUFFER)}px`;
    }, 250);
  }
};

export const mountGiscusComments = (): void => {
  onReady(() => {
    const container = document.getElementById('giscus-container');
    if (!container) return;

    mountResizeMessageListener();
    void appendGiscusClient(container);

    themeObserver?.disconnect();
    themeObserver = new MutationObserver(() => {
      void updateGiscusTheme(container);
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
  });
};
