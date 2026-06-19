import { NextResponse } from "next/server";
import {
  getProducts,
  createProduct,
} from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";
import type { Product } from "@/lib/types";

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const product = await createProduct(body as Omit<Product, "id" | "slug" | "createdAt" | "updatedAt">);
    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
