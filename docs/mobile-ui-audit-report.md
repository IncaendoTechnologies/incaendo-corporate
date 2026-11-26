# Mobile UI & Functionality Audit — New Incaendo Website

**Date:** 19 November 2026
**Site tested:** New Astro website (production build, served locally)
**Repository:** `IncaendoTechnologies/incaendo-corporate`, checked out on branch `upcoming`, the same commit as `main` after PR #2
**Type of work:** Read-only check. **No code, content or configuration was changed.**

---

## 1. Why this check was done

According to GA4, about **90% of the traffic and reach** on www.incaendo.com comes from **mobile phones**. Before the new website replaces the live Wix site, we needed to know two things:

1. Does anything on the new website **break on mobile**, in its layout or in how it works?
2. How does the new website compare with the live site on mobile speed and optimisation? _(This part is still pending. See section 7.)_

---

## 2. Summary in simple words

> **Nothing is broken on mobile.** All 60 pages fit the phone screen, none of them scroll sideways, and there are no JavaScript errors, broken images or missing files. The menu, contact form, FAQ, filters and carousels all work.
>
> The main issue before launch is **content**, not design. Some placeholder or draft text ("provisional", "to be confirmed", "sample editorial draft") is visible to the public. A few smaller design improvements are also listed below.

| Area                                                  | Status                            |
| ----------------------------------------------------- | --------------------------------- |
| Layout fits the mobile screen (no sideways scrolling) | ✅ Pass, 60/60 pages              |
| JavaScript / console errors                           | ✅ None                           |
| Broken images or missing files (404)                  | ✅ None                           |
| Image alt text (accessibility & SEO)                  | ✅ Present on all images          |
| One main heading (H1) per page                        | ✅ All pages                      |
| Mobile menu                                           | ✅ Works                          |
| Contact form validation                               | ✅ Works                          |
| FAQ, filters, carousels                               | ✅ Work                           |
| Draft or placeholder content visible to the public    | ⚠️ Needs action before launch     |
| Page weight on mobile data                            | ⚠️ Home and Teams pages are heavy |
| Small design polish items                             | ⚠️ Minor                          |

---

## 3. How the test was done

| Item              | Detail                                                                                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Build             | `astro build` (production) on Node 22, output written to a temporary folder and not to the project                                                      |
| Server            | Static server with compression at `http://localhost:5055`                                                                                               |
| Browser           | Google Chrome 143, headless, controlled through Chrome DevTools Protocol                                                                                |
| Phone size        | **390 × 844 px**, 2× pixel density, touch enabled (iPhone 12/13/14 size)                                                                                |
| Pages covered     | **All 60 built pages** were checked automatically. 12 main pages were also reviewed visually with screenshots taken while scrolling down the full page. |
| Interaction tests | Real touch taps on the menu, carousel dots, FAQ, Insights filter and contact form                                                                       |

### What was checked on every page

- **Sideways scroll:** whether the page is wider than the phone screen.
- **Overflowing elements:** any box or image that sticks out past the screen edge.
- **Console errors:** JavaScript errors or warnings.
- **Network failures:** any file that returned an error (404/500) or failed to load.
- **Broken images and alt text.**
- **Tap target size:** links or buttons smaller than 24 px, which are hard to tap with a finger.
- **Small text:** text smaller than 12 px.
- **Stuck animations:** content that stays invisible after scrolling past it.
- **Viewport meta tag and H1 count.**
- **Page weight and number of requests.**

---

## 4. Results — main pages

