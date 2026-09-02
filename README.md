# Nina Ross Functional Medicine — Next.js site

Production marketing site + CMS for [Nina Ross Functional Medicine](https://www.ninarossfm.com).

## Stack

- Next.js App Router + TypeScript + Tailwind
- MongoDB CMS (`/nina/admin`)
- Cloudinary uploads
- Acuity booking embeds on `/start`
- Hosting: **Hostinger** (already live)


## Local

```bash
cp .env.example .env.local
# fill Mongo / admin / Cloudinary
npm install
npm run dev
```

- Site: http://localhost:3000  
- Admin: http://localhost:3000/nina/admin  

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run build` | Production Next build (standalone) |
| `npm start` | Run standalone server |
| `npm run qa:typecheck` | TypeScript check |
| `npm run seed` | Seed CMS pages |

See `QA-CHECKLIST.md`.

## Scope status

| Item | Status |
|------|--------|
| Next.js page templates | Done (shared longform / journal / home / booking / legal) |
| Unified nav / footer / buttons | Done |
| Responsive | Done (phone / tablet / desktop patterns) |
| Image optimization + lazy load | Done (`SmartImage`, AVIF/WebP, Cloudinary optimized) |
| Sitemap + robots.txt + 404 | Done |
| Forms + Acuity CTAs | Done (`/search`, `/about#contact`, Acuity on `/start`) |
| GitHub | Client repo |
| Hostinger deploy | Done (live) |
| QA | `QA-CHECKLIST.md` |
