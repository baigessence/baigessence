import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center lg:px-8">
      <h1 className="font-serif text-3xl">Payment cancelled</h1>
      <p className="mt-2 text-muted">
        Your payment was not completed. Your cart items are still saved.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link href="/checkout" className="btn-primary">
          Try Again
        </Link>
        <Link href="/cart" className="btn-outline">
          Back to Cart
        </Link>
      </div>
    </div>
  );
}
