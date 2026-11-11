# Deployment Checklist

The hosting platform is not decided yet. Complete these items when it is. The
site is a static Astro build (`npm run build` → `dist/`), and SEO URLs are
fixed to `https://www.incaendo.com` through `site` in `astro.config.mjs`.

## 1. Domain and URL normalisation

Configure these as permanent (301) redirects at the host or CDN:

- [ ] `http://` → `https://` for every URL.
- [ ] `https://incaendo.com/*` → `https://www.incaendo.com/*` (apex → www).
- [ ] Page URLs without a trailing slash → the trailing-slash version, e.g.
      `/services` → `/services/`. The build outputs `services/index.html`,
      and canonical URLs and the sitemap use the trailing-slash form.
- [ ] Unknown URLs return a real HTTP `404` status, not `200`.

## 2. Legacy and duplicate routes

These routes still render the page today and declare the main URL as
canonical (see `NON_CANONICAL_PATHS` and `articleSeo()` in
`src/data/seo.js`). After hosting is chosen, replace them with 301 redirects:

| From | To |
| --- | --- |
| `/blog/` | `/insights/` |
| `/blog/:slug/` | `/insights/:slug/` |
| `/post/:slug/` | `/insights/:slug/` |
| `/blog/choosing-tech-stack-for-startup-2025/` and `/post/…` | `/insights/choosing-the-right-tech-stack-for-your-startup-in-2025/` |
| `/blog/case-study-how-we-helped-domino-s-india-centralise-data-automate-settlements-and-refunds/` and `/post/…` | `/insights/case-study-how-we-helped-dominos-india-centralise-data-automate-settlements-and-refunds/` |
| `/privacy/` | `/privacy-policy/` |

- [ ] Add the redirects above.
- [ ] After the redirects work, remove the duplicate route files
      (`src/pages/blog/`, `src/pages/post/`, `src/pages/privacy.astro`) and
      the related entries in `src/data/seo.js`.
- [ ] Update internal links that use the old paths (e.g. `/privacy` on
      `src/pages/products/nirvan.astro`).

## 3. Non-production environments

- [ ] Staging or preview deployments must not be indexed. Send an
      `X-Robots-Tag: noindex` header or protect them with a password. The
      HTML on those builds still contains production canonical URLs.
- [ ] Remove the temporary Cloudflare tunnel host from
      `vite.preview.allowedHosts` in `astro.config.mjs` when it is no longer
      needed.

## 4. Before launch

- [ ] Content review: sample articles (`isDraftArticle`) and `/careers/`
      (`NOINDEX_PATHS`) stay `noindex, follow` until their content is final.
- [ ] Optional: add a custom `src/pages/404.astro`.
- [ ] Optional: add `/favicon.ico` for clients that request it directly.

## 5. After launch

- [ ] Verify `https://www.incaendo.com` in Google Search Console and Bing
      Webmaster Tools.
- [ ] Submit `https://www.incaendo.com/sitemap.xml`.
- [ ] Check `https://www.incaendo.com/robots.txt` is served.
- [ ] Test key pages with Google's Rich Results Test and the Schema.org
      validator.
- [ ] Check redirects with `curl -I` (one 301 hop, no chains).
- [ ] Check the share preview for one page and one article (Open Graph image).
