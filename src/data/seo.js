// Shared SEO configuration and helpers. Only facts that are visible on the
// website belong here (see SiteFooter.astro and contact.astro).

export const SITE_NAME = 'Incaendo'

export const ORGANIZATION = {
  name: 'Incaendo Technologies',
  alternateName: 'Incaendo',
  email: 'info@incaendo.com',
  address: {
    streetAddress: 'TigerCubs, B-9, B Block, Sector 2',
    addressLocality: 'Noida',
    addressRegion: 'Uttar Pradesh',
    postalCode: '201301',
    addressCountry: 'IN',
  },
  sameAs: [
    'https://www.facebook.com/Incaendo/',
    'https://www.instagram.com/incaendo_technologies/',
    'https://www.linkedin.com/company/incaendo-technologies-pvt-ltd-/',
  ],
}

// Routes that duplicate another page. They stay reachable, point their
// canonical at the primary URL, and are left out of the sitemap.
export const NON_CANONICAL_PATHS = ['/blog/', '/privacy/']

// Public pages that should stay out of search results for now. Careers is a
// placeholder with an on-page "information to confirm" notice and no roles.
export const NOINDEX_PATHS = ['/careers/']

/**
 * Builds an absolute URL on the production origin. Page paths are normalised
 * to the trailing-slash form that the static build serves (`/about/`);
 * paths with a file extension are left as they are.
 */
export function absoluteUrl(path, site) {
  const url = new URL(path, site)
  if (!/\.[a-z0-9]+$/i.test(url.pathname) && !url.pathname.endsWith('/')) {
    url.pathname += '/'
  }
  return url.href
}

/**
 * Sample articles (no author, not a published blog or case study) carry an
 * on-page "replace before publication" notice, so they are kept out of
 * search indexes and the sitemap until approved content replaces them.
 */
export const isDraftArticle = (article) =>
  !article.author && !article.isPublishedBlog && !article.isCaseStudy

/**
 * Page-level SEO props for an insight article. `canonicalPath` always points
 * at /insights/<slug>/ so the legacy /blog/ and /post/ routes and alias slugs
 * consolidate onto one URL.
 */
export function articleSeo(article) {
  const canonicalPath = `/insights/${article.slug}/`
  const draft = isDraftArticle(article)
  const image = article.image?.src

  return {
    title: `${article.title} | Incaendo`,
    description: article.excerpt,
    canonicalPath,
    noindex: draft,
    openGraphType: 'article',
    image,
    imageAlt: article.image?.alt,
    breadcrumbLabel: article.title,
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Insights', path: '/insights/' },
    ],
    article: draft
      ? undefined
      : {
          publishedTime: article.publishedAt,
          section: article.category,
          tags: article.tags,
        },
    schema: draft
      ? []
      : [
          {
            '@type': article.isCaseStudy ? 'Article' : 'BlogPosting',
            headline: article.title,
            description: article.excerpt,
            image: { $ref: 'image' },
            datePublished: article.publishedAt,
            author: { '@type': 'Person', name: article.author },
            publisher: { $ref: 'organization' },
            mainEntityOfPage: { $ref: 'webPage' },
            articleSection: article.category,
            keywords: article.tags?.join(', '),
            inLanguage: 'en',
          },
        ],
  }
}
