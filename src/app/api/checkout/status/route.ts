import { NextResponse } from "next/server";
import {
  getOrderByOrderNumber,
  getOrderByTracker,
  updateOrderPaymentStatus,
} from "@/lib/db";
import {
  formatPayfastAmount,
  verifyPayfastSignature,
} from "@/lib/payfast";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const basketId =
    searchParams.get("basket_id") ??
    searchParams.get("basketId") ??
    searchParams.get("BASKET_ID");
  const signature = searchParams.get("signature");
  const tracker = searchParams.get("tracker");

  if (basketId) {
    try {
      const order = await getOrderByOrderNumber(basketId);

      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      const amount = formatPayfastAmount(order.total);
      const signatureValid = signature
        ? verifyPayfastSignature(amount, basketId, signature)
        : false;

      if (signatureValid && order.paymentStatus !== "paid") {
        await updateOrderPaymentStatus(order.id, "paid", basketId);
      }

      const paid = signatureValid || order.paymentStatus === "paid";

      return NextResponse.json({
        basketId,
        paid,
        signatureValid,
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          paymentStatus: paid ? "paid" : order.paymentStatus,
          total: order.total,
        },
      });
    } catch (error) {
      console.error("Payment status error:", error);
      return NextResponse.json(
        { error: "Unable to verify payment status" },
        { status: 500 }
      );
    }
  }

  if (!tracker) {
    return NextResponse.json(
      { error: "Missing basket_id or tracker" },
      { status: 400 }
    );
  }

  try {
    const order = await getOrderByTracker(tracker);

    return NextResponse.json({
      tracker,
      paid: order?.paymentStatus === "paid",
      order: order
        ? {
            id: order.id,
            orderNumber: order.orderNumber,
            paymentStatus: order.paymentStatus,
            total: order.total,
          }
        : null,
    });
  } catch (error) {
    console.error("Payment status error:", error);
    return NextResponse.json(
      { error: "Unable to verify payment status" },
      { status: 500 }
    );
  }
}