| Page                       | Load time* | Page weight | Requests | Sideways scroll | Errors | Broken images |
| -------------------------- | ---------: | ----------: | -------: | :-------------: | :----: | :-----------: |
| Home `/`                   |      2.1 s |  **2.2 MB** |       63 |       No        |   0    |       0       |
| AI `/ai-technology/`       |      1.8 s |      1.3 MB |       40 |       No        |   0    |       0       |
| Services `/services/`      |      0.5 s |      1.3 MB |       26 |       No        |   0    |       0       |
| Projects `/projects/`      |      0.3 s |      1.5 MB |       33 |       No        |   0    |       0       |
| Teams `/teams/`            |      0.6 s |  **3.0 MB** |       46 |       No        |   0    |       0       |
| Insights `/insights/`      |      0.7 s |      1.4 MB |       29 |       No        |   0    |       0       |
| Article (sample)           |      0.5 s |      1.2 MB |       24 |       No        |   0    |       0       |
| Contact `/contact/`        |      1.4 s |      1.1 MB |       21 |       No        |   0    |       0       |
| FAQ `/faq/`                |      0.7 s |      1.0 MB |       19 |       No        |   0    |       0       |
| Careers `/careers/`        |      0.3 s |      1.0 MB |       18 |       No        |   0    |       0       |
| Nirvan `/products/nirvan/` |      0.7 s |      0.5 MB |       19 |       No        |   0    |       0       |
| Privacy / Terms            |  0.7–0.8 s |      1.0 MB |       19 |       No        |   0    |       0       |

\* Load time was measured on a local machine with no network slowdown. It is **not** the time a real phone on 4G would take. Real mobile speed needs the Lighthouse test in section 7.

The remaining 48 pages are blog, insight and post article pages. All of them passed with the same results: no sideways scroll, no errors and no broken images.

> **Note on Contact page:** the automated scan flagged one element outside the screen. It is the hidden spam-trap ("honeypot") field `contact-form-hp`, which is placed off-screen on purpose. **This is correct behaviour, not a bug.**

---

## 5. Interaction tests

| Feature              | What was tested                              | Result                                                                                                                                      |
| -------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Mobile menu (☰)     | Tap to open, check links, press Esc to close | ✅ Opens and closes. 7 links, each 47 px tall, which is easy to tap. Esc closes it.                                                         |
| Home carousel dots   | Tap the 3rd dot                              | ✅ Slide changes and the active dot updates                                                                                                 |
| FAQ accordion        | Tap a question                               | ✅ Answer opens and closes correctly                                                                                                        |
| Insights filter      | Tap "Case Studies"                           | ✅ List filters from 9 cards to 1                                                                                                           |
| Contact form         | Submit with all fields empty                 | ✅ Shows 5 clear messages ("Enter your full name.", "Enter your work email.", …), moves the cursor to the first field and **sends nothing** |
| Form font size       | Font size of every input                     | ✅ 16 px, so iPhone will not zoom in when a field is tapped                                                                                 |
| Nirvan "Book a Demo" | Link target                                  | ✅ Goes to `/contact#project-inquiry`                                                                                                       |

---

## 6. Findings — what needs attention

Nothing below breaks the site. They are listed by importance.

### 🔴 High — fix or confirm before launch

| #   | Finding                                                                                                                             | Where it shows                            | Source file                                  |
| --- | ----------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | -------------------------------------------- |
| 1   | Placeholder text **"Provisional figures, to be confirmed"** appears under the hero stats (24/7, 92% AI Accuracy)                    | AI page                                   | `src/components/AITechnologyPage.astro:225`  |
| 2   | **"Provisional Demonstration Pricing • Subject to Final Confirmation"** with prices ₹2,499 and ₹9,999 marked "(provisional sample)" | Nirvan page                               | `src/pages/products/nirvan.astro:539`        |
| 3   | **"Careers information to confirm"** notice is visible to visitors                                                                  | Careers page                              | `src/pages/careers.astro:23`                 |
| 4   | About 11 **sample articles** labelled "Sample editorial draft · Date to be confirmed" are listed next to the real articles          | Insights / Blog listing and article pages | `src/components/InsightArticlePage.astro:45` |

### 🟠 Medium

| #   | Finding                                                                                                                                                             | Where                                               | Why it matters                                                                            |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 5   | The hero browser frame shows the address `nirvan.incaendo.com/dashboard/operations`, but the picture inside is the general Incaendo hero image, not a Nirvan screen | Nirvan page (`src/pages/products/nirvan.astro:357`) | It looks like a placeholder to visitors                                                   |
| 6   | Heavy pages: **Home 2.2 MB, Teams 3.0 MB** (31 large photos)                                                                                                        | Home, Teams                                         | On slow mobile data these pages will take longer to load. Lighthouse should confirm this. |

