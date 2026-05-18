import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-white">
      <h1 className="text-3xl text-blue-600">Hello welcome to my shopping app</h1>
            <div className="mt-6 flex gap-3">
        <Link href="/login" className="rounded-lg border px-4 py-2 text-green-500">
          Login
        </Link>
        <Link
          href="/products"
          className="rounded-lg bg-black px-4 py-2 text-white"
        >
          Products
        </Link>
      </div>
    </div>
  );
}
