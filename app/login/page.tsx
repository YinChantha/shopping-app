"use client";

import { useState } from "react";
import { loginApi } from "../share/api";
import { useRouter } from "next/navigation";

export default function page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    loginApi(email, password)
      .then((token) => {
        localStorage.setItem("token", token);
        router.push("/products");
      })
      .catch((err) => {
        setError(err.message || "Login failed");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="mx-auto mt-10 max-w-md rounded-2xl bg-white p-6 shadow">
      <h1 className="text-2xl font-bold text-gray-500">Login</h1>

      <form onSubmit={handleLogin} className="mt-6 space-y-4">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Username"
          className="w-full rounded-lg border px-3 py-2 text-blue-500"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full rounded-lg border px-3 py-2 text-blue-500"
        />

        {error && (
          <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        <button
          disabled={loading}
          className="w-full rounded-lg bg-black px-4 py-2 text-white disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
