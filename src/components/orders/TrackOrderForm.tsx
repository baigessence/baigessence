"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PackageSearch, Loader2 } from "lucide-react";
import {
  FULFILLMENT_DESCRIPTIONS,
  FULFILLMENT_LABELS,
  TRACKING_STEPS,
  getTrackingStepIndex,
} from "@/lib/order-status";
import type { OrderFulfillmentStatus } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

type TrackedOrder = {
  orderNumber: string;
  customerName: string;
  shippingCity: string;
  shippingAddress: string;
  items: {
    name: string;
    size: string;
    quantity: number;
    price: number;
    lineTotal: string;
  }[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  fulfillmentStatus: OrderFulfillmentStatus;
  trackingNote: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function TrackOrderForm() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<TrackedOrder | null>(null);

  useEffect(() => {
    const preset = searchParams.get("order");
    if (preset) setOrderNumber(preset);
  }, [searchParams]);

  const currentStep = useMemo(
    () => (order ? getTrackingStepIndex(order.fulfillmentStatus) : -1),
    [order]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, email, phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to find order");
      }
      setOrder(data.order as TrackedOrder);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to find order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
      <div className="text-center">
        <PackageSearch className="mx-auto h-10 w-10 text-gold" />
        <h1 className="mt-4 font-serif text-3xl md:text-4xl">Track your order</h1>
        <p className="mt-2 text-muted">
          Enter your order number and the email or phone used at checkout.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-10 space-y-4 border border-charcoal/10 bg-white p-6 md:p-8"
      >
        <div>
          <label className="mb-1 block text-sm font-medium">Order number *</label>
          <input
            className="input-field uppercase"
            placeholder="BE-20260715-XXXX"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              className="input-field"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Phone</label>
            <input
              type="tel"
              className="input-field"
              placeholder="+92 322 6053521"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>
        <p className="text-xs text-muted">Provide at least one: email or phone.</p>

        {error && (
          <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full disabled:opacity-50 sm:w-auto"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching...
            </span>
          ) : (
            "Track order"
          )}
        </button>
      </form>

      {order && (
        <div className="mt-10 space-y-6 border border-charcoal/10 bg-white p-6 md:p-8">
          <div className="flex flex-col gap-2 border-b border-charcoal/5 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.3em] text-gold uppercase">
                Status
              </p>
              <h2 className="mt-1 font-serif text-2xl">
                {FULFILLMENT_LABELS[order.fulfillmentStatus]}
              </h2>
              <p className="mt-1 text-sm text-muted">
                {FULFILLMENT_DESCRIPTIONS[order.fulfillmentStatus]}
              </p>
            </div>
            <div className="text-sm sm:text-right">
              <p className="font-medium">{order.orderNumber}</p>
              <p className="text-muted">
                Placed {new Date(order.createdAt).toLocaleDateString("en-PK")}
              </p>
            </div>
          </div>

          {order.fulfillmentStatus === "cancelled" ? (
            <p className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              This order was cancelled.
            </p>
          ) : (
            <ol className="space-y-0">
              {TRACKING_STEPS.map((step, index) => {
                const done = currentStep >= index;
                const current = currentStep === index;
                return (
                  <li key={step} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-medium ${
                          done
                            ? "border-gold bg-gold/15 text-gold-dark"
                            : "border-charcoal/15 text-muted"
                        } ${current ? "ring-2 ring-gold/40" : ""}`}
                      >
                        {index + 1}
                      </span>
                      {index < TRACKING_STEPS.length - 1 && (
                        <span
                          className={`my-1 w-px flex-1 min-h-6 ${
                            currentStep > index ? "bg-gold" : "bg-charcoal/10"
                          }`}
                        />
                      )}
                    </div>
                    <div className="pb-6">
                      <p
                        className={`text-sm font-medium ${
                          done ? "text-charcoal" : "text-muted"
                        }`}
                      >
                        {FULFILLMENT_LABELS[step]}
                      </p>
                      {current && (
                        <p className="mt-1 text-xs text-muted">
                          Updated{" "}
                          {new Date(order.updatedAt).toLocaleString("en-PK")}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}

          {order.trackingNote && (
            <div className="rounded border border-gold/20 bg-gold/5 px-4 py-3 text-sm">
              <p className="text-[10px] font-semibold tracking-[0.2em] text-gold uppercase">
                Courier note
              </p>
              <p className="mt-1 text-charcoal">{order.trackingNote}</p>
            </div>
          )}

          <div>
            <h3 className="font-serif text-xl">Order details</h3>
            <p className="mt-1 text-sm text-muted">
              Delivering to {order.shippingAddress}, {order.shippingCity}
            </p>
            <div className="mt-4 space-y-3">
              {order.items.map((item) => (
                <div
                  key={`${item.name}-${item.size}`}
                  className="flex justify-between gap-4 text-sm"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted">
                      {item.size} · Qty {item.quantity}
                    </p>
                  </div>
                  <p>{item.lineTotal}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2 border-t border-charcoal/5 pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Shipping</span>
                <span>
                  {order.shipping === 0 ? "Free" : formatPrice(order.shipping)}
                </span>
              </div>
              <div className="flex justify-between text-base font-medium">
                <span>Total (COD)</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
