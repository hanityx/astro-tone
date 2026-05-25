import { withBase } from '../utils/paths';

export function GET({ site }) {
  const sitemapUrl = new URL(withBase('/sitemap-index.xml'), site).toString();

  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
