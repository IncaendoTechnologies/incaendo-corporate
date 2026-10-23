# Incaendo Corporate Website

The corporate website is built with Astro and JavaScript ES modules. Astro renders pages by default; React is available for interactive islands when needed.

## Requirements

- Node.js 22.22.0 or newer in the 22.x line (managed with NVM via `.nvmrc`)
- npm 10 or newer

Use `nvm use` in this directory to select the project runtime.

## Getting started

```sh
npm install
npm run dev
```

## Available commands

| Command                | Purpose                                      |
| ---------------------- | -------------------------------------------- |
| `npm run dev`          | Start the local Astro development server     |
| `npm run build`        | Build the production site into `dist/`       |
| `npm run preview`      | Preview the production build locally         |
| `npm run lint`         | Lint Astro and JavaScript/React source files |
| `npm run format`       | Format project files with Prettier           |
| `npm run format:check` | Check formatting without changing files      |

## Routes

- `/` — Home
- `/ai-technology` — AI technology and innovation
- `/services` — Service areas
- `/teams` — Team and expertise
- `/projects` — Project archive
- `/insights` — Articles and updates
- `/contact` — Business enquiries
- `/careers` — Opportunities
- `/privacy` — Privacy notice draft

## Project structure

```text
src/
  assets/       Local images and other imported assets
  components/   Reusable Astro and React components
  data/         Shared navigation, service, FAQ, and page metadata
  layouts/      Shared page layouts
  pages/        File-based Astro routes
  scripts/      Browser-side motion behavior
  styles/       Global styles
public/         Static files such as robots.txt
```

Bootstrap CSS is imported through the global stylesheet. Add Bootstrap JavaScript only if a component requires its interactive behavior. React is used for the contact form island; its submit button stays disabled until `PUBLIC_CONTACT_ENDPOINT` is configured with a verified HTTPS endpoint that validates and safely handles the JSON payload.

Copy `.env.example` to `.env` for local public configuration. Set `PUBLIC_SITE_URL` to the production origin to emit canonical and absolute social metadata. A sitemap is not generated until the production origin is known.

The project materials did not include approved client names, project outcomes, testimonials, team biographies, company contact details, or legal privacy text. Pages call out these content gaps for review; replace the notices only with verified, approved information before launch. The privacy page is a draft checklist, not a final policy.
