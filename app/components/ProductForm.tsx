"use client";

import { useEffect, useState } from "react";
import type { Product, ProductFormData } from "../share/api";
import { emptyProductForm } from "../share/api";
import { MODEL_OPTIONS } from "../share/type";

type Props = {
  open: boolean;
  editingProduct: Product | null;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => void;
  saving?: boolean;
};

export default function ProductForm({
  open,
  editingProduct,
  onClose,
  onSubmit,
  saving,
}: Props) {
  const [form, setForm] = useState<ProductFormData>(emptyProductForm);
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    if (editingProduct) {
      setForm({
        name: editingProduct.name,
        model: editingProduct.model,
        description: editingProduct.description,
        price: String(editingProduct.price),
        stock: String(editingProduct.stock),
        isActive: editingProduct.isActive,
        image: null as any,
      });

      setPreview(editingProduct.imageUrl || "");
    } else {
      setForm(emptyProductForm);
      setPreview("");
    }
  }, [editingProduct, open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const handleFileChange = (file: File | null) => {
    if (file) {
      setForm({ ...form, image: file as any });
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="rounded-2xl bg-white p-5 shadow">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {editingProduct ? "Edit Product" : "Create Product"}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-sm text-gray-500"
        >
          Close
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Name"
          className="rounded-lg border px-3 py-2"
        />

        <select
          value={form.model}
          onChange={(e) => setForm({ ...form, model: e.target.value })}
          className="rounded-lg border px-3 py-2"
        >
          <option value="">Select Model</option>

          {MODEL_OPTIONS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <input
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          placeholder="Price"
          type="number"
          className="rounded-lg border px-3 py-2"
        />

        <input
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          placeholder="Stock"
          type="number"
          className="rounded-lg border px-3 py-2"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
          className="rounded-lg border px-3 py-2 md:col-span-2"
        />

        {preview && (
          <div className="md:col-span-2">
            <p className="mb-2 text-sm text-gray-500">Preview</p>
            <img
              src={preview}
              alt="preview"
              className="h-40 w-40 rounded-lg border object-cover"
            />
          </div>
        )}

        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description"
          className="min-h-24 rounded-lg border px-3 py-2 md:col-span-2"
        />

        <label className="flex items-center gap-2 md:col-span-2">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          />
          Active
        </label>

        <button
          disabled={saving}
          className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-60 md:col-span-2"
        >
          {saving ? "Saving..." : editingProduct ? "Update" : "Create"}
        </button>
      </form>
    </div>
  );
}
