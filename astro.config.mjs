import { defineConfig } from 'astro/config'
import react from '@astrojs/react'

export default defineConfig({
  // Production origin for canonical URLs, social metadata, and the sitemap.
  // Kept fixed so preview/staging builds never emit non-production URLs.
  site: 'https://www.incaendo.com',
  integrations: [react()],
  vite: {
    preview: {
      // Temporary demo: allow the current Cloudflare Quick Tunnel hostname
      // for `astro preview` only (dev server is unaffected). The hostname
      // changes each time the tunnel restarts.
      allowedHosts: ['referrals-sons-century-native.trycloudflare.com'],
    },
  },
})
