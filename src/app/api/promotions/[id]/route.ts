import { NextResponse } from "next/server";
import { getPromotionById, updatePromotion, deletePromotion } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const promotion = await getPromotionById(id);
  if (!promotion) {
    return NextResponse.json({ error: "Promotion not found" }, { status: 404 });
  }
  return NextResponse.json(promotion);
}

export async function PUT(request: Request, context: RouteContext) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  try {
    const body = await request.json();
    const promotion = await updatePromotion(id, body);
    if (!promotion) {
      return NextResponse.json({ error: "Promotion not found" }, { status: 404 });
    }
    return NextResponse.json(promotion);
  } catch {
    return NextResponse.json({ error: "Failed to update promotion" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const deleted = await deletePromotion(id);
  if (!deleted) {
    return NextResponse.json({ error: "Promotion not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
