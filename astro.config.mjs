import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import { siteConfig } from './src/config/site';

export default defineConfig({
  site: siteConfig.url,
  base: process.env.BASE_PATH || '/',
  integrations: [
    mdx(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  output: 'static',
});
