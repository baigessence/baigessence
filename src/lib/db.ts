import type { Product, Promotion, Order, OrderItem } from "./types";
import { slugify } from "./utils";
import { createAdminClient, createPublicClient } from "./supabase/server";
import {
  rowToProduct,
  rowToPromotion,
  rowToOrder,
  productToInsert,
  productToUpdate,
  promotionToInsert,
  promotionToUpdate,
  type ProductRow,
  type PromotionRow,
  type OrderRow,
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

export async function getBestSellerProducts(limit = 4): Promise<Product[]> {
  const featured = await getFeaturedProducts();

  if (featured.length >= limit) {
    return featured.slice(0, limit);
  }

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit + featured.length);

  if (error) throw error;

  const recent = (data as ProductRow[]).map(rowToProduct);
  const featuredIds = new Set(featured.map((product) => product.id));
  const merged = [...featured];

  for (const product of recent) {
    if (merged.length >= limit) break;
    if (!featuredIds.has(product.id)) {
      merged.push(product);
    }
  }

  return merged;
}

export async function getOtherProducts(
  excludeIds: string[],
  limit = 4
): Promise<Product[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  const exclude = new Set(excludeIds);
  return (data as ProductRow[])
    .map(rowToProduct)
    .filter((product) => !exclude.has(product.id))
    .slice(0, limit);
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

function generateOrderNumber(): string {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `BE-${y}${m}${d}-${rand}`;
}

type CreateOrderInput = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  safepayTracker?: string;
  paymentMethod?: string;
};

export async function createOrder(data: CreateOrderInput): Promise<Order> {
  const supabase = createAdminClient();

  const { data: row, error } = await supabase
    .from("orders")
    .insert({
      order_number: generateOrderNumber(),
      customer_name: data.customerName,
      customer_email: data.customerEmail,
      customer_phone: data.customerPhone,
      shipping_address: data.shippingAddress,
      shipping_city: data.shippingCity,
      items: data.items,
      subtotal: data.subtotal,
      shipping: data.shipping,
      total: data.total,
      payment_method: data.paymentMethod ?? "payfast",
      payment_status: "pending",
      safepay_tracker: data.safepayTracker ?? null,
    })
    .select("*")
    .single();

  if (error) throw error;
  return rowToOrder(row as OrderRow);
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? rowToOrder(data as OrderRow) : undefined;
}

export async function getOrderByTracker(
  tracker: string
): Promise<Order | undefined> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("safepay_tracker", tracker)
    .maybeSingle();

  if (error) throw error;
  return data ? rowToOrder(data as OrderRow) : undefined;
}

export async function getOrderByOrderNumber(
  orderNumber: string
): Promise<Order | undefined> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (error) throw error;
  return data ? rowToOrder(data as OrderRow) : undefined;
}

export async function updateOrderPaymentStatus(
  id: string,
  paymentStatus: Order["paymentStatus"],
  safepayTracker?: string
): Promise<Order | null> {
  const supabase = createAdminClient();
  const payload: Record<string, unknown> = {
    payment_status: paymentStatus,
    updated_at: new Date().toISOString(),
  };

  if (safepayTracker) {
    payload.safepay_tracker = safepayTracker;
  }

  const { data, error } = await supabase
    .from("orders")
    .update(payload)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) throw error;
  return data ? rowToOrder(data as OrderRow) : null;
}
