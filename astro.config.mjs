// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import expressiveCode from 'astro-expressive-code';
import { defineConfig } from 'astro/config';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import config from './astro-theme-config.ts';
import { toneExpressiveCodeOptions } from './src/config/expressive-code.ts';

// https://astro.build/config
const sitemapExcludedPaths = new Set(['/search/']);

export default defineConfig({
  site: config.site.url,
  base: config.site.base,
  integrations: [
    expressiveCode(toneExpressiveCodeOptions),
    mdx(),
    sitemap({
      filter: (page) => !sitemapExcludedPaths.has(new URL(page).pathname.replace(config.site.base, '')),
    }),
  ],
  build: {
    inlineStylesheets: 'always',
  },

  markdown: {
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'append',
          properties: { ariaHidden: true, tabIndex: -1, class: 'heading-anchor' },
          content: { type: 'text', value: '#' },
        },
      ],
    ],
  },
});
