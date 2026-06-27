"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/utils";
import { CheckCircle2, Loader2 } from "lucide-react";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const basketId =
    searchParams.get("basket_id") ??
    searchParams.get("basketId") ??
    searchParams.get("BASKET_ID");
  const signature = searchParams.get("signature");
  const tracker = searchParams.get("tracker");
  const { clearCart } = useCart();
  const [status, setStatus] = useState<"loading" | "paid" | "pending" | "error">(
    "loading"
  );
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    const reference = basketId ?? tracker;
    if (!reference) {
      setStatus("error");
      return;
    }

    let attempts = 0;
    const maxAttempts = 10;

    const verify = async () => {
      try {
        const params = new URLSearchParams();
        if (basketId) {
          params.set("basket_id", basketId);
          if (signature) {
            params.set("signature", signature);
          }
        } else if (tracker) {
          params.set("tracker", tracker);
        }

        const res = await fetch(`/api/checkout/status?${params.toString()}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Verification failed");
        }

        if (data.order?.orderNumber) {
          setOrderNumber(data.order.orderNumber);
        }
        if (data.order?.total) {
          setTotal(data.order.total);
        }

        if (data.paid) {
          setStatus("paid");
          clearCart();
          return;
        }

        attempts += 1;
        if (attempts < maxAttempts) {
          setTimeout(verify, 2000);
          setStatus("pending");
        } else {
          setStatus("pending");
        }
      } catch {
        setStatus("error");
      }
    };

    verify();
  }, [basketId, signature, tracker, clearCart]);

  if (status === "loading" || status === "pending") {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center lg:px-8">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-gold" />
        <h1 className="mt-6 font-serif text-3xl">Confirming your payment</h1>
        <p className="mt-2 text-muted">
          Please wait while we verify your PayFast transaction...
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center lg:px-8">
        <h1 className="font-serif text-3xl">Payment verification issue</h1>
        <p className="mt-2 text-muted">
          We could not verify your payment. If you were charged, contact us with
          your order details.
        </p>
        <Link href="/contact" className="btn-primary mt-8 inline-block">
          Contact Support
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center lg:px-8">
      <CheckCircle2 className="mx-auto h-16 w-16 text-gold" />
      <h1 className="mt-6 font-serif text-3xl">Thank you for your order</h1>
      <p className="mt-2 text-muted">
        Your payment was successful. We&apos;ll prepare your fragrance for
        delivery.
      </p>
      {orderNumber && (
        <p className="mt-6 text-sm">
          Order number:{" "}
          <span className="font-medium text-charcoal">{orderNumber}</span>
        </p>
      )}
      {total !== null && (
        <p className="mt-2 text-sm text-muted">
          Amount paid: {formatPrice(total)}
        </p>
      )}
      <Link href="/shop" className="btn-primary mt-8 inline-block">
        Continue Shopping
      </Link>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-xl px-4 py-20 text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-gold" />
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
