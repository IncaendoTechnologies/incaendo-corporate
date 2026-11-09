import { defineConfig } from 'astro/config'
import react from '@astrojs/react'

export default defineConfig({
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
