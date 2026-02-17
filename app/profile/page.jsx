"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getProfileData, createPost, deletePost } from "@/lib/actions";
import { formatDate } from "@/lib/utils";
import Loader from "@/components/Loader";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [walpaper, setWalpaper] = useState(null);
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
        setWalpaper(res.walpaper);
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
      }
      setLoading(false);
    }
    fetchData();
  }, [router]);

  async function handleCreatePost(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const formData = new FormData(e.target);
    formData.append("token", token);

    const res = await createPost(formData);
    if (res.success) {
      // Re-fetch data to show new post
      const dataRes = await getProfileData(token);
      if (dataRes.success) {
        setUser(dataRes.user);
      }
      e.target.reset(); // Clear form
    } else {
      alert("Failed to create post");
    }
  }

  function handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }

  if (loading) {
    return <Loader />;
  }

  if (!user) return null; // Should redirect

  return (
    <div className="w-full min-h-screen text-white relative custom-scrollbar">
      <div
        className="absolute inset-0 bg-cover bg-no-repeat bg-right-top brightness-[0.3] z-0"
        style={{
          backgroundImage: `url('/images/walpaper/${walpaper || "8705b956-9dc9-4577-beb2-38b6a66c7b85.jpg"}')`,
        }}
      ></div>

      <div className="relative z-10">
        <header>
          <nav className="flex justify-between sm:flex-row sm:items-center sm:justify-between sticky top-0 z-10 p-5">
            <h1 className="text-2xl sm:text-3xl">WriteVibe</h1>
            <div className="flex gap-3">
              <a
                href="/feed"
                className="bg-green-200 text-black rounded-md px-4 py-2 text-sm sm:text-base sm:mt-0 lg:mt-2"
              >
                Writes
              </a>
              <button
                onClick={handleLogout}
                className="bg-red-500 rounded-md px-4 py-2 text-sm sm:text-base sm:mt-0 lg:mt-2"
              >
                Logout
              </button>
            </div>
          </nav>
          <hr className="border-t border-gray-600 mx-5 sm:mt-[-34px] sm:ml-40 sm:mr-52 lg:mt-[-2.5rem]" />
        </header>

        <div className="p-10">
          <div className="flex items-start">
            <h1 className="text-[23px] relative top-8 lg:top-12 lg:text-4xl">
              Hello,{" "}
              <span className="text-blue-400 capitalize">{user.name}</span>
            </h1>
            <a
              href="/profile/upload"
              className="w-24 mt-[-10px] relative top-[20px] h-24 ml-4 lg:w-28 lg:h-28"
            >
              <img
                className="w-full h-full rounded-full object-cover"
                src={`/images/uploads/${user.dp}`}
                alt=""
              />
            </a>
          </div>

          <h5 className="mb-5 text-xl text-gray-400">You can create a post.</h5>

          <form onSubmit={handleCreatePost}>
            <textarea
              placeholder="What's on your mind?"
              className="p-3 bg-transparent border block outline-none resize-none w-full sm:w-1/3"
              rows="5"
              cols="30"
              name="content"
              required
            ></textarea>
            <input
              type="submit"
              className="cursor-pointer px-3 py-2 mt-2 w-full sm:w-40 bg-blue-500 rounded-md"
              value="Create new post"
            />
          </form>

          <div className="posts mt-10">
            <h1 className="text-2xl font-bold">Your Writes</h1>
            <hr className="mb-6 border-t border-gray-600 sm:ml-32" />

            <div className="flex flex-wrap w-full -mx-0 sm:mx-2">
              {user.post.map((post) => (
                <div
                  key={post._id}
                  className="post mb-4 sm:m-2 border rounded-lg min-h-40 max-h-56 w-full sm:w-[48%] lg:w-[32%] flex flex-col"
                >
                  <div className="flex justify-between p-2">
                    <h5 className="text-blue-500">@{user.username}</h5>
                    <h5 className="text-gray-500 text-xs sm:text-sm">
                      {formatDate(post.date)}
                    </h5>
                  </div>
                  <div className="overflow-auto flex-grow p-2 custom-scrollbar2">
                    <p className="tracking-tighter mb-2">{post.content}</p>
                  </div>
                  <div className="flex justify-between p-2 border-t mt-auto">
                    <button
                      onClick={async () => {
                        if (
                          confirm("Are you sure you want to delete this post?")
                        ) {
                          const token = localStorage.getItem("token");
                          if (token) {
                            const res = await deletePost(post._id, token);
                            if (res.success) {
                              const dataRes = await getProfileData(token);
                              if (dataRes.success) setUser(dataRes.user);
                            } else {
                              alert("Failed to delete post");
                            }
                          }
                        }
                      }}
                      className="text-red-500 font-semibold"
                    >
                      Delete
                    </button>
                    <a
                      href={`/edit/${post._id}`}
                      className="text-gray-500 font-bold"
                    >
                      Edit
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
