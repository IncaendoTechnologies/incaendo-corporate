# SEO Implementation Audit and Local Verification

**Project:** Incaendo Corporate Website  
**Audit date:** 16 November 2026  
**Repository:** /home/lokesh/codebase/incaendo-corp  
**Requested branch:** feature/website-enhancement  
**Checked-out branch:** main  
**Build:** Astro static production build, Node 22 runtime  
**Scope:** Read-only SEO source audit and local generated-site checks. No application code, environment variables, SEO configuration, or deployment was changed.

## 1. Executive summary

The SEO implementation is centralized and runs during the Astro build. The production build completed successfully and emitted 60 HTML files, a sitemap, and robots.txt. A read-only scan of the generated HTML found titles, descriptions, production canonicals, robots directives, Open Graph data, Twitter cards, and one syntactically valid JSON-LD graph on each page. The scan found one H1 on each page, no missing image alt attributes, and no broken root-relative internal link targets among 2,080 links checked. Local HTTP checks returned 200 for the home page, contact page, an insight article, sitemap, robots.txt, favicon files, and the default social image. An unknown URL returned 404.

The generated sitemap contains 15 distinct URLs on the intended www production origin. This is 11 indexable static pages plus four published articles. It excludes the careers placeholder, ten sample articles, and duplicate legacy routes. All 60 built HTML pages declare a canonical URL on https://www.incaendo.com.

**Production readiness: technically close, but not ready to launch until hosting and content checks are complete.** The static SEO output is sound. No production host/CDN is configured in this repository, so HTTPS, apex-to-www redirects, trailing-slash redirects, legacy-route redirects, and staging protection remain unverified. The local Astro preview serves a slashless page URL with HTTP 200 and no redirect, despite canonicals and the sitemap using trailing slashes. The README also says the privacy policy is a draft while the built page is indexable and included in the sitemap; someone responsible for the policy should confirm it is approved before launch.

No Google Search Console property was accessed, no URLs were submitted, and no public deployment was tested. Local results do not demonstrate that Google has crawled, indexed, or ranked any page.

### Test totals

The test matrix in this report contains 30 checks:

| Status | Count |
| --- | ---: |
| PASS | 22 |
| FAIL | 0 |
| WARNING | 2 |
| NOT TESTED | 2 |
| REQUIRES PRODUCTION | 4 |
| **Total** | **30** |

The current Git branch is main, not the branch named in the request. I did not switch branches. Before relying on this audit for a feature-branch release, confirm that this is the intended checkout.

## 2. What SEO does for this website

SEO (search engine optimization) is the work of making a website discoverable, understandable, and useful to people arriving from unpaid search results. For Incaendo, the business aim is to help a prospective customer find and understand the company’s software, AI, services, project, team, and product pages.

The implementation helps search systems answer questions such as:

- What is this page about? The title, description, headings, visible copy, image alt text, and structured data provide context.
- Which URL should represent it? The canonical identifies the preferred URL; the sitemap lists preferred URLs.
- May it appear in results? Robots metadata marks approved content indexable and marks careers and sample article content noindex.
- What should a shared link look like? Open Graph and Twitter card metadata provide titles, descriptions, and preview images to social platforms.

SEO does not promise rankings. Search engines decide whether to crawl and index pages and how to rank them. Those decisions also depend on page usefulness, relevance to a search, site reputation and links, competition, and many other factors. Google says sitemap submission is a hint and does not guarantee crawling, indexing, or ranking. Structured data can make a page eligible for supported search features but does not guarantee a rich result.

The build creates static HTML with metadata already present. A crawler can read it without first running the site’s browser JavaScript. The build itself does not notify Google. After deployment, Google must be able to reach the production site and choose to crawl and index eligible pages.

## 3. SEO feature inventory

| SEO feature | Implemented? | File/component | Purpose | Scope and when it works |
| --- | --- | --- | --- | --- |
| Production site origin | Yes | astro.config.mjs | Supplies the origin for canonical, social, structured-data, and sitemap URLs. | Global; evaluated during build. Fixed to https://www.incaendo.com, including local builds. |
| Shared metadata renderer | Yes | src/components/SEO.astro | Renders title, description, robots, canonical, icons, Open Graph, Twitter cards, and JSON-LD. | Global; included by BaseLayout and StandaloneLayout at build time. |
| Page titles and descriptions | Yes | src/data/site-content.js; src/data/articles.js; page files; layouts | Describes each page and provides a proposed result title/snippet. | Page-specific; emitted into static HTML. Google may rewrite search presentation. |
| Canonical URL | Yes | src/components/SEO.astro; src/data/seo.js; page props | Indicates the preferred URL for duplicate or alternate route versions. | Every generated HTML page; emitted at build and interpreted when crawled. |
| Robots meta directives | Yes | src/components/SEO.astro; src/data/seo.js; articleSeo() | Allows indexing by default; excludes careers and draft/sample articles. | Per page; crawler must fetch the HTML to read it. |
| Open Graph | Yes | src/components/SEO.astro | Provides title, description, URL, image, and image alt for link previews. | All pages; read by participating social platforms when they fetch the URL. |
| Twitter/X cards | Yes | src/components/SEO.astro | Requests a large-image share card and supplies title, description, image, and alt. | All pages; read by X when it fetches the URL. |
| XML sitemap | Yes | src/pages/sitemap.xml.js | Lists canonical, intended-to-index URLs and published article dates. | Generated at build as dist/sitemap.xml; crawler discovery happens after deployment. |
| robots.txt | Yes | public/robots.txt | Allows crawling and advertises the sitemap URL. | Copied to the site root; read by crawlers after deployment. |
| JSON-LD structured data | Yes | src/components/SEO.astro; src/data/seo.js; page-specific schema in services, product, articles | Describes the organization, site, pages, breadcrumbs, services, software product, and published articles. | Generated at build; processed by search engines during crawling/indexing. |
| Favicon and touch icon | Yes | src/components/SEO.astro; public/favicon-96x96.png; public/apple-touch-icon.png | Supplies browser and platform identity icons; Google may use a favicon in search presentation. | Global links in HTML; files must remain publicly reachable. |
| Semantic headings and document language | Yes | Layouts and page/components | Gives the document a language, main landmark, and heading structure. | Build output and browser; supports accessibility and content understanding. |
| Image alt text | Yes in generated output | Astro components and article/project/team data | Provides text alternatives for meaningful images; empty alt is used where an image is decorative. | Each rendered image. Local scan found no missing alt attributes. |
| Internal links | Yes | Header, footer, page sections, cards, data | Connects pages and gives crawlers ordinary links for discovery and context. | Available in static HTML; local scan resolved 2,080 root-relative links. |
| Redirect rules | Not in repository | Hosting/CDN checklist in docs/deployment-checklist.md | Normalizes domains, protocols, slashes, and legacy URLs with permanent redirects. | Host/CDN configuration; cannot be proven by a static build. |
| Search Console verification / Google Analytics | Not implemented in code | No verification file/meta or GA4/GTM code found; see docs/deployment-checklist.md | Search Console provides Google crawl/index/search data; analytics would measure site behavior. | External account and post-deployment setup. HubSpot tracking is present but is not Google Search Console or GA4. |
| SEO environment variables | Not required | astro.config.mjs; .env.example | The production origin is a code configuration value rather than an environment variable. | Build configuration. Do not set a localhost origin for a production deployment. |

