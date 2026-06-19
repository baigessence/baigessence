"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center lg:px-8">
        <ShoppingBag className="mx-auto h-20 w-20 text-gray-200" />
        <h1 className="mt-6 font-serif text-3xl">Your bag is empty</h1>
        <p className="mt-2 text-muted">Discover our premium fragrance collection</p>
        <Link href="/shop" className="btn-primary mt-8 inline-block">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <h1 className="font-serif text-3xl">Shopping Bag</h1>

      <div className="mt-10 grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex gap-6 border-b border-gray-100 pb-6"
              >
                <div className="relative h-32 w-24 shrink-0 overflow-hidden bg-cream">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between">
                    <div>
                      <Link
                        href={`/product/${product.slug}`}
                        className="font-medium hover:text-gold"
                      >
                        {product.name}
                      </Link>
                      <p className="mt-1 text-sm text-muted">
                        {product.size} · {product.concentration}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(product.id)}
                      className="text-muted hover:text-red-500"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center border">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="px-3 py-2 hover:bg-cream"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-4 text-sm">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="px-3 py-2 hover:bg-cream"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="font-medium">
                      {formatPrice(product.price * quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={clearCart}
            className="mt-6 text-sm text-muted underline hover:text-charcoal"
          >
            Clear bag
          </button>
        </div>

        <div className="h-fit border border-gray-100 p-6">
          <h2 className="font-serif text-xl">Order Summary</h2>
          <div className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Shipping</span>
              <span>{totalPrice >= 3000 ? "Free" : "Rs. 250"}</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t pt-4 text-lg font-medium">
            <span>Total</span>
            <span>
              {formatPrice(totalPrice + (totalPrice >= 3000 ? 0 : 250))}
            </span>
          </div>
          {totalPrice < 3000 && (
            <p className="mt-2 text-xs text-gold">
              Add {formatPrice(3000 - totalPrice)} more for free shipping
            </p>
          )}
          <button className="btn-primary mt-6 w-full">
            Proceed to Checkout
          </button>
          <Link
            href="/shop"
            className="mt-4 block text-center text-sm text-muted hover:text-charcoal"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
