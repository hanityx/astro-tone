function initPostFeeds(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-post-feed]').forEach((feed) => {
    if (feed.dataset.ready === 'true') return;
    feed.dataset.ready = 'true';

    const pageSize = Number(feed.dataset.pageSize || 8);
    const useMore = feed.dataset.showMore === 'true';
    const items = [...feed.querySelectorAll<HTMLElement>('[data-feed-item]')];
    const filters = [...feed.querySelectorAll<HTMLButtonElement>('[data-feed-filter]')];
    const filterRail = feed.querySelector<HTMLElement>('[data-feed-filter-rail]');
    const filterScroller = feed.querySelector<HTMLElement>('[data-feed-filters]');
    const filterScrollButtons = [
      ...feed.querySelectorAll<HTMLButtonElement>('[data-feed-filter-scroll]'),
    ];
    const search = feed.querySelector<HTMLInputElement>('[data-feed-search]');
    const searchWrap = search?.closest<HTMLElement>('.feed-search');
    const more = feed.querySelector<HTMLButtonElement>('[data-feed-more]');
    const empty = feed.querySelector<HTMLElement>('[data-feed-empty]');
    const sentinel = feed.querySelector<HTMLElement>('[data-feed-sentinel]');
    let active = 'all';
    let visible = useMore ? pageSize : Number.POSITIVE_INFINITY;

    const matchesFilter = (item: HTMLElement) => {
      if (active === 'all') return true;
      if (active.startsWith('category:')) {
        return item.dataset.category === active.slice('category:'.length);
      }
      return false;
    };

    const matchesQuery = (item: HTMLElement) => {
      const query = (search?.value || '').trim().toLocaleLowerCase();
      if (!query) return true;
      return (item.dataset.search || '').includes(query);
    };

    const render = () => {
      const matching = items.filter((item) => matchesFilter(item) && matchesQuery(item));
      searchWrap?.classList.toggle('has-query', Boolean((search?.value || '').trim()));
      items.forEach((item) => {
        const index = matching.indexOf(item);
        item.hidden = index === -1 || index >= visible;
      });
      if (empty) empty.hidden = matching.length > 0;
      if (more) more.hidden = !useMore || visible >= matching.length;
    };

    const syncFilters = () => {
      filters.forEach((filter) => {
        const selected = (filter.dataset.feedFilter || 'all') === active;
        filter.classList.toggle('is-active', selected);
        filter.setAttribute('aria-pressed', selected ? 'true' : 'false');
      });
    };

    const updateFilterScroll = () => {
      if (!filterRail || !filterScroller) return;
      const maxScroll = filterScroller.scrollWidth - filterScroller.clientWidth;
      const hasOverflow = maxScroll > 1;
      const atStart = filterScroller.scrollLeft <= 1;
      const atEnd = filterScroller.scrollLeft >= maxScroll - 1;
      filterRail.classList.toggle('has-filter-overflow', hasOverflow);
      filterRail.classList.toggle('is-at-start', !hasOverflow || atStart);
      filterRail.classList.toggle('is-at-end', !hasOverflow || atEnd);
      filterScrollButtons.forEach((button) => {
        const direction = button.dataset.feedFilterScroll;
        button.disabled =
          !hasOverflow || (direction === 'prev' && atStart) || (direction === 'next' && atEnd);
      });
    };

    let isTrackingFilterPointer = false;
    let isDraggingFilters = false;
    let suppressFilterClick = false;
    let dragStartX = 0;
    let dragStartScroll = 0;
    let dragPointerId: number | null = null;

    filters.forEach((button) => {
      button.addEventListener('click', (clickEvent) => {
        if (suppressFilterClick) {
          clickEvent.preventDefault();
          clickEvent.stopPropagation();
          suppressFilterClick = false;
          return;
        }
        active = button.dataset.feedFilter || 'all';
        visible = useMore ? pageSize : Number.POSITIVE_INFINITY;
        syncFilters();
        render();
      });
    });

    filterScrollButtons.forEach((button) => {
      button.addEventListener('click', () => {
        if (!filterScroller) return;
        const direction = button.dataset.feedFilterScroll === 'prev' ? -1 : 1;
        const distance = Math.max(filterScroller.clientWidth * 0.62, 160);
        filterScroller.scrollBy({ left: direction * distance, behavior: 'smooth' });
      });
    });

    filterScroller?.addEventListener('scroll', updateFilterScroll, { passive: true });
    filterScroller?.addEventListener(
      'wheel',
      (event) => {
        if (!filterScroller || filterScroller.scrollWidth <= filterScroller.clientWidth) return;
        const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
        if (!delta) return;
        event.preventDefault();
        filterScroller.scrollLeft += delta;
      },
      { passive: false }
    );
    filterScroller?.addEventListener('pointerdown', (event) => {
      if (!filterScroller || event.button !== 0) return;
      isTrackingFilterPointer = true;
      isDraggingFilters = false;
      suppressFilterClick = false;
      dragStartX = event.clientX;
      dragStartScroll = filterScroller.scrollLeft;
      dragPointerId = event.pointerId;
    });
    filterScroller?.addEventListener('pointermove', (event) => {
      if (!filterScroller || !isTrackingFilterPointer) return;
      const deltaX = event.clientX - dragStartX;
      if (!isDraggingFilters && Math.abs(deltaX) > 4) {
        isDraggingFilters = true;
        suppressFilterClick = true;
        filterScroller.classList.add('is-dragging');
        filterScroller.setPointerCapture(event.pointerId);
      }
      if (!isDraggingFilters) return;
      filterScroller.scrollLeft = dragStartScroll - deltaX;
    });
    const stopFilterDrag = () => {
      if (!filterScroller || !isTrackingFilterPointer) return;
      isTrackingFilterPointer = false;
      isDraggingFilters = false;
      filterScroller.classList.remove('is-dragging');
      if (dragPointerId !== null && filterScroller.hasPointerCapture(dragPointerId)) {
        filterScroller.releasePointerCapture(dragPointerId);
      }
      dragPointerId = null;
      if (suppressFilterClick) {
        requestAnimationFrame(() => {
          suppressFilterClick = false;
        });
      }
    };
    filterScroller?.addEventListener('pointerup', stopFilterDrag);
    filterScroller?.addEventListener('pointercancel', stopFilterDrag);
    filterScroller?.addEventListener('lostpointercapture', stopFilterDrag);
    window.addEventListener('resize', updateFilterScroll);

    more?.addEventListener('click', () => {
      visible += pageSize;
      render();
    });

    search?.addEventListener('input', () => {
      visible = useMore ? pageSize : Number.POSITIVE_INFINITY;
      render();
    });

    if (sentinel && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting) && more && !more.hidden) {
            visible += pageSize;
            render();
          }
        },
        { rootMargin: '240px 0px' }
      );
      observer.observe(sentinel);
    }

    syncFilters();
    render();
    updateFilterScroll();
  });
}

export function mountPostFeeds() {
  initPostFeeds();
}
