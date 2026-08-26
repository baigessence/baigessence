import { NextResponse } from "next/server";
import {
  deletePromoCode,
  updatePromoCode,
} from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";
import type { PromoCode } from "@/lib/types";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: RouteContext) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  try {
    const body = (await request.json()) as Partial<PromoCode>;
    const payload: Partial<
      Omit<PromoCode, "id" | "redemptionCount" | "createdAt" | "updatedAt">
    > = {};

    if (body.code !== undefined) payload.code = body.code;
    if (body.percentOff !== undefined) {
      const percentOff = Number(body.percentOff);
      if (!Number.isFinite(percentOff) || percentOff < 1 || percentOff > 100) {
        return NextResponse.json(
          { error: "Percent off must be between 1 and 100" },
          { status: 400 }
        );
      }
      payload.percentOff = Math.round(percentOff);
    }
    if (body.description !== undefined) payload.description = body.description;
    if (body.active !== undefined) payload.active = body.active;
    if (body.expiresAt !== undefined) {
      payload.expiresAt = body.expiresAt || undefined;
    }
    if (body.maxRedemptions !== undefined) {
      payload.maxRedemptions =
        body.maxRedemptions != null && body.maxRedemptions > 0
          ? Math.round(body.maxRedemptions)
          : undefined;
    }

    const promo = await updatePromoCode(id, payload);
    if (!promo) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(promo);
  } catch (error) {
    console.error("Update promo code error:", error);
    return NextResponse.json(
      { error: "Failed to update promo code" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const deleted = await deletePromoCode(id);
  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
