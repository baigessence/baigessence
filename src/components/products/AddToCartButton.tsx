"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart } from "@/components/CartProvider";

export default function AddToCartButton({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="flex items-center border">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="px-4 py-3 hover:bg-cream"
          aria-label="Decrease quantity"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="px-6 py-3 font-medium">{quantity}</span>
        <button
          onClick={() => setQuantity(quantity + 1)}
          className="px-4 py-3 hover:bg-cream"
          aria-label="Increase quantity"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <button
        onClick={() => addItem(product, quantity)}
        className="btn-primary flex flex-1 items-center justify-center gap-2"
      >
        <ShoppingBag className="h-4 w-4" />
        Add to Bag
      </button>
    </div>
  );
}
