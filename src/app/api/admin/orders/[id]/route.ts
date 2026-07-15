import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import {
  deleteOrderById,
  getOrderById,
  updateOrderFulfillment,
} from "@/lib/db";
import { sendOrderStatusUpdateEmail } from "@/lib/email";
import { isOrderFulfillmentStatus } from "@/lib/order-status";

type UpdateBody = {
  fulfillmentStatus?: string;
  trackingNote?: string | null;
};

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = (await request.json()) as UpdateBody;

    if (
      !body.fulfillmentStatus ||
      !isOrderFulfillmentStatus(body.fulfillmentStatus)
    ) {
      return NextResponse.json(
        { error: "Valid fulfillment status is required" },
        { status: 400 }
      );
    }

    const previous = await getOrderById(id);
    if (!previous) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const order = await updateOrderFulfillment(
      id,
      body.fulfillmentStatus,
      body.trackingNote
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const statusChanged =
      previous.fulfillmentStatus !== order.fulfillmentStatus;
    const noteChanged =
      (previous.trackingNote ?? "") !== (order.trackingNote ?? "");

    if (statusChanged || noteChanged) {
      try {
        await sendOrderStatusUpdateEmail(order);
      } catch (emailError) {
        console.error("Failed to send status update email:", emailError);
      }
    }

    return NextResponse.json({
      order,
      emailSent: statusChanged || noteChanged,
    });
  } catch (error) {
    console.error("Update order error:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const deleted = await deleteOrderById(id);
    if (!deleted) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete order error:", error);
    return NextResponse.json(
      { error: "Failed to delete order" },
      { status: 500 }
    );
  }
}
