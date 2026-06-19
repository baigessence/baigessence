/**
 * Seed BaigEssence sample data into Supabase.
 * Run: npm run db:seed
 *
 * Requires:
 * - Schema applied (supabase/migrations/001_initial_schema.sql)
 * - SUPABASE_SECRET_KEY in .env.local
 */

import { readFileSync } from "fs";
import { resolve } from "path";
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: resolve(process.cwd(), ".env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey =
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !secretKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in .env.local"
  );
  process.exit(1);
}

const supabase = createClient(url, secretKey, {
  auth: { persistSession: false },
});

type JsonProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  images: string[];
  notes: { top: string; heart: string; base: string };
  size: string;
  concentration: string;
  inStock: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
};

type JsonPromotion = {
  id: string;
  name: string;
  description: string;
  discountType: string;
  discountValue: number;
  productIds: string[];
  startDate: string;
  endDate: string;
  active: boolean;
  badge?: string;
};

async function seed() {
  const products: JsonProduct[] = JSON.parse(
    readFileSync(resolve(process.cwd(), "data/products.json"), "utf-8")
  );
  const promotions: JsonPromotion[] = JSON.parse(
    readFileSync(resolve(process.cwd(), "data/promotions.json"), "utf-8")
  );

  console.log("Clearing existing data...");
  await supabase.from("promotions").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("products").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  console.log(`Seeding ${products.length} products...`);
  const productRows = products.map((p) => ({
    name: p.name,
    slug: p.slug,
    description: p.description,
    short_description: p.shortDescription,
    category: p.category,
    price: p.price,
    compare_at_price: p.compareAtPrice ?? null,
    image: p.image,
    images: p.images,
    notes: p.notes,
    size: p.size,
    concentration: p.concentration,
    in_stock: p.inStock,
    featured: p.featured,
    created_at: p.createdAt,
    updated_at: p.updatedAt,
  }));

  const { data: insertedProducts, error: productsError } = await supabase
    .from("products")
    .insert(productRows)
    .select("id, slug");

  if (productsError) {
    console.error("Products seed failed:", productsError.message);
    process.exit(1);
  }

  const slugToId = new Map(
    insertedProducts?.map((p) => [p.slug, p.id]) ?? []
  );
  const oldIdToNewId = new Map(
    products.map((p) => [p.id, slugToId.get(p.slug)!])
  );

  console.log(`Seeding ${promotions.length} promotions...`);
  const promoRows = promotions.map((promo) => ({
    name: promo.name,
    description: promo.description,
    discount_type: promo.discountType,
    discount_value: promo.discountValue,
    product_ids: promo.productIds
      .map((oldId) => oldIdToNewId.get(oldId))
      .filter(Boolean),
    start_date: promo.startDate,
    end_date: promo.endDate,
    active: promo.active,
    badge: promo.badge ?? null,
  }));

  const { error: promosError } = await supabase
    .from("promotions")
    .insert(promoRows);

  if (promosError) {
    console.error("Promotions seed failed:", promosError.message);
    process.exit(1);
  }

  console.log("Seed complete!");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
