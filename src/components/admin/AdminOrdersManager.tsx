"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import type { Order, OrderFulfillmentStatus } from "@/lib/types";
import {
  FULFILLMENT_LABELS,
  ORDER_FULFILLMENT_STATUSES,
} from "@/lib/order-status";
import { formatPrice } from "@/lib/utils";

type StatusFilter = "all" | OrderFulfillmentStatus;

function uniqueProductNames(orders: Order[]): string[] {
  const names = new Set<string>();
  for (const order of orders) {
    for (const item of order.items) {
      if (item.name?.trim()) names.add(item.name.trim());
    }
  }
  return Array.from(names).sort((a, b) => a.localeCompare(b));
}

export default function AdminOrdersManager({
  initialOrders,
}: {
  initialOrders: Order[];
}) {
  const [orders, setOrders] = useState(initialOrders);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingAll, setDeletingAll] = useState(false);
  const [message, setMessage] = useState("");
  const [notes, setNotes] = useState<Record<string, string>>(() =>
    Object.fromEntries(initialOrders.map((o) => [o.id, o.trackingNote ?? ""]))
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [productFilter, setProductFilter] = useState("all");

  const productOptions = useMemo(() => uniqueProductNames(orders), [orders]);

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();

    return orders.filter((order) => {
      if (statusFilter !== "all" && order.fulfillmentStatus !== statusFilter) {
        return false;
      }

      if (productFilter !== "all") {
        const hasProduct = order.items.some(
          (item) => item.name.trim() === productFilter
        );
        if (!hasProduct) return false;
      }

      if (!q) return true;

      const haystack = [
        order.orderNumber,
        order.customerName,
        order.customerEmail,
        order.customerPhone,
        order.shippingCity,
        order.shippingAddress,
        ...order.items.map((i) => i.name),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [orders, search, statusFilter, productFilter]);

  const updateOrder = async (
    orderId: string,
    fulfillmentStatus: OrderFulfillmentStatus
  ) => {
    setSavingId(orderId);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fulfillmentStatus,
          trackingNote: notes[orderId] ?? "",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Update failed");
      }

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? (data.order as Order) : o))
      );
      setMessage(
        data.emailSent
          ? `Updated ${data.order.orderNumber} — customer emailed`
          : `Updated ${data.order.orderNumber}`
      );
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSavingId(null);
    }
  };

  const deleteOne = async (order: Order) => {
    const ok = window.confirm(
      `Delete order ${order.orderNumber}? This cannot be undone.`
    );
    if (!ok) return;

    setDeletingId(order.id);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Delete failed");
      }
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
      setMessage(`Deleted ${order.orderNumber}`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const deleteAll = async () => {
    if (orders.length === 0) return;

    const first = window.confirm(
      `Delete ALL ${orders.length} orders from the database?\n\nThis cannot be undone.`
    );
    if (!first) return;

    const typed = window.prompt(
      'Type DELETE ALL to permanently remove every order:'
    );
    if (typed?.trim().toUpperCase() !== "DELETE ALL") {
      setMessage("Delete all cancelled — confirmation text did not match.");
      return;
    }

    setDeletingAll(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: "DELETE_ALL_ORDERS" }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete orders");
      }
      setOrders([]);
      setNotes({});
      setSearch("");
      setStatusFilter("all");
      setProductFilter("all");
      setMessage(`Deleted ${data.deleted ?? 0} orders`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to delete orders");
    } finally {
      setDeletingAll(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setProductFilter("all");
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl">Orders</h1>
          <p className="mt-1 text-muted">
            Showing {filteredOrders.length} of {orders.length} order
            {orders.length === 1 ? "" : "s"}
          </p>
        </div>
        <button
          type="button"
          onClick={deleteAll}
          disabled={deletingAll || orders.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-600 bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" />
          {deletingAll ? "Deleting..." : "Delete all orders"}
        </button>
      </div>

      <div className="mt-6 grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted">
            Search
          </label>
          <input
            className="input-field"
            placeholder="Order #, customer, phone, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted">
            Tracking status
          </label>
          <select
            className="input-field"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          >
            <option value="all">All statuses</option>
            {ORDER_FULFILLMENT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {FULFILLMENT_LABELS[status]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted">
            Product
          </label>
          <select
            className="input-field"
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
          >
            <option value="all">All products</option>
            {productOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        {(search || statusFilter !== "all" || productFilter !== "all") && (
          <div className="md:col-span-3">
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm text-gold-dark hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {message && (
        <p className="mt-4 rounded border border-charcoal/10 bg-cream/40 px-3 py-2 text-sm">
          {message}
        </p>
      )}

      <div className="mt-8 space-y-4">
        {orders.length === 0 ? (
          <div className="rounded-xl border bg-white px-4 py-12 text-center text-muted">
            No orders yet. When a customer places a COD order, it will appear
            here.
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="rounded-xl border bg-white px-4 py-12 text-center text-muted">
            No orders match your filters.
          </div>
        ) : (
          filteredOrders.map((order) => (
            <article
              key={order.id}
              className="rounded-xl border bg-white p-4 md:p-6"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="mt-1 text-sm">{order.customerName}</p>
                  <p className="text-xs text-muted">{order.customerPhone}</p>
                  <p className="text-xs text-muted">{order.customerEmail}</p>
                  <p className="mt-2 text-sm text-muted">
                    {order.shippingAddress}, {order.shippingCity}
                  </p>
                  <p className="mt-2 text-sm">
                    <span className="font-medium">
                      {formatPrice(order.total)}
                    </span>
                    <span className="text-muted">
                      {" "}
                      · COD · {order.paymentStatus} ·{" "}
                      {new Date(order.createdAt).toLocaleString("en-PK")}
                    </span>
                  </p>
                  <ul className="mt-3 space-y-1 text-xs text-muted">
                    {order.items.map((item) => (
                      <li key={`${item.productId}-${item.size}`}>
                        {item.name} ({item.size}) × {item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="w-full max-w-sm space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted">
                      Tracking status
                    </label>
                    <select
                      className="input-field"
                      value={order.fulfillmentStatus}
                      disabled={savingId === order.id}
                      onChange={(e) =>
                        updateOrder(
                          order.id,
                          e.target.value as OrderFulfillmentStatus
                        )
                      }
                    >
                      {ORDER_FULFILLMENT_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {FULFILLMENT_LABELS[status]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted">
                      Courier note (optional)
                    </label>
                    <input
                      className="input-field"
                      placeholder="e.g. TCS · Tracking 123456"
                      value={notes[order.id] ?? ""}
                      onChange={(e) =>
                        setNotes((prev) => ({
                          ...prev,
                          [order.id]: e.target.value,
                        }))
                      }
                    />
                    <button
                      type="button"
                      className="btn-outline mt-2 w-full text-xs"
                      disabled={savingId === order.id}
                      onClick={() =>
                        updateOrder(order.id, order.fulfillmentStatus)
                      }
                    >
                      {savingId === order.id
                        ? "Saving..."
                        : "Save note / status"}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteOne(order)}
                    disabled={deletingId === order.id}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {deletingId === order.id
                      ? "Deleting..."
                      : "Delete this order"}
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      <p className="mt-6 text-sm text-muted">
        Customers can track at{" "}
        <Link href="/track-order" className="text-gold-dark hover:underline">
          /track-order
        </Link>
        .{" "}
        <Link href="/admin" className="text-gold-dark hover:underline">
          Back to dashboard
        </Link>
      </p>
    </div>
  );
}
