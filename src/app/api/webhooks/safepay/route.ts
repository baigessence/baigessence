import { NextResponse } from "next/server";
import {
  getOrderByTracker,
  updateOrderPaymentStatus,
} from "@/lib/db";
import {
  fetchSafepayTracker,
  isSafepayPaymentComplete,
} from "@/lib/safepay";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const tracker =
      body?.data?.tracker?.token ??
      body?.tracker ??
      body?.data?.tracker;

    if (!tracker || typeof tracker !== "string") {
      return NextResponse.json({ received: true });
    }

    const eventType = body?.type ?? body?.event;
    const isSuccessEvent =
      eventType === "payment.succeeded" || body?.data?.success === true;

    if (isSuccessEvent) {
      const order = await getOrderByTracker(tracker);
      if (order) {
        await updateOrderPaymentStatus(order.id, "paid", tracker);
      }
      return NextResponse.json({ received: true });
    }

    const response = await fetchSafepayTracker(tracker);
    const trackerState = response.data?.tracker?.state as string | undefined;

    if (isSafepayPaymentComplete(trackerState)) {
      const order = await getOrderByTracker(tracker);
      if (order) {
        await updateOrderPaymentStatus(order.id, "paid", tracker);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Safepay webhook error:", error);
    return NextResponse.json({ received: true });
  }
}
