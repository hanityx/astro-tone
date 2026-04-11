import { mountTocRail, type TocRailInstance } from 'toc-rail';

let rail: TocRailInstance | null = null;
let isBound = false;

export function initReadingRail() {
  rail?.unmount();
  rail = null;

  const prose = document.querySelector<HTMLElement>('#prose-content');
  if (!prose) return;

  rail = mountTocRail({
    content: prose,
    headings: '#prose-content h2[id], #prose-content h3[id]',
    title: false,
    ariaLabel: 'Post outline',
    progressMode: 'content',
    activeBoundary: 'viewport-end',
    activeOffset: 120,
    edge: {
      afterBoundary: 'viewport-end',
      afterOffset: 120,
    },
    minWidth: 1120,
    topOffset: 52,
  });
}

export function mountReadingRailForPosts() {
  if (isBound) {
    initReadingRail();
    return;
  }

  isBound = true;
  initReadingRail();
}
