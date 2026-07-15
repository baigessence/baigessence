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
| `NEXT_PUBLIC_SITE_URL` | Your site URL |
| `RESEND_API_KEY` | Resend API key for order emails |
| `EMAIL_FROM` | Optional sender (e.g. `Baig Essence <orders@yourdomain.com>`) |
| `ORDER_NOTIFY_EMAIL` | Admin inbox for new order alerts |

### Cash on Delivery Checkout

1. Run `supabase/migrations/003_orders.sql` in Supabase SQL Editor
2. Add Resend keys to `.env.local` (from [Resend](https://resend.com))
3. Checkout flow: Cart → `/checkout` → Place COD order → confirmation email to customer + admin
4. View orders in Admin → **Orders** (`/admin/orders`)

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

## Deployment (Vercel)

### 1. Import from GitHub
- Repository: `baigessence/baigessence`
- **Framework Preset:** Next.js
- **Root Directory:** leave empty (project root)
- **Build Command:** `npm run build`
- **Output Directory:** leave **empty** (do not set `.next` or `out`)

### 2. Environment variables
Add these in Vercel → Project → Settings → Environment Variables (Production + Preview):

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key |
| `SUPABASE_SECRET_KEY` | Supabase secret key (server only) |
| `ADMIN_PASSWORD` | Admin dashboard password |
| `ADMIN_SECRET` | Random session secret |

### 3. Deploy
After saving env vars, go to **Deployments** → **Redeploy** (use “Redeploy with existing Build Cache” unchecked).

### If you see `404: NOT_FOUND` (Vercel white error page)
Usually means the deployment did not build correctly or project settings are wrong:

1. Open **Deployments** → latest deployment → check **Build Logs** for errors
2. Confirm **Output Directory** is empty (most common fix)
3. Confirm all 5 env vars above are set
4. Confirm **Production Branch** is `main`
5. Redeploy after fixing settings

```bash
npm run build
```

## License

Private — BaigEssence © 2026
