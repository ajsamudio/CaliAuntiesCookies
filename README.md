# Cali Aunties: website

A one-page site for Cali Aunties ("Happiness is Homemade."). Plain HTML, CSS and JavaScript with no build step.

- **Real photos**: the client's hero box photo, plus a photo for each of the 11 menu items (`assets/images/`).
- **Official logos**: header, footer and favicon use her Canva logos (`assets/images/logo/`).
- **Scroll animations**: GSAP + ScrollTrigger, with Lenis for smooth scrolling.
- **Preorder request form**: The Flirty 4-Pack ($18, one flavor), The Sweet 6-Pack ($26, one flavor) or The Party Dozen ($48, up to two flavors), plus name, contact and pickup date. Posts to Formspree (free tier). Hidden behind an "Online Preorders Coming Soon" panel until `preordersOpen` is turned on.

## Run it locally

Opening `index.html` directly works. For the most reliable preview, serve the folder:

```bash
python -m http.server 5173
```

Then open http://localhost:5173.

## Before launch: things to swap in

| What | Where |
|---|---|
| **Open preorders** | `js/flavors.js`: set `preordersOpen: true` in `window.SITE` once the county approval comes through. Box sizes, prices and the pickup note live there too. |
| **Brand colors** | `css/styles.css`, at the top in `:root` (`--pink`, `--cocoa`, `--butter`, …) |
| **Logo** | `assets/images/logo/`: trimmed copies of the official logos used in the header and footer |
| **Flavors** (names, nicknames, blurbs, photos, alt text) | `js/flavors.js`. All 11 approved items are listed. Set `available: false` to hide one without deleting it, or `photoPos` to adjust a photo's crop. |
| **Box sizes & prices** | `js/flavors.js`, `window.SITE.boxes` (fills the "Three Levels of Temptation" section and the form) |
| **Story text** | `index.html`, the `#story` section (approved copy from Oct 19) |
| **Business email** | `index.html`, order section `contact-list` and footer (marked `EDIT`) |
| **Inquiry form** | Create a form at [formspree.io](https://formspree.io), then replace `YOUR_FORM_ID` in **both** the `action` and `data-endpoint` attributes of `#inquiry-form` |

Until a Formspree ID is added, the form runs in **demo mode**. It shows the success screen with a yellow "demo mode" note and sends nothing.

## Hosting

Upload the folder to Netlify, Vercel, Cloudflare Pages or GitHub Pages. No build settings are needed.

**Don't deploy `10.19Update/`.** It's the client's raw photo package and copy PDF (git-ignored). Move it out of the folder or exclude it before uploading.

## Later: online ordering

The "Add to inquiry" buttons already collect a basket of flavors (see `selected` in `js/main.js`). That is the natural hook for a cart once she is licensed. Options include Square Online, Shopify Buy Button, or Stripe Payment Links per box size.

## Accessibility & motion

- Respects `prefers-reduced-motion`: no preloader, smooth scroll or scroll effects.
- Every photo has descriptive alt text (set in `js/flavors.js` for the menu).
