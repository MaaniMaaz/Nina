# CMS setup (run after freeing disk space)

## 1. Install deps
```bash
cd E:\Flogen\nina
npm install
```

Required packages (already listed in package.json): `mongodb`, `jose`, `cloudinary`, `tsx`.

## 2. Env
Copy `.env.example` → `.env.local` and fill:
- `MONGODB_URI`, `MONGODB_DB`
- `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` (16+ chars)
- Cloudinary keys (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`)

## 3. Seed existing pages into Mongo
```bash
npm run seed
```

## 4. Dev
```bash
npm run dev
```
- Public site: http://localhost:3000 (falls back to TS content if Mongo empty)
- Admin: http://localhost:3000/nina/admin

## What's editable in `/nina/admin`
- **Conditions / Treatments**: hero + every block's text (inline pencil ✎ or the sidebar
  "All text fields" list) and every image slot (hover an image → **Upload** → Cloudinary).
- **Button & link URLs**: primary hero button destination (`ctaHref`), secondary link,
  breadcrumb parent, card links, and condition explorer CTAs — edit inline with 🔗 or in
  the sidebar **"Button & link URLs"** panel.
- **Blogs**: title, dek, and section text edit in place; cover and section images upload to
  Cloudinary; format / category / read-time / date / cover alt in the sidebar panel.
- **SEO**: meta title, meta description, and slug per page (slug defaults from the title under
  the correct `/conditions|/treatments|/blog` prefix; uniqueness enforced per type).
- **Preview**: Desktop / Mobile frames render the saved draft at `?preview=1` (admin-only).
- Public routes (`/conditions`, `/treatments`, `/blog`, and their detail + topic pages) serve
  **published** MongoDB content and revalidate on save/publish; they fall back to the bundled
  TypeScript content until the seed runs.
