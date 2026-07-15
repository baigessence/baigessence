import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { deleteAllOrders } from "@/lib/db";

export async function DELETE(request: Request) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json().catch(() => ({}))) as {
      confirm?: string;
    };

    if (body.confirm !== "DELETE_ALL_ORDERS") {
      return NextResponse.json(
        { error: "Confirmation required to delete all orders" },
        { status: 400 }
      );
    }

    const deleted = await deleteAllOrders();
    return NextResponse.json({ deleted });
  } catch (error) {
    console.error("Delete all orders error:", error);
    return NextResponse.json(
      { error: "Failed to delete orders" },
      { status: 500 }
    );
  }
}
