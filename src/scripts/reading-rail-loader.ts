const railQuery = '(min-width: 1120px)';
let mounted = false;
let listening = false;
const railMediaQuery = window.matchMedia(railQuery);

async function mountReadingRailWhenWide() {
  if (mounted || !railMediaQuery.matches) return;
  mounted = true;
  const { mountReadingRailForPosts } = await import('./reading-rail');
  mountReadingRailForPosts();
}

export function mountReadingRailLoader() {
  void mountReadingRailWhenWide();

  if (listening) return;
  listening = true;
  railMediaQuery.addEventListener('change', (event) => {
    if (event.matches) void mountReadingRailWhenWide();
  });
}
