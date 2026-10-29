# Cali Aunties: website

A one-page site for Cali Aunties ("Happiness is Homemade."). Plain HTML, CSS and JavaScript with no build step.

- **Real photos**: the client's hero box photo, plus a photo for each of the 11 menu items (`assets/images/`).
- **Official logos**: header, footer and favicon use her Canva logos (`assets/images/logo/`).
- **Scroll animations**: GSAP + ScrollTrigger, with Lenis for smooth scrolling.
- **Preorder request form**: The Flirty 4-Pack ($18, one flavor), The Sweet 6-Pack ($26, one flavor) or The Party Dozen ($48, up to two flavors), plus how many boxes (each box adds to the flavor limit, with an estimated total), first and last name, phone, email and pickup date. Sent through a Vercel function (`api/preorder.js`) that emails her via Resend. Shown under the "Online Preorders Coming Soon" card while `preordersOpen` is on.

## Run it locally

Opening `index.html` directly works. For the most reliable preview, serve the folder:

```bash
python -m http.server 5173
```

Then open http://localhost:5173.

## Before launch: things to swap in

| What | Where |
|---|---|
| **Preorder form on/off** | `js/flavors.js`: `preordersOpen` in `window.SITE` (currently on). Box sizes, prices, `maxBoxes` and the pickup note live there too. |
| **Brand colors** | `css/styles.css`, at the top in `:root` (`--pink`, `--cocoa`, `--butter`, …) |
| **Logo** | `assets/images/logo/`: trimmed copies of the official logos used in the header and footer |
| **Flavors** (names, nicknames, blurbs, photos, alt text) | `js/flavors.js`. All 11 approved items are listed. Set `available: false` to hide one without deleting it, or `photoPos` to adjust a photo's crop. |
| **Box sizes & prices** | `js/flavors.js`, `window.SITE.boxes` (fills the "Three Levels of Temptation" section and the form) |
| **Story text** | `index.html`, the `#story` section (approved copy from Oct 19) |
| **Business email** | `hello@caliauntiescookies.com` (Porkbun forwards it to her Gmail) and `caliauntiescookies@gmail.com`, both listed in `index.html` (order section `contact-list` and footer "Say hi"). The form error messages in `js/main.js` use the Gmail address. |
| **Domain** | When `caliauntiescookies.com` is live, update `og:url` and `og:image` in `index.html` from the `vercel.app` address. |
| **Preorder emails** | `api/preorder.js` (Vercel serverless function). Set these in Vercel → Settings → Environment Variables, then redeploy: |

| Variable | Value |
|---|---|
| `RESEND_API_KEY` | Required. Until it's set, the form tells customers preorders aren't live yet and to DM or email instead. |
| `RESEND_FROM_EMAIL` | e.g. `Cali Aunties <orders@caliauntiescookies.com>`. Set it only after the domain is verified in Resend. Until then requests send from `onboarding@resend.dev`, which Resend only delivers to the Resend account's own email (so sign up for Resend with caliauntiescookies@gmail.com), and customer confirmations are skipped. |
| `ORDER_TO_EMAIL` | Optional. Where requests go. Defaults to caliauntiescookies@gmail.com. |

Each request emails her with Reply-To set to the customer. With `RESEND_FROM_EMAIL` set, the customer also gets a "we got your request" email. Nothing is charged online.

## Hosting

Hosted on Vercel (no build settings). The preorder form needs Vercel's `api/` functions, so moving to another host means porting `api/preorder.js`.

**Don't deploy `10.19Update/`.** It's the client's raw photo package and copy PDF (git-ignored). Move it out of the folder or exclude it before uploading.

## Later: online ordering

The "Add to inquiry" buttons already collect a basket of flavors (see `selected` in `js/main.js`). That is the natural hook for a cart once she is licensed. Options include Square Online, Shopify Buy Button, or Stripe Payment Links per box size.

## Accessibility & motion

- Respects `prefers-reduced-motion`: no preloader, smooth scroll or scroll effects.
- Every photo has descriptive alt text (set in `js/flavors.js` for the menu).
