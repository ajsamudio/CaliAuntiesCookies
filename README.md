# Cali Aunties Cookies: website

A one-page site for Cali Aunties Cookies. Plain HTML, CSS and JavaScript with no build step.

- **3D hero cookie**: built in code with Three.js. Visitors can drag it to spin it or tap it to "boop" it.
- **Scroll animations**: GSAP + ScrollTrigger, with Lenis for smooth scrolling.
- **Preorder request form**: box of 6 (one flavor) or 12 (up to two flavors), name, contact and pickup date. Posts to Formspree (free tier). Hidden behind an "Online Preorders Coming Soon" panel until `preordersOpen` is turned on.

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
| **Logo** | `index.html`: replace the `<a class="logo">` contents with `<img src="assets/logo.png" alt="Cali Aunties Cookies" height="52">` (header and footer) |
| **Flavors** (names, blurbs, tags) | `js/flavors.js`. Set `available: false` to hide a flavor without deleting it. Only 5 of the 11 approved items are listed so far; add the rest here. |
| **Flavor photos** | Put photos in `assets/images/flavors/` and set `photo: "assets/images/flavors/og-auntie.jpg"` on that flavor in `js/flavors.js` |
| **Story text** | `index.html`, the `#story` section (marked `EDIT`) |
| **Story photos** | `index.html`: swap each `.polaroid__img` placeholder for an `<img class="polaroid__photo" …>` |
| **Business email** | `index.html`, order section `contact-list` and footer (marked `EDIT`) |
| **Inquiry form** | Create a form at [formspree.io](https://formspree.io), then replace `YOUR_FORM_ID` in **both** the `action` and `data-endpoint` attributes of `#inquiry-form` |

Until a Formspree ID is added, the form runs in **demo mode**. It shows the success screen with a yellow "demo mode" note and sends nothing.

## Hosting

Upload the folder as-is to Netlify, Vercel, Cloudflare Pages or GitHub Pages. No build settings are needed.

## Later: online ordering

The "Add to inquiry" buttons already collect a basket of flavors (see `selected` in `js/main.js`). That is the natural hook for a cart once she is licensed. Options include Square Online, Shopify Buy Button, or Stripe Payment Links per box size.

## Accessibility & motion

- Respects `prefers-reduced-motion`: no preloader, smooth scroll or scroll effects, and the cookie stops auto-spinning.
- If WebGL isn't available, the 3D cookie falls back to an illustrated cookie.