## 4. Source implementation and examples

### Shared architecture

- astro.config.mjs sets site to https://www.incaendo.com. The helper absoluteUrl() in src/data/seo.js adds a trailing slash to page paths and makes production-absolute URLs.
- BaseLayout.astro and StandaloneLayout.astro pass page properties through to SEO.astro. The latter is used by NIRVAN.
- SEO.astro generates the page head. It defaults to a shared hero-orbit social image, and Astro transforms imported images into a 1200-pixel-wide JPG. Article pages pass their own image and alt text.
- src/data/site-content.js contains metadata for the primary static pages. Article titles, excerpts, authors, dates, flags, and image text alternatives live in src/data/articles.js.
- src/data/seo.js owns organization facts, draft detection, the noindex list, duplicate-route handling, URL normalization, and article metadata generation.
- src/pages/sitemap.xml.js discovers static page files at build time and adds approved articles. It excludes the configured duplicate and noindex paths.
- public/robots.txt allows all crawlers and points to https://www.incaendo.com/sitemap.xml.

### Title and meta description

For example, the home page uses “Incaendo | Custom Software, AI & App Development Company” and a description that names Noida and the company’s software, web, mobile, AI, and cloud work. The AI page has its own page-specific title and description. The NIRVAN product page uses its own product-oriented metadata.

