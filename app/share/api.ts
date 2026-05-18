// const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
export const API_BASE = "https://api-cr-shop.onrender.com";

export interface Product {
  _id: string;
  name: string;
  model: string;
  description: string;
  price: number;
  stock: number;
  isActive: boolean;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ProductListResponse {
  data: Product[];
  meta: ProductMeta;
}

export interface ProductFormData {
  name: string;
  model: string;
  description: string;
  price: string;
  stock: string;
  isActive: boolean;
  image: File | null;
}

export const emptyProductForm: ProductFormData = {
  name: "",
  model: "",
  description: "",
  price: "",
  stock: "",
  isActive: true,
  image: null as any,
};

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function authHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function loginApi(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Login failed");
  }

  const token = data?.access_token

  if (!token) {
    throw new Error("Token not found in response");
  }

  return token;
}

export async function getProductsApi(params: {
  page: number;
  limit: number;
  name?: string;
  model?: string;
  isActive?: string;
}) {
  const query = new URLSearchParams();
  query.set("page", String(params.page));
  query.set("limit", String(params.limit));

  if (params.name?.trim()) query.set("name", params.name.trim());
  if (params.model?.trim()) query.set("model", params.model.trim());
  if (params.isActive !== undefined && params.isActive !== "") {
    query.set("isActive", params.isActive);
  }

  const res = await fetch(`${API_BASE}/products?${query.toString()}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to load products");
  }

  return data as ProductListResponse;
}

export async function getProductByIdApi(id: string) {
  const res = await fetch(`${API_BASE}/products/${id}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to load product");
  }

  return data;
}

export async function createProductApi(payload: {
  name: string;
  model: string;
  description: string;
  price: number;
  stock: number;
  isActive: boolean;
  image: File | null;
}) {
  const formData = new FormData();

  formData.append("name", payload.name);
  formData.append("model", payload.model);
  formData.append("description", payload.description);
  formData.append("price", String(payload.price));
  formData.append("stock", String(payload.stock));
  formData.append("isActive", String(payload.isActive));

  if (payload.image) {
    formData.append("image", payload.image);
  }

  const res = await fetch(`${API_BASE}/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Create failed");

  return data;
}

export async function updateProductApi(
  id: string,
  payload: {
    name: string;
    model: string;
    description: string;
    price: number;
    stock: number;
    isActive: boolean;
    image: File | null;
  },
) {
  const formData = new FormData();

  formData.append("name", payload.name);
  formData.append("model", payload.model);
  formData.append("description", payload.description);
  formData.append("price", String(payload.price));
  formData.append("stock", String(payload.stock));
  formData.append("isActive", String(payload.isActive));

  if (payload.image) {
    formData.append("image", payload.image);
  }

  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Update failed");

  return data;
}

export async function deleteProductApi(id: string) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Delete failed");
  }

  return data;
}
