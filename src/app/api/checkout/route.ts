import { NextResponse } from "next/server";
import { buildCheckoutLines } from "@/lib/checkout";
import { createOrder, updateOrderPaymentStatus } from "@/lib/db";
import { createPayfastCheckoutForm } from "@/lib/payfast";

type CheckoutBody = {
  items: { productId: string; quantity: number }[];
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

    const { lines, subtotal, shipping, total } = await buildCheckoutLines(
      body.items
    );

    const order = await createOrder({
      customerName: `${firstName.trim()} ${lastName.trim()}`,
      customerEmail: email.trim(),
      customerPhone: phone.trim(),
      shippingAddress: address.trim(),
      shippingCity: city.trim(),
      items: lines,
      subtotal,
      shipping,
      total,
      paymentMethod: "payfast",
    });

    const { formAction, formFields } = await createPayfastCheckoutForm({
      basketId: order.orderNumber,
      amountPkr: total,
      customer: {
        email: email.trim(),
        phone: phone.trim(),
      },
    });

    await updateOrderPaymentStatus(order.id, "pending", order.orderNumber);

    return NextResponse.json({
      paymentProvider: "payfast",
      formAction,
      formFields,
      orderId: order.id,
      orderNumber: order.orderNumber,
      basketId: order.orderNumber,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    const message =
      error instanceof Error ? error.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
