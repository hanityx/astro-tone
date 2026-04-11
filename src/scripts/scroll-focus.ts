const root = document.documentElement;

function initScrollDark(prose: HTMLElement) {
  const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = root.getAttribute('data-theme');
  let storedTheme: string | null = null;
  try {
    storedTheme = localStorage.getItem('theme');
  } catch {
    storedTheme = null;
  }
  if (
    initialTheme === 'dark' ||
    storedTheme === 'dark' ||
    (!initialTheme && !storedTheme && userPrefersDark)
  ) {
    return;
  }

  let darkActive = false;
  const enterAt = 0.1;
  const exitAt = 0.065;
  const hasUserChangedTheme = () => {
    try {
      return localStorage.getItem('theme') !== storedTheme;
    } catch {
      return false;
    }
  };
  const restoreTheme = () => {
    if (hasUserChangedTheme()) return;
    if (initialTheme === 'light' || initialTheme === 'dark') {
      root.setAttribute('data-theme', initialTheme);
      return;
    }
    if (storedTheme === 'light' || storedTheme === 'dark') {
      root.setAttribute('data-theme', storedTheme);
      return;
    }
    root.setAttribute('data-theme', userPrefersDark ? 'dark' : 'light');
  };

  function update() {
    if (hasUserChangedTheme()) {
      darkActive = false;
      return;
    }

    const articleTop = prose.getBoundingClientRect().top + window.scrollY;
    const readerTop = window.scrollY + 52;
    const pct = Math.min(
      Math.max((readerTop - articleTop) / Math.max(prose.scrollHeight, 1), 0),
      1
    );

    if (pct >= enterAt && root.getAttribute('data-theme') !== 'dark') {
      darkActive = true;
      root.setAttribute('data-theme', 'dark');
    } else if (pct <= exitAt && darkActive) {
      darkActive = false;
      restoreTheme();
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  setTimeout(update, 60);
  update();
}

function initWhenReady(marker: HTMLElement) {
  const prose = document.querySelector<HTMLElement>('.prose');
  if (!prose) {
    window.requestAnimationFrame(() => initWhenReady(marker));
    return;
  }

  const variant = marker.dataset.variant;
  if (variant !== 'scroll-dark') return;
  if (document.body) document.body.dataset.sfEffect = variant;
  root.dataset.sfEffect = variant;

  initScrollDark(prose);
}

function initScrollFocus() {
  document.querySelectorAll<HTMLElement>('[data-scroll-focus]').forEach((marker) => {
    if (marker.dataset.ready === 'true') return;
    marker.dataset.ready = 'true';
    initWhenReady(marker);
  });
}

export function mountScrollFocus() {
  initScrollFocus();
}
