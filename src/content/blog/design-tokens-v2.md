---
title: 'Change the Look in One File'
description: 'Color, spacing, and type for the whole theme live in one tokens file. Edit it, refresh, done.'
pubDate: '2026-03-20'
category: 'Design'
heroImage: '../../assets/tone-sample-blue-architecture.jpg'
focusEffect: 'scroll-dark'
homeOrder: 1
---

If you want a different look for your site, start in one file:

`src/styles/tokens.css`

The core colors, spacing steps, and type scale live there. Components and pages read those variables first, while specialized surfaces such as code highlighting keep a small local palette. Change the core variables and most of the site follows.

## Change the accent color

Find `--color-blue` near the top. There are three copies:

1. Light mode under `:root`
2. Dark mode inside the `prefers-color-scheme: dark` media query
3. Forced dark via `[data-theme='dark']`

Edit all three. The starter uses the same variable name across modes so components do not need to know which mode they are in.

## Scroll dark turns on here

This sample post has the optional scroll dark effect enabled. Keep scrolling through this color example and the page will switch to dark mode. Add or remove `focusEffect: 'scroll-dark'` in a post's frontmatter to turn it on or off for that post; the trigger point is theme-defined, not section-specific.

```css
:root {
  --color-blue: #197ca8; /* light mode */
}

[data-theme='dark'] {
  --color-blue: #74c7dc; /* dark mode */
}
```

Rule of thumb: a darker shade for light mode (passes contrast on white) and a lighter shade for dark mode (passes contrast on near-black). The starter's pair is a good starting point; push the hue without changing that contrast relationship.

## Change spacing

The scale uses a 4-point grid:

```css
--space-1: 0.25rem; /* 4pt */
--space-2: 0.5rem;
--space-3: 0.75rem;
--space-4: 1rem;
--space-6: 1.5rem;
--space-8: 2rem;
```

Components reference `var(--space-4)`, not raw `1rem`. Doubling `--space-4` would double every "one unit" gap across the site, which is rarely what you want. Instead, change one or two specific steps.

Common edits:

- Tighter prose: lower `--space-6` and `--space-8`.
- Roomier headings: raise `--space-10` and `--space-12`.

## Change the type scale

Astro Tone follows a quiet type scale at 16px base:

```css
--text-large-title: 2.125rem; /* page hero */
--text-title-1: 1.75rem; /* featured */
--text-title-2: 1.375rem; /* section heading */
--text-headline: 1.0625rem; /* list titles */
--text-body: 1.0625rem; /* body */
--text-callout: 1rem; /* descriptions */
--text-footnote: 0.8125rem; /* dates, captions */
```

For a more compact theme, scale every step down by ~10%:

```css
--text-large-title: 1.875rem;
--text-title-1: 1.5rem;
--text-title-2: 1.25rem;
```

Post title sizes use `clamp()` directly in `src/styles/layouts/blog-post.css`. Edit there if you want a different scaling curve at wide widths.

## Verify in dark mode

Click the theme toggle in the header. Every text and surface color should still pass contrast.

Three places to check:

1. **Custom shadows.** Light-mode shadows use `rgba(0, 0, 0, …)`. Dark-mode shadows need to be stronger, or near-black, to be visible at all.
2. **Hard-coded colors.** Grep the codebase for `#` and `rgb(` outside `tokens.css`, `src/config/expressive-code.ts`, and `src/styles/code.css`. The code block palette is intentionally separate; everything else should usually read from tokens.
3. **Images.** Photos that read on white can disappear on near-black. Use a subtle separator or a tinted background for prose images if needed.

## Replace the font stack

The starter uses a system font stack by default. That keeps the first render fast and avoids bundling font license surface into the template.

To add a brand font:

1. Drop your `.woff2` file into `src/assets/fonts/`.
2. Add an `@font-face` block near the top of `tokens.css`.
3. Put the font family first in `--font-sans`.
4. Add a preload in `src/components/BaseHead.astro` only if the font is critical to the first viewport.

If the new font is variable, keep `font-weight: 100 900` or the range it supports. If it is static, list only the weights you actually use.

## When a token is not enough

Sometimes a single component needs a value the system does not have. Two options:

- **Local CSS variable.** Define `--feed-date-column` inside the component's scoped style block. The PostFeed already does this for its layout columns.
- **New token.** If more than one component would use it, add a new token to `tokens.css` and use it everywhere.

Prefer local variables for one-off layout values. Prefer new tokens for anything that touches color, spacing, type, or motion.

## What does not belong in tokens

The token file is for visual primitives. It is not for:

- Copy strings — those live in `src/ui.ts` and `astro-theme-config.ts`.
- Route paths.
- Feature flags.

If a value answers "what does this look like?", it is a token. If it answers "what does this say?" or "where does it go?", it is config.
