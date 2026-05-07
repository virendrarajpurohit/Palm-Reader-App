# PalmVeda AI

A mobile-first palm reading web app prototype designed for Chrome, Safari, and in-app browsers. It captures a palm photo in-browser, shows an animated AI/Vedic analysis flow, reveals a preview reading, and supports payment/referral lead capture placeholders for Cashfree and Supabase integration.

## Run locally

```bash
npm run dev
```

Open `http://localhost:4173`.

## Build for Render

```bash
npm run build
```

Deploy the generated `dist/` directory as a static site on Render, or use:

- **Build command:** `npm run build`
- **Publish directory:** `dist`

## Integration placeholders

- Cashfree checkout is intentionally stubbed in `src/main.js` until live gateway credentials and order APIs are provided.
- Supabase lead/referral persistence is modelled through `src/storage.js`; it currently uses `localStorage` and exposes a small repository interface that can be replaced with Supabase calls.
- The reading generator is entertainment-oriented and transparent by design. Replace `generatePalmReading` with an approved AI API call when keys, budget, and compliance requirements are ready.
