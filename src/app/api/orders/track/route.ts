import { NextResponse } from "next/server";
import { getOrderByOrderNumber } from "@/lib/db";
import { phonesMatch } from "@/lib/order-status";
import { formatPrice } from "@/lib/utils";

type TrackBody = {
  orderNumber?: string;
  email?: string;
  phone?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TrackBody;
    const orderNumber = body.orderNumber?.trim().toUpperCase();
    const email = body.email?.trim().toLowerCase();
    const phone = body.phone?.trim();

    if (!orderNumber) {
      return NextResponse.json(
        { error: "Order number is required" },
        { status: 400 }
      );
    }

    if (!email && !phone) {
      return NextResponse.json(
        { error: "Enter the email or phone used at checkout" },
        { status: 400 }
      );
    }

    const order = await getOrderByOrderNumber(orderNumber);
    if (!order) {
      return NextResponse.json(
        { error: "Order not found. Check your order number and try again." },
        { status: 404 }
      );
    }

    const emailOk =
      !!email && order.customerEmail.trim().toLowerCase() === email;
    const phoneOk = !!phone && phonesMatch(phone, order.customerPhone);

    if (!emailOk && !phoneOk) {
      return NextResponse.json(
        {
          error:
            "Order number and email/phone do not match. Use the details from your confirmation email.",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      order: {
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        shippingCity: order.shippingCity,
        shippingAddress: order.shippingAddress,
        items: order.items.map((item) => ({
          name: item.name,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
          lineTotal: formatPrice(item.price * item.quantity),
        })),
        subtotal: order.subtotal,
        shipping: order.shipping,
        total: order.total,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        fulfillmentStatus: order.fulfillmentStatus,
        trackingNote: order.trackingNote ?? null,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
    });
  } catch (error) {
    console.error("Track order error:", error);
    return NextResponse.json(
      { error: "Unable to track order right now" },
      { status: 500 }
    );
  }
}