### 🟡 Low — design polish

| #   | Finding                                                                                                                      | Where                                               |
| --- | ---------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| 7   | Mockup illustrations inside the service cards are cut off on both sides on small screens (code snippet, invoice review card) | Services page                                       |
| 8   | Carousel dots are very small (6 × 6 px). The recommended minimum for finger taps is 24 px.                                   | Home page (`src/components/SaaSProducts.astro:249`) |
| 9   | The page behind the menu can still scroll while the menu is open                                                             | All pages (header)                                  |
| 10  | Blank white space below the filter chips in the article archive                                                              | Insights page                                       |
| 11  | Some team photos have different backgrounds (grey or white)                                                                  | Teams page                                          |

> Small text (under 12 px) found on the Home page is inside the decorative laptop and phone mockups, so it is not real reading text and is acceptable.

---

## 7. Comparison with the live site (www.incaendo.com) — pending

| Item                                                                 | Live site              | New site              |
| -------------------------------------------------------------------- | ---------------------- | --------------------- |
| Platform                                                             | Wix, behind Cloudflare | Astro static site     |
| Mobile layout check                                                  | Not done yet           | ✅ Done (this report) |
| Lighthouse mobile scores (Performance, LCP, CLS, SEO, Accessibility) | ⏳ Pending             | ⏳ Pending            |

**Why it is pending:** the Lighthouse tool has to be downloaded with `npx`, and the assistant's safety settings blocked that download. It can be finished in either of these ways:

1. Run this command once in the terminal. It tests Home, Services, Projects and Contact on both sites in mobile mode and saves JSON reports.

   ```bash
   cd /tmp/claude-1000/-home-lokesh-codebase-incaendo-corp/a8a5fef2-2666-4181-a476-cb38507209b8/scratchpad && mkdir -p lh && \
   for p in home:/ services:/services projects:/projects contact:/contact; do
     n=${p%%:*}; u=${p#*:}
     npx -y lighthouse@12.6.1 "https://www.incaendo.com$u" --form-factor=mobile --output=json --output-path=lh/live-$n.json --chrome-flags="--headless=new" --quiet
     npx -y lighthouse@12.6.1 "http://localhost:5055$u/" --form-factor=mobile --output=json --output-path=lh/new-$n.json --chrome-flags="--headless=new" --quiet
   done
   ```

2. Or add an allow rule for `npx -y lighthouse@12.6.1` in `.claude/settings.local.json` so the assistant can run the test itself.

After that, this report will be updated with a side-by-side table showing which site is faster and better optimised on mobile.

---

## 8. Limits of this test

- Tested at **one screen size (390 px)** in the **Chrome engine**. Real iPhone Safari and small Android phones (360 px) were not tested.
- Load times were measured locally without network throttling, so they are **not real-world mobile speeds**.
- The contact form was tested only with empty fields. No real enquiry was sent to HubSpot.
- Visual review covered the 12 main pages. The 48 article pages were checked by the automated scan only.

---

## 9. Other work done in this session (for record)

| Step              | Detail                                                                                                                                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Git               | Committed the pending component, script and style changes and the SEO report on a new branch `feature/motion-scroll-polish` (commit `ef4f55b`) and pushed it. It was later merged into `main` as PR #2. |
| Dev server        | Started with Node 22 at `http://localhost:4321`                                                                                                                                                         |
| Production build  | Built into a temporary scratchpad folder (60 pages). The project's `dist/` folder was not touched.                                                                                                      |
| Production server | Served the build at `http://localhost:5055` for testing                                                                                                                                                 |

---

## 10. Suggested next steps

1. Run the Lighthouse comparison (section 7) to get the live site vs new site mobile scores.
2. Decide on the 🔴 High items: remove, confirm or hide the provisional and draft content before launch.
3. Compress or resize the Teams and Home images to lower page weight for mobile users.
4. Do a final check on a real iPhone and a real Android phone.
