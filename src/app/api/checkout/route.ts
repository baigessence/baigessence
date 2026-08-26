import { NextResponse } from "next/server";
import { buildCheckoutLines } from "@/lib/checkout";
import {
  createOrder,
  getPromoCodeByCode,
  incrementPromoCodeRedemption,
} from "@/lib/db";
import { sendOrderEmails } from "@/lib/email";

type CheckoutBody = {
  items: { productId: string; quantity: number }[];
  promoCode?: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
  };
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutBody;

    if (!body.items?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const { firstName, lastName, email, phone, address, city } =
      body.customer ?? {};

    if (!firstName?.trim() || !lastName?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }
    if (!phone?.trim() || !address?.trim() || !city?.trim()) {
      return NextResponse.json(
        { error: "Phone and shipping address are required" },
        { status: 400 }
      );
    }

    const { lines, subtotal, discount, shipping, total, promoCode } =
      await buildCheckoutLines(body.items, body.promoCode);

    const order = await createOrder({
      customerName: `${firstName.trim()} ${lastName.trim()}`,
      customerEmail: email.trim(),
      customerPhone: phone.trim(),
      shippingAddress: address.trim(),
      shippingCity: city.trim(),
      items: lines,
      subtotal,
      discount,
      shipping,
      total,
      promoCode,
      paymentMethod: "cod",
    });

    if (promoCode) {
      try {
        const promo = await getPromoCodeByCode(promoCode);
        if (promo) await incrementPromoCodeRedemption(promo.id);
      } catch (err) {
        console.error("Failed to increment promo redemption:", err);
      }
    }

    try {
      await sendOrderEmails(order);
    } catch (emailError) {
      console.error("Failed to send order emails:", emailError);
    }

    return NextResponse.json({
      paymentMethod: "cod",
      orderId: order.id,
      orderNumber: order.orderNumber,
      total: order.total,
      discount: order.discount,
      promoCode: order.promoCode,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    const message =
      error instanceof Error ? error.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
