import { cache } from "react";
import { unstable_cache, revalidateTag } from "next/cache";
import type { Product, Promotion } from "@/lib/types";
import { createPublicClient } from "@/lib/supabase/server";
import {
  rowToProduct,
  rowToPromotion,
  type ProductRow,
  type PromotionRow,
} from "@/lib/supabase/mappers";

export const CATALOG_TAG = "catalog";
const CATALOG_REVALIDATE_SECONDS = 120;

async function loadAllProducts(): Promise<Product[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as ProductRow[]).map(rowToProduct);
}

async function loadAllPromotions(): Promise<Promotion[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("promotions")
    .select("*")
    .order("start_date", { ascending: false });

  if (error) throw error;
  return (data as PromotionRow[]).map(rowToPromotion);
}

const getCachedProducts = unstable_cache(loadAllProducts, ["catalog-products"], {
  revalidate: CATALOG_REVALIDATE_SECONDS,
  tags: [CATALOG_TAG],
});

const getCachedPromotions = unstable_cache(
  loadAllPromotions,
  ["catalog-promotions"],
  {
    revalidate: CATALOG_REVALIDATE_SECONDS,
    tags: [CATALOG_TAG],
  }
);

/** One Supabase product fetch per cache window; deduped within a request. */
export const getProducts = cache(async (): Promise<Product[]> => {
  return getCachedProducts();
});

export const getProductById = cache(
  async (id: string): Promise<Product | undefined> => {
    const products = await getProducts();
    return products.find((p) => p.id === id);
  }
);

export const getProductBySlug = cache(
  async (slug: string): Promise<Product | undefined> => {
    const products = await getProducts();
    return products.find((p) => p.slug === slug);
  }
);

export const getProductsByCategory = cache(
  async (category: string): Promise<Product[]> => {
    const products = await getProducts();
    return products.filter((p) => p.category === category);
  }
);

export const getFeaturedProducts = cache(async (): Promise<Product[]> => {
  const products = await getProducts();
  return products.filter((p) => p.featured);
});

export const getBestSellerProducts = cache(
  async (limit = 4): Promise<Product[]> => {
    const products = await getProducts();
    const featured = products.filter((p) => p.featured);
    if (featured.length >= limit) return featured.slice(0, limit);

    const featuredIds = new Set(featured.map((p) => p.id));
    const merged = [...featured];
    for (const product of products) {
      if (merged.length >= limit) break;
      if (!featuredIds.has(product.id)) merged.push(product);
    }
    return merged;
  }
);

export const getOtherProducts = cache(
  async (excludeIds: string[], limit = 4): Promise<Product[]> => {
    const products = await getProducts();
    const exclude = new Set(excludeIds);
    return products.filter((p) => !exclude.has(p.id)).slice(0, limit);
  }
);

export const getRelatedProducts = cache(
  async (
    category: string,
    excludeId: string,
    limit = 4
  ): Promise<Product[]> => {
    const products = await getProductsByCategory(category);
    return products.filter((p) => p.id !== excludeId).slice(0, limit);
  }
);

export const getPromotions = cache(async (): Promise<Promotion[]> => {
  return getCachedPromotions();
});

export const getPromotionById = cache(
  async (id: string): Promise<Promotion | undefined> => {
    const promotions = await getPromotions();
    return promotions.find((p) => p.id === id);
  }
);

export const getActivePromotions = cache(async (): Promise<Promotion[]> => {
  const now = Date.now();
  const promotions = await getPromotions();
  return promotions.filter((p) => {
    if (!p.active) return false;
    const start = new Date(p.startDate).getTime();
    const end = new Date(p.endDate).getTime();
    return start <= now && end >= now;
  });
});

export const getPromotionForProduct = cache(
  async (productId: string): Promise<Promotion | undefined> => {
    const promotions = await getActivePromotions();
    return promotions.find((p) => p.productIds.includes(productId));
  }
);

export function revalidateCatalog() {
  revalidateTag(CATALOG_TAG, "max");
}
