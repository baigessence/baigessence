"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import {
  calculateOrderTotal,
  calculateShipping,
  formatPrice,
} from "@/lib/utils";

export default function CheckoutForm() {
  const router = useRouter();
  const { items, totalPrice } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });

  const shipping = calculateShipping(totalPrice);
  const total = calculateOrderTotal(totalPrice);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(({ product, quantity }) => ({
            productId: product.id,
            quantity,
          })),
          customer: form,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Checkout failed");
      }

      if (data.formAction && data.formFields) {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = data.formAction;

        Object.entries(data.formFields as Record<string, string>).forEach(
          ([key, value]) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = value;
            form.appendChild(input);
          }
        );

        document.body.appendChild(form);
        form.submit();
        return;
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      throw new Error("No payment redirect returned");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center lg:px-8">
        <h1 className="font-serif text-3xl">Your bag is empty</h1>
        <p className="mt-2 text-muted">Add products before checkout</p>
        <Link href="/shop" className="btn-primary mt-8 inline-block">
          Shop Fragrances
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <h1 className="font-serif text-3xl">Checkout</h1>
      <p className="mt-2 text-sm text-muted">
        Secure payment powered by PayFast
      </p>

      <form onSubmit={handleSubmit} className="mt-10 grid gap-12 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section className="border border-charcoal/10 bg-white p-6">
            <h2 className="font-serif text-xl">Contact Details</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  First Name *
                </label>
                <input
                  className="input-field"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Last Name *
                </label>
                <input
                  className="input-field"
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Email *
                </label>
                <input
                  type="email"
                  className="input-field"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Phone *
                </label>
                <input
                  type="tel"
                  className="input-field"
                  placeholder="+923001234567"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                />
              </div>
            </div>
          </section>

          <section className="border border-charcoal/10 bg-white p-6">
            <h2 className="font-serif text-xl">Shipping Address</h2>
            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Address *
                </label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">City *</label>
                <input
                  className="input-field"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  required
                />
              </div>
            </div>
          </section>
        </div>

        <div className="h-fit border border-charcoal/10 bg-white p-6">
          <h2 className="font-serif text-xl">Order Summary</h2>
          <div className="mt-6 space-y-4">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex gap-3">
                <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-cream">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{product.name}</p>
                  <p className="text-xs text-muted">Qty {quantity}</p>
                  <p className="text-sm">
                    {formatPrice(product.price * quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3 border-t pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Shipping</span>
              <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between text-lg font-medium">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-6 w-full disabled:opacity-50"
          >
            {loading ? "Redirecting to PayFast..." : "Pay with PayFast"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/cart")}
            className="mt-4 w-full text-center text-sm text-muted hover:text-charcoal"
          >
            Back to cart
          </button>
        </div>
      </form>
    </div>
  );
}
