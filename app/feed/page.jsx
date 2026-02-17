"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function FeedPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/feed/loggedin");
    }
  }, [router]);

  return (
    <div className="overflow-auto min-h-screen text-white relative m-0 custom-scrollbar">
      <div className="absolute inset-0 w-full bg-[url('/images/walpaper/8705b956-9dc9-4577-beb2-38b6a66c7b85.jpg')] bg-cover bg-no-repeat bg-right-top brightness-[0.3] z-0"></div>
      <div className="relative z-10">
        <header>
          <nav className="flex justify-between sm:flex-row sm:items-center sm:justify-between sticky top-0 z-10 p-5">
            <h1 className="text-2xl sm:text-3xl">WriteVibe</h1>
            <div className="flex gap-3">
              <a
                href="/register"
                className="bg-green-500 rounded-md px-4 py-2 text-sm sm:text-base sm:mt-0 lg:mt-2"
              >
                Register
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

        <div className="p-10">
          <h1 className="text-3xl">
            <span className="text-3xl text-blue-300">Writes</span>~
          </h1>
        </div>
      </div>
    </div>
  );
}
