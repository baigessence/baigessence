"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Product, Category } from "@/lib/types";
import ProductImageUpload from "./ProductImageUpload";

const defaultNotes = { top: "", heart: "", base: "" };

type ProductFormProps = {
  product?: Product;
};

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: product?.name ?? "",
    description: product?.description ?? "",
    shortDescription: product?.shortDescription ?? "",
    category: product?.category ?? "unisex",
    price: product?.price ?? 0,
    compareAtPrice: product?.compareAtPrice ?? "",
    image: product?.image ?? "",
    images: product?.images?.join("\n") ?? "",
    notes: product?.notes ?? defaultNotes,
    size: product?.size ?? "50ml",
    concentration: product?.concentration ?? "EDP",
    inStock: product?.inStock ?? true,
    featured: product?.featured ?? false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.image.trim()) {
      setError("Please upload a product image");
      return;
    }

    setLoading(true);
    setError("");

    const imageList = form.images
      ? form.images.split("\n").map((s) => s.trim()).filter(Boolean)
      : [];

    const allImages = imageList.includes(form.image)
      ? imageList
      : [form.image, ...imageList];

    const payload = {
      name: form.name,
      description: form.description,
      shortDescription: form.shortDescription,
      category: form.category,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
      image: form.image,
      images: allImages.length > 0 ? allImages : [form.image],
      notes: form.notes,
      size: form.size,
      concentration: form.concentration,
      inStock: form.inStock,
      featured: form.featured,
    };

    try {
      const url = product ? `/api/products/${product.id}` : "/api/products";
      const method = product ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/admin/products");
        router.refresh();
      } else {
        setError("Failed to save product");
      }
    } catch {
      setError("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium">Product Name *</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input-field"
            required
          />
        </div>

        <ProductImageUpload
          mainImage={form.image}
          additionalImages={form.images}
          onMainImageChange={(url) => setForm({ ...form, image: url })}
          onAdditionalImagesChange={(urls) => setForm({ ...form, images: urls })}
        />

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium">Short Description</label>
          <input
            value={form.shortDescription}
            onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
            className="input-field"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium">Full Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input-field min-h-24"
            rows={4}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Category *</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
            className="input-field"
          >
            <option value="male">For Him</option>
            <option value="female">For Her</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Size</label>
          <input
            value={form.size}
            onChange={(e) => setForm({ ...form, size: e.target.value })}
            className="input-field"
            placeholder="50ml"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Price (Rs.) *</label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            className="input-field"
            required
            min={0}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Compare at Price (Rs.)</label>
          <input
            type="number"
            value={form.compareAtPrice}
            onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })}
            className="input-field"
            min={0}
            placeholder="Original price for sale display"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Concentration</label>
          <select
            value={form.concentration}
            onChange={(e) => setForm({ ...form, concentration: e.target.value })}
            className="input-field"
          >
            <option value="EDT">EDT</option>
            <option value="EDP">EDP</option>
            <option value="Parfum">Parfum</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Top Notes</label>
          <input
            value={form.notes.top}
            onChange={(e) =>
              setForm({ ...form, notes: { ...form.notes, top: e.target.value } })
            }
            className="input-field"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Heart Notes</label>
          <input
            value={form.notes.heart}
            onChange={(e) =>
              setForm({ ...form, notes: { ...form.notes, heart: e.target.value } })
            }
            className="input-field"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Base Notes</label>
          <input
            value={form.notes.base}
            onChange={(e) =>
              setForm({ ...form, notes: { ...form.notes, base: e.target.value } })
            }
            className="input-field"
          />
        </div>

        <div className="flex items-center gap-6 sm:col-span-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.inStock}
              onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
              className="h-4 w-4 accent-gold"
            />
            In Stock
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="h-4 w-4 accent-gold"
            />
            Featured (Best Seller)
          </label>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
          {loading ? "Saving..." : product ? "Update Product" : "Create Product"}
        </button>
        <Link href="/admin/products" className="btn-outline">
          Cancel
        </Link>
      </div>
    </form>
  );
}
