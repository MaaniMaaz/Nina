# Handoff QA checklist

Run before calling the base scope complete.

## SEO / crawl

- [ ] `/sitemap.xml` lists home, hubs, conditions, treatments, positioning, journal, topics
- [ ] `/robots.txt` allows `/`, disallows `/nina/` and `/api/`, points at sitemap
- [ ] `/not-found` (visit a fake URL) — no dead `/book` or `/search` links
- [ ] `/book` redirects to `/start`
- [ ] `/patient-stories` lands on `/#patient-stories`

## Booking / forms

- [ ] `/start` — In-person and Virtual Acuity embeds load
- [ ] Longform pages show InlineBookingCTA doors
- [ ] `/search?q=pcos` returns condition + journal hits
- [ ] `/about#contact` form validates; with webhook delivers, without opens mailto

## Images / CWV

- [ ] Above-the-fold heroes use `priority`
- [ ] Below-fold images have `loading="lazy"` in DOM (`SmartImage`)
- [ ] Cloudinary URLs are optimized (not forced `unoptimized`)
- [ ] Lighthouse mobile: LCP / CLS smoke on `/`, `/conditions/pcos`, `/blog`

## Responsive

- [ ] Phone (~390), tablet (~768), desktop (~1280) on home, longform, journal, `/start`, admin edit canvas
- [ ] No horizontal overflow on home patient stories / toolkit

## Admin / CMS

- [ ] `/nina/admin` login, edit, save, publish
- [ ] Desktop/Mobile device frame in edit view

## Deploy

- [ ] Production build: `npm run build`
- [ ] Env vars present on host (Mongo, admin, Cloudinary, optional contact webhook)
- [ ] Live Hostinger deploy healthy
