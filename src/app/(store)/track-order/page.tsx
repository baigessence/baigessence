import type { Metadata } from "next";
import { Suspense } from "react";
import TrackOrderForm from "@/components/orders/TrackOrderForm";

export const metadata: Metadata = {
  title: "Track Order",
  description:
    "Track your Baig Essence Cash on Delivery order status in real time.",
};

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-4 py-20 text-center text-muted">
          Loading...
        </div>
      }
    >
      <TrackOrderForm />
    </Suspense>
  );
}
