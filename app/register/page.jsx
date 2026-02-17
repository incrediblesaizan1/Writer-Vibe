"use client";

import { registerUser } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Loader from "@/components/Loader";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData) {
    setLoading(true);
    setError("");
    const res = await registerUser(formData);
    if (res.success) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      router.push("/profile");
    } else {
      setError(res.error || "Registration failed");
      setLoading(false);
    }
  }

  return (
    <div className="overflow-auto min-h-screen text-white relative m-0">
      {loading && <Loader />}
      <div className="absolute inset-0 w-full bg-[url('/images/walpaper/99961c08-17f1-4c4b-9cca-4fcb39f1b6dd.jpg')] bg-cover bg-no-repeat bg-right-top brightness-[0.3] z-0"></div>
      <div className="relative z-10">
        <header>
          <nav className="flex justify-between sm:flex-row sm:items-center sm:justify-between sticky top-0 z-10 p-5">
            <h1 className="text-2xl sm:text-3xl">WriteVibe</h1>
            <div className="flex gap-3">
              <a
                href="/"
                className="bg-green-500 rounded-md px-4 py-2 text-sm sm:text-base sm:mt-0 lg:mt-2"
              >
                Home
              </a>
              <a
                href="/login"
                className="bg-green-500 rounded-md px-4 py-2 text-sm sm:text-base sm:mt-0 lg:mt-2"
              >
                Log-In
              </a>
            </div>
          </nav>
          <hr className="border-t border-gray-600 mx-5 sm:mt-[-34px] sm:ml-40 sm:mr-52 lg:mt-[-2.5rem]" />
        </header>
        <div className="content-center h-[80vh] flex flex-col justify-center">
          <h1 className="text-2xl px-5 lg:px-56 py-4">Create Account</h1>
          {error && <p className="text-red-500 px-5 lg:px-56">{error}</p>}
          <form action={handleSubmit} className="flex flex-col items-center">
            <input
              className="px-3 py-2 my-1 w-[90%] lg:w-2/3 rounded-md bg-transparent border-2 border-zinc-400 outline-none"
              type="text"
              name="name"
              placeholder="name"
              required
            />
            <input
              className="px-3 py-2 my-1 w-[90%] lg:w-2/3 rounded-md bg-transparent border-2 border-zinc-400 outline-none"
              type="text"
              name="username"
              placeholder="username"
              required
            />
            <input
              className="px-3 py-2 my-1 w-[90%] lg:w-2/3 rounded-md bg-transparent border-2 border-zinc-400 outline-none"
              type="email"
              name="email"
              placeholder="email"
              required
            />
            <input
              className="px-3 py-2 my-1 w-[90%] lg:w-2/3 rounded-md bg-transparent border-2 border-zinc-400 outline-none"
              type="number"
              name="age"
              placeholder="age"
              required
            />
            <input
              className="px-3 py-2 my-1 w-[90%] lg:w-2/3 rounded-md bg-transparent border-2 border-zinc-400 outline-none"
              type="password"
              name="password"
              placeholder="password"
              required
            />
            <input
              className="px-5 py-2 my-1 w-[90%] lg:w-32 rounded-md bg-blue-500 cursor-pointer"
              type="submit"
              value="Create User"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
