import { mountReadingRailForPosts } from './reading-rail';

const railQuery = '(min-width: 1120px)';
let mounted = false;
let listening = false;
const railMediaQuery = window.matchMedia(railQuery);

function mountReadingRailWhenWide() {
  if (mounted || !railMediaQuery.matches) return;
  mounted = true;
  mountReadingRailForPosts();
}

export function mountReadingRailLoader() {
  mountReadingRailWhenWide();

  if (listening) return;
  listening = true;
  railMediaQuery.addEventListener('change', (event) => {
    if (event.matches) mountReadingRailWhenWide();
  });
}
