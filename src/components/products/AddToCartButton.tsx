"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart } from "@/components/CartProvider";

export default function AddToCartButton({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  return (
    <div className="flex items-stretch gap-3">
      <div className="flex w-[7.5rem] shrink-0 items-center justify-between border border-charcoal/15">
        <button
          type="button"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="flex h-12 w-10 items-center justify-center hover:bg-cream"
          aria-label="Decrease quantity"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="min-w-[1.5rem] text-center text-sm font-medium tabular-nums">
          {quantity}
        </span>
        <button
          type="button"
          onClick={() => setQuantity(quantity + 1)}
          className="flex h-12 w-10 items-center justify-center hover:bg-cream"
          aria-label="Increase quantity"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <button
        type="button"
        onClick={() => addItem(product, quantity)}
        className="btn-primary flex min-w-0 flex-1 items-center justify-center gap-2"
      >
        <ShoppingBag className="h-4 w-4 shrink-0" />
        <span className="truncate">Add to Cart</span>
      </button>
    </div>
  );
}
