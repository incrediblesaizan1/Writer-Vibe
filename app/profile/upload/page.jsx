"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { uploadDp, getProfileData } from "@/lib/actions";
import Loader from "@/components/Loader";

export default function UploadPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await getProfileData(token);
      if (res.success) {
        setUser(res.user);
      } else {
        router.push("/login");
      }
      setLoading(false);
    }
    fetchData();
  }, [router]);

  async function handleUpload(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const formData = new FormData(e.target);
    formData.append("token", token);

    const res = await uploadDp(formData);
    if (res.success) {
      // Refresh to show new image
      const dataRes = await getProfileData(token);
      if (dataRes.success) {
        setUser(dataRes.user);
      }
    } else {
      alert("Upload failed");
    }
  }

  if (loading) return <Loader />;
  if (!user) return null;

  return (
    <div className="w-full min-h-screen text-white bg-[url('/images/download.svg')] bg-cover bg-center h-screen">
      <header>
        <nav className="flex justify-between sticky top-0 z-10 p-5">
          <h1 className="text-3xl ml-1">WriteVibe</h1>
          <a
            href="/profile"
            className="bg-blue-200 text-black rounded-md px-3 py-2 relative top-[3px] text-sm mb-5 inline-block"
          >
            Profile
          </a>
        </nav>
        <hr className="mt-[-54px] ml-40 mr-24" />
      </header>
      <div className="content-center h-[80vh] flex flex-col justify-center">
        <div className="w-56 h-56 mx-auto mb-[-10px] mt-[-10px] bg-red-500 rounded-full">
          <img
            className="w-full h-full rounded-full object-cover"
            src={`/images/uploads/${user.dp}`}
            alt=""
          />
        </div>
        <h1 className="text-xl lg:text-3xl px-6 lg:px-56 py-4">
          Upload Profile Picture
        </h1>
        <form
          onSubmit={handleUpload}
          className="flex justify-center items-center"
          encType="multipart/form-data"
        >
          <input
            type="file"
            name="image"
            className="w-24 lg:w-[50%]"
            required
          />
          <input
            className="px-5 py-2 my-1 w-32 rounded-md bg-blue-500 cursor-pointer"
            type="submit"
            value="Upload Image"
          />
        </form>
      </div>
    </div>
  );
}
