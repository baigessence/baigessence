import {
  getProductById,
  getPromotionForProduct,
} from "@/lib/db";
import type { OrderItem } from "@/lib/types";
import {
  calculateOrderTotal,
  calculateShipping,
  getDiscountedPrice,
} from "@/lib/utils";

export type CheckoutLineInput = {
  productId: string;
  quantity: number;
};

export async function buildCheckoutLines(items: CheckoutLineInput[]) {
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

  const shipping = calculateShipping(subtotal);
  const total = calculateOrderTotal(subtotal);

  return { lines, subtotal, shipping, total };
}
