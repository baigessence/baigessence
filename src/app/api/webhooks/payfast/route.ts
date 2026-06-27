import { NextResponse } from "next/server";
import {
  getOrderByOrderNumber,
  updateOrderPaymentStatus,
} from "@/lib/db";
import {
  formatPayfastAmount,
  verifyPayfastSignature,
} from "@/lib/payfast";

function getParam(
  params: URLSearchParams | FormData,
  key: string
): string | null {
  if (params instanceof URLSearchParams) {
    return params.get(key);
  }

  const value = params.get(key);
  return value === null ? null : String(value);
}

async function handlePayfastCallback(
  params: URLSearchParams | FormData
): Promise<NextResponse> {
  const basketId =
    getParam(params, "basket_id") ??
    getParam(params, "BASKET_ID") ??
    getParam(params, "order_id") ??
    getParam(params, "ORDER_ID");

  const signature = getParam(params, "signature") ?? getParam(params, "SIGNATURE");
  const status =
    getParam(params, "err_code") ??
    getParam(params, "status") ??
    getParam(params, "STATUS");
  const transactionStatus = getParam(params, "transaction_status");

  if (!basketId) {
    return NextResponse.json({ received: true });
  }

  const order = await getOrderByOrderNumber(basketId);
  if (!order) {
    return NextResponse.json({ received: true });
  }

  const amount = formatPayfastAmount(order.total);
  const signatureValid = signature
    ? verifyPayfastSignature(amount, basketId, signature)
    : false;

  const isSuccess =
    signatureValid ||
    status === "000" ||
    status === "00" ||
    transactionStatus?.toLowerCase() === "success" ||
    transactionStatus?.toLowerCase() === "paid";

  if (isSuccess) {
    await updateOrderPaymentStatus(order.id, "paid", basketId);
  } else if (status && status !== "000" && status !== "00") {
    await updateOrderPaymentStatus(order.id, "failed", basketId);
  }

  return new NextResponse("OK", { status: 200 });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    return await handlePayfastCallback(searchParams);
  } catch (error) {
    console.error("PayFast webhook error:", error);
    return new NextResponse("OK", { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await request.formData();
      return await handlePayfastCallback(formData);
    }

    const { searchParams } = new URL(request.url);
    return await handlePayfastCallback(searchParams);
  } catch (error) {
    console.error("PayFast webhook error:", error);
    return new NextResponse("OK", { status: 200 });
  }
}
