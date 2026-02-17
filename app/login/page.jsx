"use client";

import { loginUser } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(formData) {
    const res = await loginUser(formData);
    if (res.success) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      router.push("/profile");
    } else {
      setError(res.error || "Login failed");
    }
  }

  return (
    <div className="overflow-auto min-h-screen text-white relative m-0">
      <div className="absolute inset-0 w-full bg-[url('/images/walpaper/08b89e75-c03a-41aa-9cb6-d3dd822cdfbe.jpg')] bg-cover bg-no-repeat bg-right-top brightness-[0.4] z-0"></div>
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
                href="/register"
                className="bg-green-500 rounded-md px-4 py-2 text-sm sm:text-base sm:mt-0 lg:mt-2"
              >
                Register
              </a>
            </div>
          </nav>
          <hr className="border-t border-gray-600 mx-5 sm:mt-[-34px] sm:ml-40 sm:mr-52 lg:mt-[-2.5rem]" />
        </header>
        <div className="content-center h-[80vh] flex flex-col justify-center">
          <h1 className="text-3xl px-6 lg:px-56 py-4">Login</h1>
          {error && <p className="text-red-500 px-6 lg:px-56">{error}</p>}
          <form action={handleSubmit} className="flex flex-col items-center">
            <input
              className="px-3 py-2 my-1 w-[90%] lg:w-2/3 rounded-md bg-transparent border-2 border-zinc-100 outline-none"
              type="text"
              name="identifier"
              placeholder="E-mail or Username"
              required
            />
            <input
              className="px-3 py-2 my-1 w-[90%] lg:w-2/3 rounded-md bg-transparent border-2 border-zinc-100 outline-none"
              type="password"
              name="password"
              placeholder="Password"
              required
            />
            <input
              className="px-5 py-2 my-1 w-32 rounded-md bg-yellow-500 cursor-pointer"
              type="submit"
              value="Login"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
