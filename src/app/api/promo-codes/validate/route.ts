import { NextResponse } from "next/server";
import { buildCheckoutLines } from "@/lib/checkout";

type Body = {
  code?: string;
  items?: { productId: string; quantity: number }[];
};

/** Preview a promo code against the current cart (no order created). */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    const code = body.code?.trim();
    if (!code) {
      return NextResponse.json({ error: "Enter a promo code" }, { status: 400 });
    }
    if (!body.items?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const pricing = await buildCheckoutLines(body.items, code);
    return NextResponse.json({
      valid: true,
      code: pricing.promoCode,
      percentOff: pricing.percentOff,
      subtotal: pricing.subtotal,
      discount: pricing.discount,
      shipping: pricing.shipping,
      total: pricing.total,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid promo code";
    return NextResponse.json({ error: message, valid: false }, { status: 400 });
  }
}
