import type {
  Category,
  Product,
  Promotion,
  PromoCode,
  Order,
  OrderItem,
  OrderPaymentStatus,
  OrderFulfillmentStatus,
} from "@/lib/types";

export type ProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  category: Category;
  price: number;
  compare_at_price: number | null;
  image: string;
  images: string[];
  notes: { top: string; heart: string; base: string };
  size: string;
  concentration: string;
  in_stock: boolean;
  featured: boolean;
  promotion_id: string | null;
  created_at: string;
  updated_at: string;
};

export type PromotionRow = {
  id: string;
  name: string;
  description: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  product_ids: string[];
  start_date: string;
  end_date: string;
  active: boolean;
  badge: string | null;
};

export type OrderRow = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  shipping_city: string;
  items: OrderItem[];
  subtotal: number;
  discount: number | null;
  shipping: number;
  total: number;
  promo_code: string | null;
  payment_method: string;
  payment_status: OrderPaymentStatus;
  fulfillment_status: OrderFulfillmentStatus | null;
  tracking_note: string | null;
  safepay_tracker: string | null;
  created_at: string;
  updated_at: string;
};

export type PromoCodeRow = {
  id: string;
  code: string;
  percent_off: number;
  description: string;
  active: boolean;
  expires_at: string | null;
  max_redemptions: number | null;
  redemption_count: number;
  created_at: string;
  updated_at: string;
};

export function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    shortDescription: row.short_description,
    category: row.category,
    price: row.price,
    compareAtPrice: row.compare_at_price ?? undefined,
    image: row.image,
    images: row.images ?? [],
    notes: row.notes ?? { top: "", heart: "", base: "" },
    size: row.size,
    concentration: row.concentration,
    inStock: row.in_stock,
    featured: row.featured,
    promotionId: row.promotion_id ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function rowToOrder(row: OrderRow): Order {
  return {
    id: row.id,
    orderNumber: row.order_number,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    shippingAddress: row.shipping_address,
    shippingCity: row.shipping_city,
    items: row.items ?? [],
    subtotal: row.subtotal,
    discount: row.discount ?? 0,
    shipping: row.shipping,
    total: row.total,
    promoCode: row.promo_code ?? undefined,
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    fulfillmentStatus: row.fulfillment_status ?? "placed",
    trackingNote: row.tracking_note ?? undefined,
    safepayTracker: row.safepay_tracker ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function rowToPromoCode(row: PromoCodeRow): PromoCode {
  return {
    id: row.id,
    code: row.code,
    percentOff: row.percent_off,
    description: row.description ?? "",
    active: row.active,
    expiresAt: row.expires_at ?? undefined,
    maxRedemptions: row.max_redemptions ?? undefined,
    redemptionCount: row.redemption_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function promoCodeToInsert(
  data: Omit<PromoCode, "id" | "redemptionCount" | "createdAt" | "updatedAt">
) {
  return {
    code: data.code.trim().toUpperCase(),
    percent_off: data.percentOff,
    description: data.description ?? "",
    active: data.active,
    expires_at: data.expiresAt ?? null,
    max_redemptions: data.maxRedemptions ?? null,
  };
}

export function promoCodeToUpdate(
  data: Partial<Omit<PromoCode, "id" | "redemptionCount" | "createdAt" | "updatedAt">>
) {
  const row: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (data.code !== undefined) row.code = data.code.trim().toUpperCase();
  if (data.percentOff !== undefined) row.percent_off = data.percentOff;
  if (data.description !== undefined) row.description = data.description;
  if (data.active !== undefined) row.active = data.active;
  if (data.expiresAt !== undefined) row.expires_at = data.expiresAt || null;
  if (data.maxRedemptions !== undefined) {
    row.max_redemptions = data.maxRedemptions ?? null;
  }
  return row;
}

export function rowToPromotion(row: PromotionRow): Promotion {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    discountType: row.discount_type,
    discountValue: row.discount_value,
    productIds: row.product_ids ?? [],
    startDate: row.start_date,
    endDate: row.end_date,
    active: row.active,
    badge: row.badge ?? undefined,
  };
}

export function productToInsert(
  data: Omit<Product, "id" | "slug" | "createdAt" | "updatedAt"> & {
    slug: string;
  }
) {
  return {
    name: data.name,
    slug: data.slug,
    description: data.description,
    short_description: data.shortDescription,
    category: data.category,
    price: data.price,
    compare_at_price: data.compareAtPrice ?? null,
    image: data.image,
    images: data.images,
    notes: data.notes,
    size: data.size,
    concentration: data.concentration,
    in_stock: data.inStock,
    featured: data.featured,
    promotion_id: data.promotionId ?? null,
  };
}

export function productToUpdate(
  data: Partial<Omit<Product, "id" | "createdAt">>
) {
  const row: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (data.name !== undefined) row.name = data.name;
  if (data.slug !== undefined) row.slug = data.slug;
  if (data.description !== undefined) row.description = data.description;
  if (data.shortDescription !== undefined) row.short_description = data.shortDescription;
  if (data.category !== undefined) row.category = data.category;
  if (data.price !== undefined) row.price = data.price;
  if (data.compareAtPrice !== undefined) row.compare_at_price = data.compareAtPrice;
  if (data.image !== undefined) row.image = data.image;
  if (data.images !== undefined) row.images = data.images;
  if (data.notes !== undefined) row.notes = data.notes;
  if (data.size !== undefined) row.size = data.size;
  if (data.concentration !== undefined) row.concentration = data.concentration;
  if (data.inStock !== undefined) row.in_stock = data.inStock;
  if (data.featured !== undefined) row.featured = data.featured;
  if (data.promotionId !== undefined) row.promotion_id = data.promotionId;

  return row;
}

export function promotionToInsert(data: Omit<Promotion, "id">) {
  return {
    name: data.name,
    description: data.description,
    discount_type: data.discountType,
    discount_value: data.discountValue,
    product_ids: data.productIds,
    start_date: data.startDate,
    end_date: data.endDate,
    active: data.active,
    badge: data.badge ?? null,
  };
}

export function promotionToUpdate(data: Partial<Omit<Promotion, "id">>) {
  const row: Record<string, unknown> = {};

  if (data.name !== undefined) row.name = data.name;
  if (data.description !== undefined) row.description = data.description;
  if (data.discountType !== undefined) row.discount_type = data.discountType;
  if (data.discountValue !== undefined) row.discount_value = data.discountValue;
  if (data.productIds !== undefined) row.product_ids = data.productIds;
  if (data.startDate !== undefined) row.start_date = data.startDate;
  if (data.endDate !== undefined) row.end_date = data.endDate;
  if (data.active !== undefined) row.active = data.active;
  if (data.badge !== undefined) row.badge = data.badge;

  return row;
}
