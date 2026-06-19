# BaigEssence — Premium Perfume E-Commerce

A fast, mobile-responsive perfume e-commerce website with an admin dashboard for product and promotion management.

## Features

### Storefront
- Premium luxury design inspired by top Pakistani fragrance brands
- Three categories: **For Him**, **For Her**, and **Unisex**
- Product listing with filters and sorting
- Product detail pages with fragrance notes
- Shopping cart with persistent storage
- Promotional banners and sale badges
- Mobile-responsive with hover effects
- Free shipping banner (orders above Rs. 3,000)

### Admin Dashboard (`/admin`)
- Secure password-protected login
- **Products**: Add, edit, and delete fragrances
- **Promotions**: Create percentage or fixed discounts on selected products
- Dashboard with store statistics

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the store.

### Admin Access

1. Go to [http://localhost:3000/admin](http://localhost:3000/admin)
2. Default password: `baigessence2026`

Change the password in `.env.local`:

```
ADMIN_PASSWORD=your-secure-password
ADMIN_SECRET=your-random-secret-key
```

## Tech Stack

- **Next.js 16** (App Router, Server Components)
- **TypeScript**
- **Tailwind CSS 4**
- **Supabase** (PostgreSQL) for products & promotions

## Supabase Setup

1. **Run the database schema** in [Supabase SQL Editor](https://supabase.com/dashboard/project/srtqswnhdzwrkmsayxvf/sql/new):
   - Copy and run `supabase/migrations/001_initial_schema.sql`

2. **Add your secret key** to `.env.local` (Dashboard → Settings → API → `secret` key):
   ```
   SUPABASE_SECRET_KEY=your-secret-key
   ```

3. **Seed sample products**:
   ```bash
   npm run db:seed
   ```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable (public) key |
| `SUPABASE_SECRET_KEY` | Secret key — **server only**, for admin CRUD |
| `ADMIN_PASSWORD` | Admin dashboard password |
| `ADMIN_SECRET` | Session signing secret |

## Project Structure

```
src/
  app/
    (store)/          # Storefront pages
    admin/            # Admin dashboard
    api/              # REST API routes
  components/         # UI components
  lib/
    supabase/         # Supabase client & mappers
    db.ts             # Data access layer
supabase/
  migrations/         # SQL schema
data/                 # Sample seed data (for db:seed)
```

## Deployment

Set these environment variables in Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`
- `ADMIN_PASSWORD`
- `ADMIN_SECRET`

```bash
npm run build
```

## License

Private — BaigEssence © 2026
