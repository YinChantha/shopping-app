"use client";

import {  useEffect, useState } from "react";
import ProductTable from "../components/ProductTable";
import Pagination from "../components/Pagination";
import {
  createProductApi,
  deleteProductApi,
  getProductsApi,
  Product,
  ProductFormData,
  ProductMeta,
  updateProductApi,
} from "../share/api";
import { useRouter } from "next/navigation";
import { requireAuth } from "../share/heper";
import ProductForm from "../components/ProductForm";
import { MODEL_OPTIONS } from "../share/type";

const emptyMeta: ProductMeta = {
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  hasNext: false,
  hasPrev: false,
}; // this is initail when page load, before fetch data from api, to avoid undefined error for meta

export default function ProductsPage() {
 const router = useRouter();
  const [items, setItems] = useState<Product[]>([]);
  const [meta, setMeta] = useState<ProductMeta>(emptyMeta);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [nameFilter, setNameFilter] = useState("");
  const [modelFilter, setModelFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    setError("");

    const res = await getProductsApi({
      page,
      limit,
      name: nameFilter,
      model: modelFilter,
      isActive: activeFilter,
    });

    setItems(res.data);
    setMeta(res.meta);
    setLoading(false);
  };

  // when initail load if no token
  useEffect(() => {
    requireAuth(router); // this will check token in localStorage, if no token it will redirect to login page
  }, []);

  // for pagination, filter
  useEffect(() => {
    loadProducts().catch((err) => setError(err.message));
  }, [page, limit]);

  const openCreate = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const openEdit = (item: Product) => {
    setEditingProduct(item);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (form: ProductFormData) => {
    setSaving(true);
    setError("");

    const payload = {
      name: form.name,
      model: form.model,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
      isActive: form.isActive,
      image: form.image,
    };

    const action = editingProduct
      ? updateProductApi(editingProduct._id, payload)
      : createProductApi(payload);

    await action.catch((err) => {
      setError(err.message);
      throw err;
    });

    closeForm();
    await loadProducts().catch((err) => setError(err.message));
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete?")) return;

    setError("");

    await deleteProductApi(id).catch((err) => {
      setError(err.message);
      throw err;
    });

    await loadProducts().catch((err) => setError(err.message));
  };

  const handleSearch = async () => {
    setPage(1);
    await loadProducts().catch((err) => setError(err.message));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="space-y-6 p-16 ">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-gray-500">
            Simple CRUD table with pagination
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleLogout}
            className="rounded-lg border px-4 py-2 text-sm"
          >
            Logout
          </button>
          <button
            onClick={openCreate}
            className="rounded-lg bg-black px-4 py-2 text-sm text-white"
          >
            Add Product
          </button>
        </div>
      </div>

      {/* search  */}
      <div className="rounded-2xl bg-white p-4 shadow">
        <div className="grid gap-3 md:grid-cols-4">
          <input
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            placeholder="Search by name"
            className="rounded-lg border px-3 py-2"
          />

          <select
            value={modelFilter}
            onChange={(e) => setModelFilter(e.target.value)}
            className="rounded-lg border px-3 py-2"
          >
            <option value="">All Models</option>
            {MODEL_OPTIONS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          {/* <input
            value={modelFilter}
            onChange={(e) => setModelFilter(e.target.value)}
            placeholder="Search by model"
            className="rounded-lg border px-3 py-2"
          /> */}
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="rounded-lg border px-3 py-2"
          >
            <option value="">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <button
            onClick={handleSearch}
            className="rounded-lg bg-gray-900 px-4 py-2 text-white"
          >
            Search
          </button>
        </div>
      </div>

      <ProductForm
        open={formOpen}
        editingProduct={editingProduct}
        onClose={closeForm}
        onSubmit={handleSubmit}
        saving={saving}
      />

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <ProductTable
        items={items}
        loading={loading}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

       <div className="mt-4 flex items-center gap-3">
          <span className="text-sm text-gray-600">Limit:</span>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="rounded-lg border px-3 py-2"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>

      <Pagination
        meta={meta}
        onPrev={() => setPage((p) => p - 1)}
        onNext={() => setPage((p) => p + 1)}
      />
    </div>
  );
}
