"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Promotion } from "@/lib/types";
import type { Product } from "@/lib/types";
import { Pencil, Trash2, Plus } from "lucide-react";

type PromotionManagerProps = {
  promotions: Promotion[];
  products: Product[];
};

export default function PromotionManager({
  promotions: initialPromotions,
  products,
}: PromotionManagerProps) {
  const router = useRouter();
  const [promotions, setPromotions] = useState(initialPromotions);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Promotion | null>(null);
  const [loading, setLoading] = useState(false);

  const emptyForm = {
    name: "",
    description: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: 10,
    productIds: [] as string[],
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    active: true,
    badge: "",
  };

  const [form, setForm] = useState(emptyForm);

  const openEdit = (promo: Promotion) => {
    setEditing(promo);
    setForm({
      name: promo.name,
      description: promo.description,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      productIds: promo.productIds,
      startDate: promo.startDate.split("T")[0],
      endDate: promo.endDate.split("T")[0],
      active: promo.active,
      badge: promo.badge ?? "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      startDate: new Date(form.startDate).toISOString(),
      endDate: new Date(form.endDate + "T23:59:59").toISOString(),
      badge: form.badge || undefined,
    };

    try {
      const url = editing ? `/api/promotions/${editing.id}` : "/api/promotions";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowForm(false);
        setEditing(null);
        setForm(emptyForm);
        router.refresh();
        const updated = await fetch("/api/promotions").then((r) => r.json());
        setPromotions(updated);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete promotion "${name}"?`)) return;
    const res = await fetch(`/api/promotions/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPromotions((prev) => prev.filter((p) => p.id !== id));
      router.refresh();
    }
  };

  const toggleProduct = (productId: string) => {
    setForm((prev) => ({
      ...prev,
      productIds: prev.productIds.includes(productId)
        ? prev.productIds.filter((id) => id !== productId)
        : [...prev.productIds, productId],
    }));
  };

  return (
    <div>
      <div className="flex justify-end">
        <button
          onClick={() => {
            setEditing(null);
            setForm(emptyForm);
            setShowForm(true);
          }}
          className="btn-primary"
        >
          <Plus className="h-4 w-4" />
          New Promotion
        </button>
      </div>

      {showForm && (
        <div className="mt-6 rounded-xl border bg-white p-6">
          <h2 className="font-medium">
            {editing ? "Edit Promotion" : "Create Promotion"}
          </h2>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium">Promotion Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="input-field"
                  rows={2}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Discount Type</label>
                <select
                  value={form.discountType}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      discountType: e.target.value as "percentage" | "fixed",
                    })
                  }
                  className="input-field"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (Rs.)</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Discount Value</label>
                <input
                  type="number"
                  value={form.discountValue}
                  onChange={(e) =>
                    setForm({ ...form, discountValue: Number(e.target.value) })
                  }
                  className="input-field"
                  required
                  min={0}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Start Date</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">End Date</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium">Badge Text</label>
                <input
                  value={form.badge}
                  onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  className="input-field"
                  placeholder="e.g. 15% OFF, SAVE Rs. 500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Select Products ({form.productIds.length} selected)
              </label>
              <div className="max-h-48 overflow-y-auto rounded border p-3">
                {products.map((p) => (
                  <label key={p.id} className="flex items-center gap-2 py-1 text-sm">
                    <input
                      type="checkbox"
                      checked={form.productIds.includes(p.id)}
                      onChange={() => toggleProduct(p.id)}
                      className="accent-gold"
                    />
                    {p.name}
                  </label>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className="accent-gold"
              />
              Active
            </label>

            <div className="flex gap-3">
              <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
                {loading ? "Saving..." : editing ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditing(null);
                }}
                className="btn-outline"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-8 space-y-4">
        {promotions.length === 0 ? (
          <p className="text-center text-muted py-8">No promotions yet. Create one to get started.</p>
        ) : (
          promotions.map((promo) => (
            <div key={promo.id} className="rounded-xl border bg-white p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium">{promo.name}</h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        promo.active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {promo.active ? "Active" : "Inactive"}
                    </span>
                    {promo.badge && (
                      <span className="bg-gold/20 px-2 py-0.5 text-xs text-gold-dark">
                        {promo.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted">{promo.description}</p>
                  <p className="mt-2 text-sm">
                    {promo.discountType === "percentage"
                      ? `${promo.discountValue}% off`
                      : `Rs. ${promo.discountValue} off`}
                    {" · "}
                    {promo.productIds.length} product(s)
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {new Date(promo.startDate).toLocaleDateString()} —{" "}
                    {new Date(promo.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(promo)}
                    className="rounded-lg p-2 text-muted hover:bg-cream"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(promo.id, promo.name)}
                    className="rounded-lg p-2 text-muted hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
