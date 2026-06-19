"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    setIsOpen,
    removeItem,
    updateQuantity,
    totalPrice,
    totalItems,
  } = useCart();

  return (
    <>
      <div
        className={`fixed inset-0 z-[70] bg-black/50 transition-opacity ${isOpen ? "visible opacity-100" : "invisible opacity-0"}`}
        onClick={() => setIsOpen(false)}
      />
      <div
        className={`fixed top-0 right-0 z-[80] flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="font-serif text-xl">
            Your Bag ({totalItems})
          </h2>
          <button onClick={() => setIsOpen(false)} aria-label="Close cart">
            <X className="h-6 w-6" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
            <ShoppingBag className="h-16 w-16 text-gray-200" />
            <p className="text-muted">Your bag is empty</p>
            <button onClick={() => setIsOpen(false)} className="btn-outline">
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex gap-4">
                    <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-cream">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between">
                        <Link
                          href={`/product/${product.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="font-medium hover:text-gold"
                        >
                          {product.name}
                        </Link>
                        <button
                          onClick={() => removeItem(product.id)}
                          className="text-muted hover:text-red-500"
                          aria-label="Remove item"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-xs text-muted">{product.size} · {product.concentration}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center border">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="px-2 py-1 hover:bg-cream"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-3 text-sm">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="px-2 py-1 hover:bg-cream"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="font-medium">{formatPrice(product.price * quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t p-6">
              <div className="mb-4 flex justify-between text-lg font-medium">
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <p className="mb-4 text-xs text-muted">
                Shipping and taxes calculated at checkout
              </p>
              <Link
                href="/cart"
                onClick={() => setIsOpen(false)}
                className="btn-primary w-full text-center"
              >
                View Cart & Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
