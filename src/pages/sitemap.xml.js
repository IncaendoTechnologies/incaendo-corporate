// Production sitemap at /sitemap.xml. Static routes are discovered from the
// pages directory so new pages are included automatically; duplicate and
// non-indexable routes are excluded (see src/data/seo.js).
import { articles } from '../data/articles.js'
import {
  NON_CANONICAL_PATHS,
  NOINDEX_PATHS,
  absoluteUrl,
  isDraftArticle,
} from '../data/seo.js'

const pageModules = import.meta.glob('./**/*.astro')

const staticPaths = Object.keys(pageModules)
  .filter((file) => !file.includes('['))
  .map((file) =>
    file
      .replace(/^\./, '')
      .replace(/\.astro$/, '')
      .replace(/(^|\/)index$/, '/'),
  )

const excluded = new Set([...NON_CANONICAL_PATHS, ...NOINDEX_PATHS])

const escapeXml = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export function GET({ site }) {
  const entries = [
    ...staticPaths.map((path) => ({ loc: absoluteUrl(path, site) })),
    ...articles
      .filter((article) => !isDraftArticle(article))
      .map((article) => ({
        loc: absoluteUrl(`/insights/${article.slug}/`, site),
        lastmod: article.publishedAt,
      })),
  ].filter(({ loc }) => !excluded.has(new URL(loc).pathname))

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .sort((a, b) => a.loc.localeCompare(b.loc))
  .map(
    ({ loc, lastmod }) =>
      `  <url>\n    <loc>${escapeXml(loc)}</loc>${
        lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''
      }\n  </url>`,
  )
  .join('\n')}
</urlset>
`

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
