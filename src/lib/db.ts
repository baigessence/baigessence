import type { Product, Promotion, PromoCode, Order, OrderItem } from "./types";
import { slugify } from "./utils";
import { createAdminClient } from "./supabase/server";
import { revalidateCatalog } from "./catalog";
import {
  rowToProduct,
  rowToPromotion,
  rowToOrder,
  rowToPromoCode,
  productToInsert,
  productToUpdate,
  promotionToInsert,
  promotionToUpdate,
  promoCodeToInsert,
  promoCodeToUpdate,
  type ProductRow,
  type PromotionRow,
  type OrderRow,
  type PromoCodeRow,
} from "./supabase/mappers";

// Cached catalog reads (one Supabase fetch per cache window)
export {
  getProducts,
  getProductById,
  getProductBySlug,
  getProductsByCategory,
  getFeaturedProducts,
  getBestSellerProducts,
  getOtherProducts,
  getRelatedProducts,
  getPromotions,
  getPromotionById,
  getActivePromotions,
  getPromotionForProduct,
  revalidateCatalog,
} from "./catalog";

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
  revalidateCatalog();
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
  if (row) revalidateCatalog();
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
  if ((count ?? 0) > 0) revalidateCatalog();
  return (count ?? 0) > 0;
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
  revalidateCatalog();
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
  if (row) revalidateCatalog();
  return row ? rowToPromotion(row as PromotionRow) : null;
}

export async function deletePromotion(id: string): Promise<boolean> {
  const supabase = createAdminClient();

  const { error, count } = await supabase
    .from("promotions")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error) throw error;
  if ((count ?? 0) > 0) revalidateCatalog();
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
  discount?: number;
  shipping: number;
  total: number;
  promoCode?: string;
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
      discount: data.discount ?? 0,
      shipping: data.shipping,
      total: data.total,
      promo_code: data.promoCode ?? null,
      payment_method: data.paymentMethod ?? "cod",
      payment_status: "pending",
      fulfillment_status: "placed",
      safepay_tracker: data.safepayTracker ?? null,
    })
    .select("*")
    .single();

  if (error) throw error;
  return rowToOrder(row as OrderRow);
}

export async function getOrders(limit = 100): Promise<Order[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []).map((row) => rowToOrder(row as OrderRow));
}

export async function deleteAllOrders(): Promise<number> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000")
    .select("id");

  if (error) throw error;
  return data?.length ?? 0;
}

export async function deleteOrderById(id: string): Promise<boolean> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) throw error;
  return !!data;
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

export async function updateOrderFulfillment(
  id: string,
  fulfillmentStatus: Order["fulfillmentStatus"],
  trackingNote?: string | null
): Promise<Order | null> {
  const supabase = createAdminClient();
  const payload: Record<string, unknown> = {
    fulfillment_status: fulfillmentStatus,
    updated_at: new Date().toISOString(),
  };

  if (trackingNote !== undefined) {
    payload.tracking_note = trackingNote?.trim() || null;
  }

  // When delivered, mark COD as paid
  if (fulfillmentStatus === "delivered") {
    payload.payment_status = "paid";
  }

  if (fulfillmentStatus === "cancelled") {
    payload.payment_status = "cancelled";
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

// Promo codes (checkout coupons)
export function normalizePromoCode(code: string): string {
  return code.trim().toUpperCase().replace(/\s+/g, "");
}

export function isPromoCodeCurrentlyValid(promo: PromoCode): boolean {
  if (!promo.active) return false;
  if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) return false;
  if (
    promo.maxRedemptions != null &&
    promo.redemptionCount >= promo.maxRedemptions
  ) {
    return false;
  }
  return true;
}

export async function getPromoCodes(): Promise<PromoCode[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("promo_codes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => rowToPromoCode(row as PromoCodeRow));
}

export async function getPromoCodeByCode(
  code: string
): Promise<PromoCode | undefined> {
  const supabase = createAdminClient();
  const normalized = normalizePromoCode(code);
  if (!normalized) return undefined;

  const { data, error } = await supabase
    .from("promo_codes")
    .select("*")
    .eq("code", normalized)
    .maybeSingle();

  if (error) throw error;
  return data ? rowToPromoCode(data as PromoCodeRow) : undefined;
}

export async function createPromoCode(
  data: Omit<PromoCode, "id" | "redemptionCount" | "createdAt" | "updatedAt">
): Promise<PromoCode> {
  const supabase = createAdminClient();
  const { data: row, error } = await supabase
    .from("promo_codes")
    .insert(promoCodeToInsert(data))
    .select("*")
    .single();

  if (error) throw error;
  return rowToPromoCode(row as PromoCodeRow);
}

export async function updatePromoCode(
  id: string,
  data: Partial<
    Omit<PromoCode, "id" | "redemptionCount" | "createdAt" | "updatedAt">
  >
): Promise<PromoCode | null> {
  const supabase = createAdminClient();
  const { data: row, error } = await supabase
    .from("promo_codes")
    .update(promoCodeToUpdate(data))
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) throw error;
  return row ? rowToPromoCode(row as PromoCodeRow) : null;
}

export async function deletePromoCode(id: string): Promise<boolean> {
  const supabase = createAdminClient();
  const { error, count } = await supabase
    .from("promo_codes")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error) throw error;
  return (count ?? 0) > 0;
}

export async function incrementPromoCodeRedemption(
  id: string
): Promise<void> {
  const supabase = createAdminClient();
  const existing = await supabase
    .from("promo_codes")
    .select("redemption_count")
    .eq("id", id)
    .maybeSingle();

  if (existing.error) throw existing.error;
  const current = (existing.data?.redemption_count as number | undefined) ?? 0;

  const { error } = await supabase
    .from("promo_codes")
    .update({
      redemption_count: current + 1,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
}
