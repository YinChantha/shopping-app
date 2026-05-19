import Link from "next/link";
import type { Product } from "../share/api";
import Loading from "./Loading";

 export const HEADER = ["Image", "Name", "Model", "Price", "Stock", "Status", "Actions"];

type Props = {
  items: Product[];
  loading?: boolean;
  onEdit: (item: Product) => void;
  onDelete: (id: string) => void;
};

export default function ProductTable({
  items,
  loading,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-100">
            <tr>
                {HEADER.map((head) => (
                    <th key={head} className="px-4 py-3">{head}</th>
                ))}
            </tr>
          {/* <tr>
            <th className="px-4 py-3">Image</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Model</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr> */}
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td className="px-4 py-4" colSpan={6}>
                <Loading />
              </td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td className="px-4 py-4" colSpan={6}>
                No products found
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item._id} className="border-t">
                <td className="px-4 py-3">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                  )}
                </td>
                <td className="px-4 py-3 text-green-600">
                    <Link href={`/products/${item._id}`}>
                        {item.name}
                    </Link>
                </td>
                <td className="px-4 py-3">{item.model}</td>
                <td className="px-4 py-3">${item.price}</td>
                <td className="px-4 py-3">{item.stock}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      item.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {item.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="rounded-lg border px-3 py-1.5"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(item._id)}
                      className="rounded-lg bg-red-600 px-3 py-1.5 text-white"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}