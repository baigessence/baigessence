import { NextResponse } from "next/server";
import { createPromoCode, getPromoCodes } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";
import type { PromoCode } from "@/lib/types";

export async function GET() {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const codes = await getPromoCodes();
    return NextResponse.json(codes);
  } catch (error) {
    console.error("List promo codes error:", error);
    return NextResponse.json(
      { error: "Failed to load promo codes" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Partial<PromoCode>;
    const code = body.code?.trim();
    const percentOff = Number(body.percentOff);

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }
    if (!Number.isFinite(percentOff) || percentOff < 1 || percentOff > 100) {
      return NextResponse.json(
        { error: "Percent off must be between 1 and 100" },
        { status: 400 }
      );
    }

    const promo = await createPromoCode({
      code,
      percentOff: Math.round(percentOff),
      description: body.description?.trim() ?? "",
      active: body.active ?? true,
      expiresAt: body.expiresAt || undefined,
      maxRedemptions:
        body.maxRedemptions != null && body.maxRedemptions > 0
          ? Math.round(body.maxRedemptions)
          : undefined,
    });

    return NextResponse.json(promo, { status: 201 });
  } catch (error) {
    console.error("Create promo code error:", error);
    const message =
      error instanceof Error && error.message.includes("duplicate")
        ? "That promo code already exists"
        : "Failed to create promo code";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