Google may use the title element to create the result title link and may use the meta description for the snippet, but it can choose other on-page text. The title is a relevance and presentation signal; a description is primarily a search-result presentation aid and is not a guaranteed snippet or a direct ranking boost. See Google’s [title link documentation](https://developers.google.com/search/docs/appearance/title-link) and [snippet documentation](https://developers.google.com/search/docs/appearance/snippet).

### Canonical URL

The duplicate blog and post route families render the same article as /insights/<slug>/. Their canonical points to the /insights/ route. The /blog/ listing canonical points to /insights/, and /privacy/ points to /privacy-policy/. These canonical tags tell a crawler the preferred URL but do not redirect visitors. The deployment checklist recommends permanent redirects once the host is configured.

Google describes rel=canonical as a strong canonicalization signal, not an absolute command; consistent internal links and sitemap entries reinforce it. See [Google’s canonical URL guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

### Robots directives and robots.txt

The default generated value is index, follow, max-image-preview:large. src/data/seo.js lists /careers/ as noindex. articleSeo() sets noindex, follow for ten sample articles that lack author/published/case-study flags. There are no nofollow-only pages. Those pages are still crawlable because robots.txt says Allow: /; this matters because a crawler needs to fetch a page to see its noindex meta tag.

robots.txt controls crawler access to URL paths; it is not a reliable way to remove an already known URL from search. A robots meta noindex directive is page-specific and tells a crawler that has fetched the page not to show it in results. Google documents this distinction in its [robots meta specification](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag).

### Open Graph and Twitter/X

All pages emit Open Graph type, site name, locale, title, description, canonical URL, image URL, and image alt. Article pages set og:type=article and add published time, section, and tags when applicable. The NIRVAN page uses a product dashboard image and the distinct site name “NIRVAN by Incaendo.” Every page emits a summary_large_image Twitter card plus title, description, image, and image alt.

When a person shares a page on a platform that reads these tags, the platform can use them to build a preview card. These tags primarily influence social presentation, not Google organic rankings. The platforms may cache previews or choose their own rendering.

### Sitemap

The static endpoint is generated from routes and approved article data. It contains 15 URLs, all absolute HTTPS URLs on www.incaendo.com. Article entries include lastmod dates. It omits legacy paths and pages identified as noindex. A sitemap helps a search engine discover URLs and communicates the site’s preferred URLs; it does not force a crawl or index.

Google says sitemap submission is a hint, not a guarantee. See [Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

### JSON-LD

SEO.astro outputs one JSON-LD block containing a graph with Organization, WebSite, a page node, and optional BreadcrumbList and page-specific nodes. Generated types found in the build are:

- Shared nodes: Organization and WebSite.
- Page nodes: WebPage, ContactPage, AboutPage, CollectionPage.
- Additional nodes: BreadcrumbList, Service, SoftwareApplication, BlogPosting, Article.

Services adds six Service nodes; NIRVAN adds SoftwareApplication; the four published editorial pages add BlogPosting, and the case study uses Article. Draft articles omit article-specific schema while retaining shared site/page information. JSON is parsed locally in all 60 files. That verifies JSON syntax, not Google rich-result eligibility or every Schema.org quality rule. Google says valid structured data does not guarantee a rich result; see its [structured data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).

### Images, semantics, and favicon

Both layouts emit an English-language HTML document and a mobile viewport declaration. The generated pages each contain exactly one H1. A local scan found no missing alt attributes among the rendered img elements; empty alt values remain appropriate for decorative images. A separate local link scan found no missing root-relative internal targets.

The SEO component links a 96×96 PNG favicon and an Apple touch icon. Both files return HTTP 200 in the local preview. Google may show a site favicon in search results, but the display is not guaranteed. See [Google’s favicon guidance](https://developers.google.com/search/docs/appearance/favicon-in-search).

## 5. Page-by-page metadata audit

The production build emitted 60 HTML files: 14 static route files, 14 canonical insight article pages, 16 legacy blog pages, and 16 legacy post pages. “Same article metadata” below means the title and description come from the article object, the canonical is /insights/<slug>/, the social fields mirror the title/description/canonical and article image, and the robots/schema vary by the published-versus-draft flag.

### Static pages and aliases

All titles, descriptions, canonicals, robots values, Open Graph fields, Twitter fields, and JSON-LD were present in the generated head for these pages. The default social image is the optimized hero-orbit JPG except NIRVAN, which uses its dashboard image.

| Rendered route | Title | Meta description | Canonical | Robots | OG / Twitter | JSON-LD | Result |
| --- | --- | --- | --- | --- | --- | --- | --- |
| / | Incaendo \| Custom Software, AI & App Development Company | Incaendo is a Noida-based software development company with 15 years of experience building custom software, web and mobile apps, AI solutions and cloud platforms. | https://www.incaendo.com/ | index, follow, max-image-preview:large | Complete; default image | Organization, WebSite, WebPage | PASS |
| /ai-technology/ | AI & Applied Solutions \| Incaendo | Explore practical AI applications, integration patterns, and enterprise considerations. Incaendo connects business data, existing systems, and workflows to useful outcomes. | https://www.incaendo.com/ai-technology/ | index, follow, max-image-preview:large | Complete; default image | Organization, WebSite, WebPage | PASS |
| /services/ | Software, AI & Technology Services \| Incaendo | Explore Incaendo’s AI, software, web, mobile, enterprise, and cloud technology services, and how they can address practical business needs. | https://www.incaendo.com/services/ | index, follow, max-image-preview:large | Complete; default image | Organization, WebSite, WebPage, Service ×6 | PASS |
| /projects/ | Projects & Digital Portfolio \| Incaendo Technologies | Explore a selection of Incaendo project work across digital products, media, commerce, financial platforms, operations, and learning. | https://www.incaendo.com/projects/ | index, follow, max-image-preview:large | Complete; default image | Organization, WebSite, CollectionPage | PASS |
| /teams/ | Our Team & Expertise \| Incaendo | Meet the people behind Incaendo across leadership, software engineering, architecture, quality assurance, finance and HR. | https://www.incaendo.com/teams/ | index, follow, max-image-preview:large | Complete; default image | Organization, WebSite, AboutPage | PASS |
| /insights/ | Technology Insights & Engineering Ideas \| Incaendo | Articles and case studies from Incaendo on choosing a software partner, custom software, tech stacks, AI, web development, cloud and data. | https://www.incaendo.com/insights/ | index, follow, max-image-preview:large | Complete; default image | Organization, WebSite, CollectionPage | PASS |
| /blog/ (alias) | Same as /insights/ | Same as /insights/ | https://www.incaendo.com/insights/ | index, follow, max-image-preview:large | Complete; default image | Organization, WebSite, CollectionPage | PASS; duplicate canonical |
| /contact/ | Discuss a Project \| Contact Incaendo | Tell us about your software, web, mobile or AI project. Send an enquiry to the Incaendo team in Noida or email info@incaendo.com. | https://www.incaendo.com/contact/ | index, follow, max-image-preview:large | Complete; default image | Organization, WebSite, ContactPage | PASS |
| /faq/ | Frequently Asked Questions \| Incaendo | Frequently asked questions about Incaendo mobile app development, web applications, UI/UX design, and technology solutions. | https://www.incaendo.com/faq/ | index, follow, max-image-preview:large | Complete; default image | Organization, WebSite, WebPage | PASS |
| /careers/ | Careers & Opportunities \| Incaendo | Careers at Incaendo, a software development company in Noida. No openings are listed right now; roles will be published here when ready. | https://www.incaendo.com/careers/ | noindex, follow | Complete; default image | Organization, WebSite, WebPage | PASS; excluded from sitemap |
| /privacy-policy/ | Privacy Policy \| Incaendo | Read Incaendo's Privacy Policy to understand how we collect, use, protect, and manage your personal information while you use our website and services. | https://www.incaendo.com/privacy-policy/ | index, follow, max-image-preview:large | Complete; default image | Organization, WebSite, WebPage | PASS technically; WARNING content approval |
| /privacy/ (alias) | Same as /privacy-policy/ | Same as /privacy-policy/ | https://www.incaendo.com/privacy-policy/ | index, follow, max-image-preview:large | Complete; default image | Organization, WebSite, WebPage | PASS; duplicate canonical |
| /terms-and-conditions/ | Terms & Conditions \| Incaendo | Read Incaendo's Terms & Conditions governing access to and use of our website, products, and technology services. | https://www.incaendo.com/terms-and-conditions/ | index, follow, max-image-preview:large | Complete; default image | Organization, WebSite, WebPage | PASS |
| /products/nirvan/ | NIRVAN \| Healthcare CRM & Hospital Management Platform | Simplify healthcare operations with one connected platform for clinics, hospitals, and growing healthcare networks. Patient management, appointment scheduling, billing, and clinical workflows. | https://www.incaendo.com/products/nirvan/ | index, follow, max-image-preview:large | Complete; custom dashboard image | Organization, WebSite, WebPage, SoftwareApplication | PASS |

### Canonical article pages

Each canonical article route below has a title rendered as the article title plus “ | Incaendo”; the meta description is the excerpt shown below. OG and Twitter titles/descriptions match those values, OG URL is the canonical, image fields come from the article image, and there is one JSON-LD graph. “Published” pages have index, follow, article metadata, and BlogPosting or Article schema. “Draft” pages have noindex, follow and no article-specific schema. The same data is rendered by legacy routes in /blog/ and /post/, but all those routes canonicalize to /insights/.

| Canonical route | Article title | Description | Robots / article schema | Result |
| --- | --- | --- | --- | --- |
| /insights/how-to-choose-the-right-software-development-company-in-noida-for-your-business/ | How to Choose the Right Software Development Company in Noida for Your Business | Choosing the right technology partner is an important decision for any growing business. In this guide, we explain what businesses should consider when choosing a software development company in Noida. | index, follow / BlogPosting | PASS |
| /insights/how-custom-software-development-empowers-your-business-to-automate-scale-and-grow-in-2026/ | How Custom Software Development Empowers Your Business to Automate, Scale and Grow in 2026. | Businesses are constantly challenged to move faster, serve clients better, and stay abreast of evolving technology. Discover how custom software development automates processes and unlocks growth. | index, follow / BlogPosting | PASS |
| /insights/choosing-the-right-tech-stack-for-your-startup-in-2025/ | Choosing the Right Tech Stack for Your Startup in 2025 | In today's rapidly evolving startup landscape, selecting the right technology stack can determine the success or failure of your business. Here is how to navigate factors, frameworks, and pitfalls. | index, follow / BlogPosting | PASS |
| /insights/case-study-how-we-helped-dominos-india-centralise-data-automate-settlements-and-refunds/ | Case Study: How We Helped Domino’s India Centralise Data & Automate Settlements and Refunds | Discover how Incaendo Technologies helped Domino's India unify fragmented data systems across 1,100+ stores, eliminate data silos, and automate mission-critical financial workflows. | index, follow / Article | PASS |
| /insights/from-ai-experiments-to-production/ | From AI Experiments to Production: Building Systems that Deliver Value | A practical path from an impressive prototype to a dependable part of everyday work—starting with the task, the data and the people who will use it. | noindex, follow / no article schema | PASS |
| /insights/practical-ai-integration-existing-applications/ | Practical AI Integration for Existing Business Applications | Add an AI capability to a product people already use by respecting its data, permissions, interaction patterns and operational limits. | noindex, follow / no article schema | PASS |
| /insights/designing-maintainable-apis-growing-products/ | Designing Maintainable APIs for Growing Products | Clear contracts, predictable errors and thoughtful change management help an API remain understandable as products and integrations evolve. | noindex, follow / no article schema | PASS |
| /insights/improving-web-application-performance/ | Improving Web Application Performance without Guesswork | A measurement-led checklist for finding the slow part of a web experience and improving it without trading away accessibility or clarity. | noindex, follow / no article schema | PASS |
| /insights/cicd-practices-reliable-delivery/ | CI/CD Practices for More Reliable Software Delivery | A delivery pipeline should make changes easier to validate and release—not add ceremony that teams work around. | noindex, follow / no article schema | PASS |
| /insights/making-cloud-infrastructure-observable/ | Making Cloud Infrastructure More Observable | Logs, metrics and traces answer different questions. A shared view of all three helps teams understand behavior across connected services. | noindex, follow / no article schema | PASS |
| /insights/data-quality-foundation-business-analytics/ | Data Quality: The Foundation for Useful Business Analytics | Clear definitions and visible data checks give teams a stronger basis for interpreting reports and making decisions. | noindex, follow / no article schema | PASS |
| /insights/accessible-responsive-interfaces-that-scale/ | Building Accessible, Responsive Interfaces that Scale | Accessible foundations and reusable interface patterns help products remain clear across devices, input methods and evolving requirements. | noindex, follow / no article schema | PASS |
| /insights/moving-machine-learning-models-into-production/ | Moving Machine Learning Models into Production | Serving a model is only one part of a production system. Data changes, evaluation, monitoring and ownership all need a place in the plan. | noindex, follow / no article schema | PASS |
| /insights/technology-decisions-digital-change/ | Technology Decisions that Make Digital Change More Practical | Digital transformation is easier to navigate when teams connect business priorities to specific workflows, systems and measures of progress. | noindex, follow / no article schema | PASS |

The remaining 32 generated HTML outputs are legacy article URLs: every one of the 14 article slugs appears under /blog/ and /post/, plus the old slug aliases choosing-tech-stack-for-startup-2025 and case-study-how-we-helped-domino-s-india-centralise-data-automate-settlements-and-refunds under both prefixes. They retain the corresponding article metadata and canonicalize to the current /insights/ URL. This yields 60 HTML outputs total: 14 static route outputs + 14 canonical insight outputs + 16 blog outputs + 16 post outputs.

No empty title or description, local hostname, or non-production canonical was found. Titles repeated in output belong to the same content served on legacy paths and share the canonical target; they are not separate canonical pages. Long article titles and descriptions can still be shortened editorially for clearer result presentation; search engines may truncate or rewrite them.

## 6. Local production-build test results

The command declared in package.json is npm run build. It completed successfully. Astro reported “60 page(s) built” and completed optimized image generation. The build generated static HTML, dist/sitemap.xml, and dist/robots.txt. No SEO-related build error was reported.

| Test | Expected result | Actual result | Status | Evidence / notes |
| --- | --- | --- | --- | --- |
| Production build | Exit successfully | Completed successfully in 3.39 seconds; Astro build complete | PASS | npm run build |
| Generated HTML | All project routes have HTML | 60 page outputs emitted | PASS | Build log and dist scan |
| Page metadata presence | Title and description on every HTML page | Present on all 60; no empty title or description found | PASS | Parsed generated HTML |
| Canonicals | One canonical per HTML page, production host, correct route | All 60 have an absolute https://www.incaendo.com canonical; aliases point to intended primary route | PASS | Parsed generated HTML |
| Robots directives | Intended index/noindex behavior; no conflicting directive | 29 HTML pages have index, follow, max-image-preview:large; 31 have noindex, follow (careers plus ten drafts across canonical and legacy outputs) | PASS | Parsed generated HTML |
| Open Graph | Title, description, URL, image, and type present | Present on all 60 pages | PASS | Parsed generated HTML |
| Twitter/X card | Card, title, description, image present | Present on all 60 pages; summary_large_image | PASS | Parsed generated HTML |
| JSON-LD syntax | Every block parses as JSON | One block on every HTML output; all 60 parsed | PASS | Local JSON parser |
| JSON-LD node types | Expected shared and page-level nodes | Organization and WebSite throughout; page types and service/product/article nodes observed where expected | PASS | Locally inspected graph nodes; no online rich-result test |
| Sitemap generation | dist/sitemap.xml exists | Exists and contains 15 URL entries | PASS | Inspected emitted file |
| Sitemap URL quality | Production URLs, canonical paths, no duplicate or noindex paths | 15 distinct HTTPS www URLs; no localhost, aliases, careers, or draft articles | PASS | Inspected every loc entry |
| XML parser validation | XML parser accepts sitemap | No system XML validator is installed; XML was inspected manually but not parser-validated | NOT TESTED | xmllint unavailable; no dependency installed |
| robots.txt generation/content | Public root file allows intended crawling and names sitemap | User-agent: *, Allow: /, and production Sitemap line present | PASS | Inspected dist/robots.txt |
| robots.txt HTTP | Public route returns 200 text/plain | HTTP 200 | PASS | Astro preview on port 4322 |
| Sitemap HTTP | Public route returns 200 XML | HTTP 200, content-type text/xml | PASS | Astro preview on port 4322 |
| Favicon and touch icon files | Both referenced icons are available | Both returned HTTP 200 image/png | PASS | Astro preview |
| Default social image | Emitted image path is available | Optimized hero-orbit JPG returned HTTP 200 image/jpeg | PASS | Astro preview |
| Mobile viewport | Every document has viewport metadata | Present on all 60 generated pages | PASS | Generated HTML scan |
| Image alt attributes | No rendered img without an alt attribute | None found across all 60 pages; decorative empty alt values are present where appropriate | PASS | Generated HTML scan |
| H1 hierarchy check | One H1 per page | Exactly one H1 found on each of the 60 pages | PASS | Generated HTML scan; full heading-level progression was not separately linted |
| Internal target check | Root-relative internal links resolve to built page or asset | 2,080 links checked; zero broken targets | PASS | Local read-only dist scan |
| Sample route HTTP | Important pages respond successfully | Home, contact, and an insight article returned HTTP 200 | PASS | Astro preview on 127.0.0.1:4322 |
| Unknown route HTTP | Unknown URL returns 404 | /does-not-exist returned HTTP 404 | PASS | Astro preview |
| Slashless route behavior | Slashless page URL redirects to canonical slash URL | /contact returned HTTP 200 without redirect in local preview | WARNING | Host/CDN redirect behavior is not part of Astro static output |
| Full schema/rich-results eligibility | External validator accepts the content for supported Google features | Not checked with Google Rich Results Test or Schema.org Validator | NOT TESTED | Requires external validation; JSON syntax alone is insufficient |
| Production domain and HTTPS redirects | HTTP and apex hosts redirect to HTTPS www | Cannot verify; no production deployment/host access was provided | REQUIRES PRODUCTION | Configure and test host/CDN rules |
| Legacy route redirects | /blog/, /post/, /privacy/ redirect to primary routes | Cannot verify; aliases currently render separate static pages | REQUIRES PRODUCTION | Checklist exists in docs/deployment-checklist.md |
| Staging exclusion | Preview/staging is private or sends noindex | No staging host/config was available to inspect | REQUIRES PRODUCTION | Current HTML uses production canonicals and index directives on public pages |
| Google discovery/indexing/performance | Google can fetch, index, and report site data | No live deployment or Search Console property access | REQUIRES PRODUCTION | No indexing or ranking claim is made |
| Legal policy approval | Indexable legal content is approved and accurate | README describes the privacy page as a draft, while /privacy-policy/ is indexable and in the sitemap | WARNING | Requires a content owner/legal review before launch |

## 7. Sitemap, robots, canonical, and indexability findings

### Sitemap

- Filename and URL: /sitemap.xml.
- Local build artifact: dist/sitemap.xml.
- URL count: 15.
- URL origin: all entries use https://www.incaendo.com.
- Route coverage: home, AI technology, contact, FAQ, insights listing, four published insight pages, privacy policy, NIRVAN, projects, services, teams, and terms.
- Exclusions: careers is noindex; ten sample articles are noindex; /blog/, /privacy/, /blog/*, and /post/* are alternate routes rather than preferred URLs.
- Duplicate URLs: none found in the 15 loc entries.
- Dates: published insight URLs have lastmod dates from article data. These are source-data dates; keep them accurate when content changes.
- Sitemap and canonicals agree on the preferred www HTTPS origin and trailing slash.
- Limitation: no external Search Console sitemap processing status exists yet. Formal XML parser validation could not be run because xmllint is not installed. No package was installed.

### robots.txt

The generated file is:

    User-agent: *
    Allow: /
    Sitemap: https://www.incaendo.com/sitemap.xml

This leaves all paths crawlable so crawlers can discover each page and read page-level noindex directives. It does not itself remove a page from search. The local HTTP endpoint returned 200 with a plain-text content type.

### Canonical and indexability

All 60 HTML pages have a production canonical. The 29 outputs using index include the 11 indexable static canonical pages, four published article canonicals, and legacy copies that point to those canonical pages. The 31 outputs using noindex include /careers/ and ten draft articles rendered through /insights/, /blog/, and /post/. No page is blocked by robots.txt.

The canonical signals are consistent with sitemap membership. However, canonical tags are hints and do not replace redirects. Local preview serves /contact as 200, so production should explicitly normalize slashless requests to /contact/.

## 8. Structured data validation

Each generated page has one JSON-LD script. All 60 scripts parsed as valid JSON. Shared nodes consistently use the schema.org context and include Organization and WebSite. Page-level types match the route purpose: the services page has six Service nodes, NIRVAN has SoftwareApplication, the teams page has AboutPage, contact has ContactPage, listings have CollectionPage, and published articles have BlogPosting or Article. BreadcrumbList nodes appear on article pages.

This is a syntax and source-structure audit only. It does not prove Google's rich-result eligibility, business fact accuracy, or full semantic correctness. The external Rich Results Test and Schema.org Validator were not run. Google may decide not to show an enhanced result even when valid markup is present.

## 9. Internal links, headings, images, and other SEO checks

- Internal links: 2,080 root-relative links in generated HTML resolved to a built file or route. No broken targets were found.
- Heading outline: one H1 was found on every built page. The scan did not separately judge whether every H2–H6 sequence is editorially ideal.
- Image alt: no img element lacked an alt attribute. Some alt values are empty, which is appropriate for decorative imagery. Meaningful image descriptions still need editorial review for accuracy.
- Page language: layouts use lang=en.
- Mobile viewport: present on every HTML page.
- Favicon and touch icon: referenced files exist in dist and return HTTP 200 locally.
- Social images: the default transformed hero-orbit image exists and returns HTTP 200 locally. NIRVAN also emits its transformed custom image. Article metadata uses article-specific imported images.
- Redirect rules: no host/CDN redirect configuration is present in Astro source. The deployment checklist documents needed rules.
- Analytics: HubSpot tracking is included, but no Google Analytics 4, Google Tag Manager, or Search Console verification was found in the project source.
- Environment variables: .env.example says canonical/social/sitemap URLs use astro.config.mjs; no SEO-specific environment variable is required.
- Favicon note: the project uses PNG icons and no favicon.ico. This is not a build failure; the referenced PNG icons were reachable locally.

## 10. Localhost versus production

| SEO check | Localhost | Production | Why |
| --- | --- | --- | --- |
| Static HTML title and description | Fully testable | Verify deployed source too | Build renders them before a browser or crawler runs. |
| Canonical values | Fully testable | Confirm public response matches current build | Site origin is fixed to production in Astro config. |
| Robots meta | Fully testable | Confirm CDN/proxy does not inject conflicting headers | Generated in HTML; HTTP X-Robots-Tag can add another rule. |
| Open Graph/Twitter fields | Fully testable | Social scrapers must be able to fetch the page and image | Local source confirms values, not external scraper access or cache state. |
| JSON-LD JSON syntax | Fully testable | Recheck deployed page | Build output can be parsed locally. |
| Schema rich-result eligibility | Partially testable | Use Google's external validator after deploy | Search feature eligibility and page/content policies need validation. |
| Sitemap contents and URLs | Fully testable | Verify live /sitemap.xml and submit in Search Console | Local file confirms generation, not public hosting or Google processing. |
| robots.txt text | Fully testable | Verify live /robots.txt | Hosting could replace or block the file. |
| Internal links and assets | Fully testable against dist | Crawl public site too | Local check does not cover host rewrites or access controls. |
| Redirect behavior | Partially testable | Must test http→https, apex→www, slash, and legacy routes | Redirects belong to the host/CDN, not this static build. |
| Staging noindex/private access | Cannot confirm for an unconfigured host | Must verify before exposing previews | Current config deliberately emits production canonicals. |
| Googlebot fetch and rendering | No | Yes, after deploy | Google needs an externally reachable URL. |
| Google-selected canonical/index status | No | Yes, Search Console URL Inspection | Only Google’s index provides its selected canonical and crawl status. |
| Rankings and search performance | No | Yes, after data accrues | Requires live search exposure and Search Console data. |
| Search/social cache behavior | Not fully | Yes | External services fetch, cache, and render their own previews. |

Localhost or preview URLs must not appear in production canonicals or sitemap entries because those addresses are not the public pages intended to be indexed. This project avoids that by fixing Astro’s site origin to https://www.incaendo.com. The trade-off is that staging builds also contain production canonical URLs and index directives; staging must be access-protected or emit a site-wide noindex response header.

## 11. Production deployment requirements

### Required host/CDN configuration

1. Serve the static dist output over HTTPS at https://www.incaendo.com.
2. Permanently redirect all HTTP URLs to HTTPS.
3. Permanently redirect https://incaendo.com to https://www.incaendo.com.
4. Permanently redirect slashless page URLs to their trailing-slash versions. Local links often omit the slash; canonicals and sitemap URLs include it.
5. Add legacy redirects listed in docs/deployment-checklist.md: /blog/ to /insights/, /blog/:slug/ and /post/:slug/ to /insights/:slug/, old article alias slugs to their current slugs, and /privacy/ to /privacy-policy/.
6. Ensure unknown paths return a real 404. The local preview did return 404 for an unknown URL; the production host must be checked independently.
7. Keep dist/robots.txt and dist/sitemap.xml reachable at the site root with their intended content.
8. Protect staging and preview deployments with authentication or an X-Robots-Tag: noindex header. Do not expose an indexable staging copy with production canonicals.
9. Confirm privacy and terms copy, business facts, dates, and article publication status with their owners before making the site public.

### Code/configuration changes

No production SEO origin change is indicated by the local build: astro.config.mjs already uses the intended www HTTPS origin. No SEO environment variable is needed. No application-code change was made or is required based on the local metadata checks.

After the host redirects work, a follow-up cleanup could replace legacy alias pages with redirects and remove duplicate routes. That is optional cleanup after redirect behavior is proven, not a prerequisite to preserve canonical signals.

### External account actions

- Verify site ownership in Google Search Console. A DNS TXT Domain property is a strong option because it covers the domain’s protocol and host variants without a code verification tag.
- Submit https://www.incaendo.com/sitemap.xml in Search Console after deployment.
- Use URL Inspection on the homepage, one service page, and one published article. Check live fetch, indexability, and Google-selected canonical.
- Review the Page indexing and Sitemaps reports after Google has processed the site.
- Decide whether GA4 is needed in addition to existing HubSpot tracking. No GA4/GTM integration is in the repository.
- Optionally use Bing Webmaster Tools and social platform preview inspectors.

No account access, verification, submission, or indexing request was performed in this audit.

## 12. What happens after deployment

1. **Deploy:** the host serves the dist files. The built HTML already includes metadata; it does not wait for client-side JavaScript.
2. **Google can fetch:** HTTPS and domain redirects should bring crawlers to one stable www host and URL form.
3. **Discovery:** Google may find pages through internal links, external links, the sitemap line in robots.txt, or a sitemap submitted in Search Console.
4. **Crawl:** Googlebot requests a URL. robots.txt allows it. The crawler receives HTML and can read title, description, canonical, robots, links, and JSON-LD.
5. **Canonical/indexing decision:** Google considers redirects, canonicals, sitemap membership, page content, and other signals. It may choose a different canonical. noindex pages should not appear once Google fetches the directive.
6. **Indexing:** Google may store an eligible page if it considers it useful and appropriate. A crawl does not guarantee indexing.
7. **Search result generation:** Google chooses a title link and snippet from available page and site information. It may rewrite the provided title or description. Structured data and favicons only enable certain presentations; neither is guaranteed.
8. **Monitoring:** Search Console reports crawl/index state, sitemap processing, issues, and search performance after data exists.

### Search Console tools

- **Sitemaps report:** submit the production sitemap and check whether Google fetched it and found errors. Submission is a discovery hint, not a promise of indexing.
- **URL Inspection:** enter a fully qualified URL to see Google’s indexed copy, last crawl, indexing eligibility, and Google-selected canonical. A live test can check the currently deployed URL; Request indexing asks Google to recrawl but does not guarantee inclusion.
- **Indexing reports:** review which routes are indexed and why others are excluded. A deliberate noindex result on careers and draft articles is expected.
- **Performance report:** after visibility data accrues, review impressions, clicks, click-through rate, average position, queries, pages, and countries. These are observed results, not forecasts.

Google says recrawling can take days to weeks, with no guaranteed schedule. New sites or pages may take longer; Search Console requests do not guarantee indexing. See [URL Inspection](https://support.google.com/webmasters/answer/9012289/) and [Google’s recrawl guidance](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl).

## 13. Findings and recommended fixes

### Warnings and actions

1. **Slashless URLs are served without a redirect in local preview.** Canonicals and sitemap use trailing slashes, while internal links commonly use slashless paths. Configure one-hop permanent redirects at the host/CDN and test representative links after deployment.
2. **Legacy URLs still return full pages.** Canonicals identify preferred pages, but 301 redirects would consolidate access and prevent users landing on duplicate URLs. The exact source-to-target list is already in docs/deployment-checklist.md.
3. **Staging needs protection.** Since the canonical origin is fixed and ordinary pages are indexable, a public staging host could be crawled with production canonicals. Add authentication or an X-Robots-Tag noindex rule at the staging host.
4. **Privacy policy approval is unclear.** README.md calls the privacy page a draft, while /privacy-policy/ is indexable and included in the sitemap. Confirm the policy text and claims are approved; if not, keep the URL noindex or private until approval.
5. **No external schema test was run.** JSON syntax passed locally. Run Rich Results Test and a Schema.org validator on deployed canonical pages. The former only tests supported Google result features.
6. **Sitemap XML did not get parser validation.** It was manually inspected and served locally as XML, but xmllint is not installed. A CI validator can be considered later; no dependency was installed for this audit.
7. **Article copy may be long or dated.** Titles such as the 2025 tech-stack article and long case-study title may be shortened or refreshed editorially. Google can truncate or rewrite result text. This is a presentation/content recommendation, not a failed metadata-generation check.
8. **Branch differs from the request.** Audit was performed on main. Confirm whether SEO work is present on the intended feature branch before merging or releasing.

### No local technical failure found

The production build succeeded. All 60 outputs contain the common metadata and production canonicals. No empty title/description, local host URL, missing image alt attribute, invalid JSON-LD syntax, missing H1, or broken internal target was found. The sitemap and robots.txt were emitted and served from the local preview.

## 14. Final production readiness checklist

- [ ] Confirm the intended branch is checked out; the current branch is main.
- [ ] Approve privacy policy, terms, business address/contact facts, organization social URLs, and article publication flags.
- [ ] Deploy the latest successful static build to the chosen host.
- [ ] Configure HTTPS, apex-to-www, and slashless-to-trailing-slash permanent redirects.
- [ ] Configure all legacy route redirects and verify no redirect chains.
- [ ] Confirm unknown production routes return HTTP 404.
- [ ] Protect staging or add X-Robots-Tag: noindex before exposing it.
- [ ] Confirm production /robots.txt and /sitemap.xml return 200 and contain the expected text/XML.
- [ ] Verify homepage, services, NIRVAN, and article canonicals and social images on the public site.
- [ ] Verify the domain in Google Search Console and submit the sitemap.
- [ ] Use URL Inspection for key pages; review Google-selected canonical after crawl.
- [ ] Run Rich Results Test on service/product/article pages and Schema.org Validator on representative JSON-LD.
- [ ] After data accrues, inspect Search Console indexing and performance reports.

## 15. Manager-friendly summary

The website generates search metadata during its production build. The local build and metadata checks passed. The sitemap is a clean list of 15 intended production URLs; draft editorial content and duplicate routes are excluded. We cannot yet confirm Google indexing or ranking because the website has not been deployed and Search Console was not accessed.

The work remaining is mostly at the hosting and ownership level: enforce one HTTPS www URL form with redirects, keep staging out of search, publish the files, verify ownership in Search Console, and submit the sitemap. Before launch, confirm that the privacy policy is final because it is currently eligible for indexing even though the README describes it as a draft.

## 16. SEO — Questions and Answers

| Question | Answer | Practical example / where to verify |
| --- | --- | --- |
| 1. What exactly did we implement? | Shared page titles and descriptions, canonicals, robots rules, Open Graph and Twitter cards, JSON-LD, favicon links, a generated sitemap, and a permissive robots.txt that points to the sitemap. | src/components/SEO.astro, src/data/seo.js, src/pages/sitemap.xml.js, public/robots.txt |
| 2. Why did we implement it? | To help search engines find and interpret the company’s pages, choose preferred URLs, and present useful search/share previews. It removes avoidable technical ambiguity; it does not create ranking demand by itself. | Home, services, projects, insights, and NIRVAN pages |
| 3. How does each SEO feature work? | Metadata describes pages, canonicals identify preferred duplicates, robots directs indexing, sitemap and links aid discovery, robots.txt controls access, JSON-LD gives machine-readable facts, and social tags shape share cards. | Feature inventory in this report and the SEO component |
| 4. Where does each feature work? | Titles, descriptions, canonical, robots, OG, Twitter, and JSON-LD are in the HTML head. Sitemap and robots.txt are root files. Redirects belong to the production host/CDN. Search Console works in Google’s external account. | Built pages in dist/, plus host configuration |
| 5. When does each feature execute? | Astro renders the metadata and sitemap during build. Browser/site visitors receive it on page load. Search behavior starts only when a crawler fetches the deployed URL. Social previews happen when a platform fetches a shared URL. | npm run build, then deployed source and platform fetch |
| 6. How does Google discover our pages? | It can follow internal/external links, read the sitemap URL in robots.txt, or process a sitemap submitted in Search Console. | Sitemap includes /services/ and approved /insights/ URLs |
| 7. How does Google crawl our pages? | Googlebot requests publicly reachable URLs and reads robots.txt before crawling paths. This site allows all paths, so Google can see page-level metadata. | public/robots.txt; test public HTTP responses after deploy |
| 8. How does Google decide whether to index a page? | It considers whether the page can be crawled, robots directives, canonical signals, duplication, and its own content and quality systems. A crawl does not guarantee indexing. | Careers and ten sample articles are deliberately noindex |
| 9. How do title and meta descriptions help? | A title gives a concise page label and can inform the search result title. A description can be a candidate snippet. Google may rewrite either; descriptions are not guaranteed ranking boosts. | Home title/description in src/data/site-content.js |
| 10. What is the purpose of canonical URLs? | They tell crawlers which URL is preferred when the same content is served in multiple places. They are signals, not redirects or absolute commands. | /blog/<slug>/ canonical points to /insights/<slug>/ |
| 11. What is the difference between robots.txt and noindex? | robots.txt controls whether a crawler may fetch a path. noindex is read from fetched HTML and tells a crawler not to include that page in results. Do not block a page in robots.txt if the crawler needs to see its noindex. | robots.txt allows /; careers HTML says noindex, follow |
| 12. What does an XML sitemap do? | It lists preferred URLs and can help search engines discover them. It does not force crawling or indexing. | dist/sitemap.xml has 15 production URLs |
| 13. Why did we implement Open Graph? | It provides social platforms with a page title, description, URL, and image for link previews. Its main benefit is share presentation. | og:title and og:image in generated page source |
| 14. Why did we implement Twitter cards? | They give X card layout hints and content for shared links, including a large image card. This is social sharing metadata, not a Google ranking guarantee. | twitter:card is summary_large_image on all pages |
| 15. What is JSON-LD? | A JSON format embedded in a page that describes entities and relationships using Schema.org types. | Organization, WebSite, Service, SoftwareApplication, BlogPosting |
| 16. Does structured data guarantee rich results? | No. It can make eligible pages understandable for supported features, but Google decides whether to show them and applies content and quality requirements. | Validate after deployment; see Google structured-data guidelines |
| 17. Does SEO guarantee higher rankings? | No. It helps remove technical obstacles and clarify relevance. Ranking depends on many factors, including usefulness, competition, reputation, and links. | This audit makes no ranking claim |
| 18. Can we test SEO on localhost? | Yes, we can test built HTML, metadata values, JSON syntax, routes, assets, sitemap content, and link targets. We cannot test Google’s index or production-host behavior locally. | npm run build; npm run preview |
| 19. Which tests have already passed? | Build, 60 HTML outputs, metadata presence, production canonicals, intended robots values, OG/Twitter tags, JSON-LD syntax, 15 sitemap URLs, robots.txt, sampled HTTP pages/assets, one H1 per page, no missing alt attributes, and 2,080 internal-link targets. | Test matrix above |
| 20. What cannot be tested until production? | HTTPS/domain redirects, host slash normalization, legacy redirects, staging protection, public deployment responses, Googlebot access, indexing, selected canonicals, search visibility, and performance. | Host/CDN and Search Console |
| 21. What changes are required before production? | No SEO origin code change is currently indicated. Configure redirects and staging protection at the host; approve policy/business content; then deploy and verify public files. | docs/deployment-checklist.md |
| 22. Do we need Google Search Console? | It is not required for the site to load, but it is the practical way to see Google’s crawl/index status, submit a sitemap, inspect URLs, and monitor search performance. | Verify the domain after deployment |
| 23. How do we know if Google indexed a page? | Inspect its full URL in Search Console and review the indexed result and indexing status. A site: search is only a rough check, not a reliable status report. | URL Inspection after Google has crawled it |
| 24. How do we monitor ranking and search performance? | Use Search Console’s Performance report for impressions, clicks, CTR, average position, queries, and pages; compare trends over time. | Search Console Performance report |
| 25. How long can indexing and ranking changes take? | Crawling and indexing may take days to weeks, can take longer, and are not guaranteed. Search performance changes may take additional time and are not predictable from a local build. | Google URL Inspection and Performance reports |

## 17. References

### Repository files

- astro.config.mjs
- src/components/SEO.astro
- src/data/seo.js
- src/data/site-content.js
- src/data/articles.js
- src/pages/sitemap.xml.js
- public/robots.txt
- docs/seo-implementation.md
- docs/deployment-checklist.md
- README.md
- package.json

### Google documentation

- [Title links in Google Search](https://developers.google.com/search/docs/appearance/title-link)
- [Control snippets in search results](https://developers.google.com/search/docs/appearance/snippet)
- [Canonical URL guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Robots meta tag specification](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)
- [Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Structured data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [Google favicon guidance](https://developers.google.com/search/docs/appearance/favicon-in-search)
- [Search Console URL Inspection](https://support.google.com/webmasters/answer/9012289/)
- [Search Console Performance report](https://support.google.com/webmasters/answer/7576553)
- [Ask Google to recrawl URLs](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl)
