# SiteHeader

The bar at the top of every web page: the primary logo on the left, up to six sentence-case links, and one primary `Button` ("Book a call") on the right. Below 1024px of width (`bp-lg`) the links and button move into a mobile menu opened by a 44px menu button.

**The consumer provides**

- `<header class="inc-header">` inside a wrapper with `inc-shell` (the shell switches layout by its own width, so it works in a page, an iframe or a 390px preview), then `inc-container` and `inc-header-bar`.
- The logo link `inc-header-logo` with the primary logo and `alt="Incaendo Technologies, home"`.
- `<nav class="inc-nav" aria-label="Main">` with `inc-nav-list` links (`inc-nav-link`), the current page marked `aria-current="page"`, then the primary button.
- `<button class="inc-menu-button" aria-expanded="false" aria-controls="menu-id" aria-label="Menu">` holding the Lucide `menu` icon (`inc-icon-open`) and `x` icon (`inc-icon-close`).
- `<div class="inc-mobile-menu" id="menu-id" hidden>` repeating the links and the button.

**Behaviour the site adds (a few lines of script)**

- The menu button toggles `aria-expanded` and the menu's `hidden` attribute. Escape closes the menu and returns focus to the button.
- Add `is-scrolled` to the header once the page has scrolled, for the `shadow-2` edge. The open menu gets `shadow-3` automatically.
- The header is `position: sticky`. Put the skip link (`inc-skip-link`) before it.

Do: keep the main links to the five or six pages people look for most. Don't: add a second filled button, dropdown mega-menus or a coloured header background.
