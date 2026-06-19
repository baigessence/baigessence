import { NextResponse } from "next/server";
import { getPromotions, createPromotion } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";
import type { Promotion } from "@/lib/types";

export async function GET() {
  const promotions = await getPromotions();
  return NextResponse.json(promotions);
}

export async function POST(request: Request) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const promotion = await createPromotion(body as Omit<Promotion, "id">);
    return NextResponse.json(promotion, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create promotion" }, { status: 500 });
  }
}
