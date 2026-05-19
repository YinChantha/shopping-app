"use client";

import { useEffect, useState } from "react";
import { getProductByIdApi } from "../../share/api";
import { useParams } from "next/navigation";
import Link from "next/link";
import Loading from "@/app/components/Loading";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    getProductByIdApi(id as string)
      .then(setProduct)
      .catch(console.error);
  }, [id]);

  if (!product) return  <Loading />;

   return (
    <div className="mx-auto max-w-2xl space-y-4 rounded-2xl bg-white p-6 shadow">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Product Detail</h1>

        <Link href="/products" className="rounded-lg border px-4 py-2 text-sm">
          Back
        </Link>
      </div>

      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-72 w-full rounded-xl object-cover"
        />
      )}

      <div className="space-y-2 text-sm">
        <p><b>Name:</b> {product.name}</p>
        <p><b>Model:</b> {product.model}</p>
        <p><b>Description:</b> {product.description}</p>
        <p><b>Price:</b> ${product.price}</p>
        <p><b>Stock:</b> {product.stock}</p>
        <p><b>Status:</b> {product.isActive ? "Active" : "Inactive"}</p>
      </div>
    </div>
  );
}
