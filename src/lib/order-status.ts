import type { OrderFulfillmentStatus } from "@/lib/types";

export const ORDER_FULFILLMENT_STATUSES: OrderFulfillmentStatus[] = [
  "placed",
  "confirmed",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

export const FULFILLMENT_LABELS: Record<OrderFulfillmentStatus, string> = {
  placed: "Order placed",
  confirmed: "Order confirmed",
  processing: "Preparing your order",
  shipped: "Shipped",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const FULFILLMENT_DESCRIPTIONS: Record<OrderFulfillmentStatus, string> = {
  placed: "We received your order and will confirm it shortly.",
  confirmed: "Your order has been confirmed and is queued for packing.",
  processing: "Your fragrance is being packed carefully.",
  shipped: "Your package has left our store and is with the courier.",
  out_for_delivery:
    "The courier is on the way — please keep cash ready for COD.",
  delivered: "Your order has been delivered. Enjoy your fragrance!",
  cancelled: "This order was cancelled. Contact us if you need help.",
};

export const TRACKING_STEPS: OrderFulfillmentStatus[] = [
  "placed",
  "confirmed",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
];

export function isOrderFulfillmentStatus(
  value: string
): value is OrderFulfillmentStatus {
  return ORDER_FULFILLMENT_STATUSES.includes(value as OrderFulfillmentStatus);
}

export function getTrackingStepIndex(status: OrderFulfillmentStatus): number {
  if (status === "cancelled") return -1;
  return TRACKING_STEPS.indexOf(status);
}

export function normalizePhone(phone: string): string {
  return phone.replace(/[^\d]/g, "");
}

export function phonesMatch(a: string, b: string): boolean {
  const na = normalizePhone(a);
  const nb = normalizePhone(b);
  if (!na || !nb) return false;
  if (na === nb) return true;
  return na.slice(-10) === nb.slice(-10);
}
