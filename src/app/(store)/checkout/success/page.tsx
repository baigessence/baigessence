"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const totalParam = searchParams.get("total");
  const total = totalParam ? Number(totalParam) : null;

  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center lg:px-8">
      <CheckCircle2 className="mx-auto h-16 w-16 text-gold" />
      <h1 className="mt-6 font-serif text-3xl">Order booked successfully</h1>
      <p className="mt-2 text-muted">
        Thank you. Your Cash on Delivery order is confirmed. A confirmation
        email has been sent to you.
      </p>
      {orderNumber && (
        <p className="mt-6 text-sm">
          Order number:{" "}
          <span className="font-medium text-charcoal">{orderNumber}</span>
        </p>
      )}
      {total !== null && !Number.isNaN(total) && (
        <p className="mt-2 text-sm text-muted">
          Amount due on delivery: {formatPrice(total)}
        </p>
      )}
      <p className="mt-6 text-sm text-muted">
        Please keep cash ready for the courier when your order arrives.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href={
            orderNumber
              ? `/track-order?order=${encodeURIComponent(orderNumber)}`
              : "/track-order"
          }
          className="btn-primary inline-block"
        >
          Track order
        </Link>
        <Link href="/shop" className="btn-outline inline-block">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-xl px-4 py-20 text-center text-muted">
          Loading...
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
