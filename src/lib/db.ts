import type { Product, Promotion } from "./types";
import { slugify } from "./utils";
import { createAdminClient, createPublicClient } from "./supabase/server";
import {
  rowToProduct,
  rowToPromotion,
  productToInsert,
  productToUpdate,
  promotionToInsert,
  promotionToUpdate,
  type ProductRow,
  type PromotionRow,
} from "./supabase/mappers";

// Products
export async function getProducts(): Promise<Product[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as ProductRow[]).map(rowToProduct);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? rowToProduct(data as ProductRow) : undefined;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data ? rowToProduct(data as ProductRow) : undefined;
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", category)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as ProductRow[]).map(rowToProduct);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as ProductRow[]).map(rowToProduct);
}

export async function createProduct(
  data: Omit<Product, "id" | "slug" | "createdAt" | "updatedAt">
): Promise<Product> {
  const supabase = createAdminClient();
  const slug = slugify(data.name);

  const { data: row, error } = await supabase
    .from("products")
    .insert(productToInsert({ ...data, slug }))
    .select("*")
    .single();

  if (error) throw error;
  return rowToProduct(row as ProductRow);
}

export async function updateProduct(
  id: string,
  data: Partial<Omit<Product, "id" | "createdAt">>
): Promise<Product | null> {
  const supabase = createAdminClient();
  const payload = productToUpdate(data);

  if (data.name) {
    payload.slug = slugify(data.name);
  }

  const { data: row, error } = await supabase
    .from("products")
    .update(payload)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) throw error;
  return row ? rowToProduct(row as ProductRow) : null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const supabase = createAdminClient();

  const { data: promotions } = await supabase.from("promotions").select("*");
  if (promotions) {
    for (const promo of promotions as PromotionRow[]) {
      if (promo.product_ids?.includes(id)) {
        await supabase
          .from("promotions")
          .update({
            product_ids: promo.product_ids.filter((pid) => pid !== id),
          })
          .eq("id", promo.id);
      }
    }
  }

  const { error, count } = await supabase
    .from("products")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error) throw error;
  return (count ?? 0) > 0;
}

// Promotions
export async function getPromotions(): Promise<Promotion[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("promotions")
    .select("*")
    .order("start_date", { ascending: false });

  if (error) throw error;
  return (data as PromotionRow[]).map(rowToPromotion);
}

export async function getPromotionById(id: string): Promise<Promotion | undefined> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("promotions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? rowToPromotion(data as PromotionRow) : undefined;
}

export async function getActivePromotions(): Promise<Promotion[]> {
  const supabase = createPublicClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("promotions")
    .select("*")
    .eq("active", true)
    .lte("start_date", now)
    .gte("end_date", now);

  if (error) throw error;
  return (data as PromotionRow[]).map(rowToPromotion);
}

export async function getPromotionForProduct(
  productId: string
): Promise<Promotion | undefined> {
  const promotions = await getActivePromotions();
  return promotions.find((p) => p.productIds.includes(productId));
}

export async function createPromotion(
  data: Omit<Promotion, "id">
): Promise<Promotion> {
  const supabase = createAdminClient();

  const { data: row, error } = await supabase
    .from("promotions")
    .insert(promotionToInsert(data))
    .select("*")
    .single();

  if (error) throw error;
  return rowToPromotion(row as PromotionRow);
}

export async function updatePromotion(
  id: string,
  data: Partial<Omit<Promotion, "id">>
): Promise<Promotion | null> {
  const supabase = createAdminClient();

  const { data: row, error } = await supabase
    .from("promotions")
    .update(promotionToUpdate(data))
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) throw error;
  return row ? rowToPromotion(row as PromotionRow) : null;
}

export async function deletePromotion(id: string): Promise<boolean> {
  const supabase = createAdminClient();

  const { error, count } = await supabase
    .from("promotions")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error) throw error;
  return (count ?? 0) > 0;
}
