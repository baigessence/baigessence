import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Product, Promotion } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return `Rs. ${price.toLocaleString("en-PK")}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    male: "For Him",
    female: "For Her",
    unisex: "Unisex",
  };
  return labels[category] ?? category;
}

export function getDiscountedPrice(
  product: Product,
  promotion?: Promotion | null
): { price: number; originalPrice: number; hasDiscount: boolean } {
  const originalPrice = product.compareAtPrice ?? product.price;
  let price = product.price;

  if (promotion?.active && isPromotionActive(promotion)) {
    if (promotion.productIds.includes(product.id)) {
      if (promotion.discountType === "percentage") {
        price = Math.round(product.price * (1 - promotion.discountValue / 100));
      } else {
        price = Math.max(0, product.price - promotion.discountValue);
      }
    }
  } else if (product.compareAtPrice && product.compareAtPrice > product.price) {
    return { price: product.price, originalPrice: product.compareAtPrice, hasDiscount: true };
  }

  const hasDiscount = price < originalPrice;
  return { price, originalPrice, hasDiscount };
}

export function isPromotionActive(promotion: Promotion): boolean {
  if (!promotion.active) return false;
  const now = new Date();
  const start = new Date(promotion.startDate);
  const end = new Date(promotion.endDate);
  return now >= start && now <= end;
}
