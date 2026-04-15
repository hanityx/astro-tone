---
title: 'Set Up Astro Tone in Ten Minutes'
description: 'Clone, edit one config file, write one real post, deploy. The shortest path through the starter.'
pubDate: '2026-04-15'
category: 'Getting Started'
heroImage: '../../assets/view-transparent-crystal-water.jpg'
---

The starter is a small Astro site. By the end of this post you will have your name on the home page, one real post, and a deploy that points to your domain.

Skip any step that does not apply.

## Install

```bash
npm create astro@latest -- --template hanityx/astro-tone
cd astro-tone
npm install
npm run dev
```

The dev server runs at `http://localhost:4321`. If the port is taken, Astro picks the next free one and prints it.

## Edit one config file

Open `astro-theme-config.ts`. This is the only file you need to touch for site-wide settings.

```ts
site: {
  url: 'https://hanityx.github.io',
  base: '/astro-tone',
  title: 'Your Site',
  logoLabel: 'Tone',
  description: 'One short line about the site.',
  author: 'Your Name',
  defaultOgImage: '/og.png',
}
```

Three rules:

1. `url` is the production origin. Set `base` only when deploying under a subpath, such as GitHub Pages project sites.
2. `title` shows in the browser tab and in social previews.
3. `logoLabel` is the text in the header next to the home link. Keep it short — it sits in a 52px bar.

The other fields can wait.

## Know where things live

The starter keeps the public surface small. Most changes happen in one of these places:

```text
src/
  assets/             Demo images
  components/         Astro components
  content/blog/       Markdown and MDX posts
  layouts/            Shared layouts
  pages/              Routes
  scripts/            Client-side behavior
  styles/             Tokens, prose, page, layout, and component CSS
  ui.ts               Shared UI labels

licenses/            Third-party notices
```

Use `astro-theme-config.ts` first. Reach into `src/styles/` when you want to change the visual system, and `src/components/` only when the structure needs to change.

## Decide what the header shows

`nav` is empty by default. The logo links home, the theme toggle sits on the right, and that is it.

If you want header links:

```ts
nav: [
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
],
```

Footer links live in `footerNav` and stay visible regardless. A quiet header with a useful footer is a fine combination.

## Write the first post

Posts live in `src/content/blog/`. The filename becomes the URL slug.

Create `src/content/blog/hello.md`:

```md
---
title: 'Hello'
description: 'A first post to test the layout.'
pubDate: '2026-05-01'
category: 'Notes'
---

This is the first paragraph. Start with a concrete note, a small decision, or one thing you want to remember.
```

Required: `title`, `description`, `pubDate`. Everything else is optional.

- `draft: true` keeps the post out of the build, the RSS feed, and the search index.
- `category` powers the filter row on `/blog`. Pick from `config.content.categoryOrder` or add a new one.
- `heroImage` is a relative path to a file inside `src/assets/`. It feeds cards, social metadata, and structured data; place the image in the Markdown body too when the post should show it inline.

## Replace the samples

The starter ships with sample posts to exercise the layout. Replace or delete them before you publish.

The fastest path:

1. Keep this guide if you find it useful.
2. Delete the others from `src/content/blog/`.
3. Add three or four of your own.

The blog index, RSS, related posts, and search update on the next build.

## Run the checks

Before deploying:

```bash
npm run check
npm run build
npm run preview
```

`check` runs Astro's type checks. `build` writes the static site and the Pagefind search index to `dist/`. `preview` serves the built output so you can click through it once.

If `check` fails, fix it before deploying. Type errors in the starter usually point at a missing field in `astro-theme-config.ts`.

## Deploy

Tone builds to `dist/`. Most hosts only need:

| Setting          | Value           |
| ---------------- | --------------- |
| Build command    | `npm run build` |
| Output directory | `dist`          |
| Node             | 22.12 or newer  |

Vercel, Netlify, and Cloudflare Pages all detect Astro automatically. Import the repository, accept the defaults, deploy.

After the first live deploy, set `site.url` in `astro-theme-config.ts` to the real domain and redeploy. Canonical links, RSS, sitemap, and social previews all depend on it.

If you deploy under a subpath such as `username.github.io/repo`, set `site.base` in `astro-theme-config.ts` before publishing. The Astro config reads that value for you.

## Enable comments (optional)

Comments are off by default. To turn on giscus:

1. Visit `https://giscus.app` and pick a repository with Discussions enabled.
2. Copy the four values it generates (`repo`, `repoId`, `category`, `categoryId`) into `config.comments.giscus`.
3. Set `config.comments.mode` to `giscus` for the original widget, or `giscus-custom` for the Tone-styled widget.

The component renders nothing until all four values are present. There is no half-enabled state.

## What to read next

- **Markdown You Will Actually Use** — the prose styles in one page.
- **Change the Look in One File** — color, spacing, type.
- **When to Reach for MDX** — using an Astro component inside a post.
