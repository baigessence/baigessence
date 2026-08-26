"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus, Ticket } from "lucide-react";
import type { PromoCode } from "@/lib/types";

type Props = {
  promoCodes: PromoCode[];
};

export default function PromoCodeManager({ promoCodes: initial }: Props) {
  const router = useRouter();
  const [codes, setCodes] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<PromoCode | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const emptyForm = {
    code: "",
    percentOff: 10,
    description: "",
    active: true,
    expiresAt: "",
    maxRedemptions: "",
  };

  const [form, setForm] = useState(emptyForm);

  const openEdit = (promo: PromoCode) => {
    setEditing(promo);
    setForm({
      code: promo.code,
      percentOff: promo.percentOff,
      description: promo.description,
      active: promo.active,
      expiresAt: promo.expiresAt
        ? promo.expiresAt.split("T")[0]
        : "",
      maxRedemptions:
        promo.maxRedemptions != null ? String(promo.maxRedemptions) : "",
    });
    setShowForm(true);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      code: form.code.trim().toUpperCase(),
      percentOff: Number(form.percentOff),
      description: form.description.trim(),
      active: form.active,
      expiresAt: form.expiresAt
        ? new Date(form.expiresAt + "T23:59:59").toISOString()
        : null,
      maxRedemptions: form.maxRedemptions
        ? Number(form.maxRedemptions)
        : null,
    };

    try {
      const url = editing
        ? `/api/promo-codes/${editing.id}`
        : "/api/promo-codes";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");

      setShowForm(false);
      setEditing(null);
      setForm(emptyForm);
      router.refresh();
      const list = await fetch("/api/promo-codes").then((r) => r.json());
      setCodes(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Delete promo code "${code}"?`)) return;
    const res = await fetch(`/api/promo-codes/${id}`, { method: "DELETE" });
    if (res.ok) {
      setCodes((prev) => prev.filter((c) => c.id !== id));
      router.refresh();
    }
  };

  const toggleActive = async (promo: PromoCode) => {
    const res = await fetch(`/api/promo-codes/${promo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !promo.active }),
    });
    if (res.ok) {
      const updated = (await res.json()) as PromoCode;
      setCodes((prev) =>
        prev.map((c) => (c.id === promo.id ? updated : c))
      );
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl">Promo Codes</h1>
          <p className="mt-1 text-muted">
            Create codes customers enter at checkout for % off
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setForm(emptyForm);
            setShowForm(true);
            setError("");
          }}
          className="btn-primary"
        >
          <Plus className="h-4 w-4" />
          New Promo Code
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4 rounded-xl border bg-white p-6"
        >
          <h2 className="font-medium">
            {editing ? `Edit ${editing.code}` : "New promo code"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Code *</label>
              <input
                className="input-field uppercase"
                placeholder="SAVE10"
                value={form.code}
                onChange={(e) =>
                  setForm({ ...form, code: e.target.value.toUpperCase() })
                }
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Percent off *
              </label>
              <input
                type="number"
                min={1}
                max={100}
                className="input-field"
                value={form.percentOff}
                onChange={(e) =>
                  setForm({ ...form, percentOff: Number(e.target.value) })
                }
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium">
                Description
              </label>
              <input
                className="input-field"
                placeholder="Ramadan sale — 15% off"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Expires (optional)
              </label>
              <input
                type="date"
                className="input-field"
                value={form.expiresAt}
                onChange={(e) =>
                  setForm({ ...form, expiresAt: e.target.value })
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Max uses (optional)
              </label>
              <input
                type="number"
                min={1}
                className="input-field"
                placeholder="Unlimited"
                value={form.maxRedemptions}
                onChange={(e) =>
                  setForm({ ...form, maxRedemptions: e.target.value })
                }
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) =>
                  setForm({ ...form, active: e.target.checked })
                }
              />
              Active
            </label>
          </div>

          {error && (
            <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50"
            >
              {loading ? "Saving..." : editing ? "Update" : "Create"}
            </button>
            <button
              type="button"
              className="btn-outline"
              onClick={() => {
                setShowForm(false);
                setEditing(null);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-8 overflow-hidden rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Code</th>
              <th className="px-4 py-3 text-left font-medium">Off</th>
              <th className="px-4 py-3 text-left font-medium">Uses</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {codes.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-muted">
                  <Ticket className="mx-auto mb-2 h-8 w-8 text-gold" />
                  No promo codes yet. Create one for customers to use at
                  checkout.
                </td>
              </tr>
            ) : (
              codes.map((promo) => {
                const expired =
                  !!promo.expiresAt && new Date(promo.expiresAt) < new Date();
                return (
                  <tr key={promo.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-mono font-medium tracking-wide">
                        {promo.code}
                      </p>
                      {promo.description && (
                        <p className="text-xs text-muted">{promo.description}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-gold-dark">
                      {promo.percentOff}%
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {promo.redemptionCount}
                      {promo.maxRedemptions != null
                        ? ` / ${promo.maxRedemptions}`
                        : ""}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleActive(promo)}
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          !promo.active || expired
                            ? "bg-red-50 text-red-700"
                            : "bg-green-50 text-green-700"
                        }`}
                      >
                        {expired
                          ? "Expired"
                          : promo.active
                            ? "Active"
                            : "Inactive"}
                      </button>
                      {promo.expiresAt && (
                        <p className="mt-1 text-[10px] text-muted">
                          Until{" "}
                          {new Date(promo.expiresAt).toLocaleDateString("en-PK")}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(promo)}
                          className="rounded-lg p-2 text-muted hover:bg-cream hover:text-charcoal"
                          aria-label="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(promo.id, promo.code)}
                          className="rounded-lg p-2 text-muted hover:bg-red-50 hover:text-red-700"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
