# HN Growth Media website

Three files, no build step. Open `index.html` in a browser or upload the folder to any host.

## Files

- `index.html` — all the page content (words, services, contact details)
- `styles.css` — colours, fonts and layout
- `script.js` — menu, accordions, quote form, and all animations (GSAP + Lenis loaded from CDN, so the site needs internet for the smooth scroll and motion; without them the page still works, just without animation)

## Things to change before going live

1. **WhatsApp number**: set in `script.js` as `CONFIG.whatsapp` (currently +92 312 4671980). Change it there and in the Contact section of `index.html`.
2. **Logo**: `logo.png` (transparent, dark text) is used in the header and footer; `logo-light.png` (transparent, light text) in the loader. Replace both to change the logo.
3. **Photo**: `mutahar.png` (background removed) is shown in the About section on a gold disc. Replace with another cut-out PNG to change it. `mutahar.jpg` and `mutahar-2.jpg` are spares.
4. **Service wording and "Includes" lines**: edit freely in `index.html`. Prices are not shown on purpose; add them if wanted.

## Hosting

Any static host works: Netlify Drop, Vercel, Cloudflare Pages, GitHub Pages, or cPanel `public_html`. Upload the whole folder (html, css, js, logo.png, mutahar.jpg) and the site is live.

The quote form opens the visitor's email app with the message filled in. Nothing is stored on a server. To receive form submissions without an email app, connect the form to Formspree or Netlify Forms later.
