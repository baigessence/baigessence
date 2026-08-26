import {
  getProductById,
  getPromotionForProduct,
  getPromoCodeByCode,
  isPromoCodeCurrentlyValid,
  normalizePromoCode,
} from "@/lib/db";
import type { OrderItem, PromoCode } from "@/lib/types";
import {
  calculateShipping,
  getDiscountedPrice,
} from "@/lib/utils";

export type CheckoutLineInput = {
  productId: string;
  quantity: number;
};

export type CheckoutPricing = {
  lines: OrderItem[];
  /** Sum of line prices before promo code */
  subtotal: number;
  /** Amount subtracted by promo code */
  discount: number;
  shipping: number;
  total: number;
  promoCode?: string;
  percentOff?: number;
};

export async function buildCheckoutLines(
  items: CheckoutLineInput[],
  promoCodeInput?: string | null
): Promise<CheckoutPricing> {
  if (!items.length) {
    throw new Error("Your cart is empty");
  }

  const lines: OrderItem[] = [];
  let subtotal = 0;

  for (const item of items) {
    if (item.quantity < 1) continue;

    const product = await getProductById(item.productId);
    if (!product) {
      throw new Error("A product in your cart is no longer available");
    }
    if (!product.inStock) {
      throw new Error(`${product.name} is out of stock`);
    }

    const promotion = await getPromotionForProduct(product.id);
    const { price } = getDiscountedPrice(product, promotion);
    const lineTotal = price * item.quantity;
    subtotal += lineTotal;

    lines.push({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price,
      quantity: item.quantity,
      image: product.image,
      size: product.size,
    });
  }

  if (!lines.length) {
    throw new Error("Your cart is empty");
  }

  let discount = 0;
  let appliedCode: string | undefined;
  let percentOff: number | undefined;
  let promo: PromoCode | undefined;

  const rawCode = promoCodeInput?.trim();
  if (rawCode) {
    promo = await getPromoCodeByCode(rawCode);
    if (!promo || !isPromoCodeCurrentlyValid(promo)) {
      throw new Error("Invalid or expired promo code");
    }
    percentOff = promo.percentOff;
    discount = Math.round(subtotal * (percentOff / 100));
    discount = Math.min(discount, subtotal);
    appliedCode = normalizePromoCode(rawCode);

    // Reduce line prices proportionally so order items reflect the discount
    if (subtotal > 0 && discount > 0) {
      let allocated = 0;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineSubtotal = line.price * line.quantity;
        const share =
          i === lines.length - 1
            ? discount - allocated
            : Math.round((lineSubtotal / subtotal) * discount);
        allocated += share;
        const newLineTotal = Math.max(0, lineSubtotal - share);
        line.price = Math.round(newLineTotal / line.quantity);
      }
    }
  }

  const discountedSubtotal = Math.max(0, subtotal - discount);
  const shipping = calculateShipping(discountedSubtotal);
  const total = discountedSubtotal + shipping;

  return {
    lines,
    subtotal,
    discount,
    shipping,
    total,
    promoCode: appliedCode,
    percentOff,
  };
}
