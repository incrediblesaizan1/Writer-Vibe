"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getFeedData, likePost } from "@/lib/actions";
import { formatDate } from "@/lib/utils";

export default function FeedLoggedInPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await getFeedData(token);
      if (res.success) {
        setUser(res.user);
        setPosts(res.posts.reverse());
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
      }
      setLoading(false);
    }
    fetchData();
  }, [router]);

  async function handleLike(postId) {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const res = await likePost(postId, token);
    if (res.success) {
      // Refresh feed to show updated likes
      const dataRes = await getFeedData(token);
      if (dataRes.success) {
        setPosts(dataRes.posts.reverse());
      }
    } else {
      alert("Failed to like post");
    }
  }

  function handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login"); // or feed? Original was redirect to feed?
    // Original logout api redirected to /feed.
    // But /feed redirects to /feed/loggedin if token exists.
    // If we clear token, /feed is fine.
    router.push("/feed");
  }

  if (loading) return <div className="text-white p-10">Loading...</div>;
  if (!user) return null;

  return (
    <div className="overflow-x-hidden overflow-y-auto min-h-screen text-white relative m-0">
      <div className="absolute inset-0 w-full h-full bg-[url('/images/walpaper/BB1msMpy.jpg')] bg-cover bg-no-repeat bg-right-top brightness-[0.3] z-0"></div>
      <div className="relative z-10">
        <header>
          <nav className="flex justify-between sm:flex-row sm:items-center sm:justify-between sticky top-0 z-10 p-5">
            <h1 className="text-2xl sm:text-3xl">WriteVibe</h1>
            <div className="flex gap-3">
              <a
                href="/profile"
                className="bg-green-500 rounded-md px-4 py-2 text-sm sm:text-base sm:mt-0 lg:mt-2"
              >
                Profile
              </a>
              <button
                onClick={handleLogout}
                className="bg-red-500 rounded-md px-4 py-2 text-sm sm:text-base sm:mt-0 lg:mt-2"
              >
                Log-Out
              </button>
            </div>
          </nav>
          <hr className="border-t border-gray-600 mx-5 sm:mt-[-34px] sm:ml-40 sm:mr-52 lg:mt-[-2.5rem]" />
        </header>

        <div className="p-10">
          <h1 className="text-3xl">
            <span className="text-3xl text-blue-300">Writes</span>~
          </h1>
        </div>
        <div className="posts">
          <div className="flex flex-wrap w-full -mx-0 sm:mx-2">
            {posts.map((post) => (
              <div
                key={post._id}
                className="post mb-4 sm:m-2 border rounded-lg min-h-40 max-h-56 w-full sm:w-[48%] lg:w-[32%] flex flex-col custom-scrollbar2"
              >
                <div className="flex justify-between p-2">
                  <div className="flex items-center">
                    <img
                      className="w-[32px] h-[32px] rounded-full object-cover mr-1"
                      src={`/images/uploads/${post.user.dp}`}
                      alt="user"
                    />
                    <h5 className="text-blue-500">@{post.user.username}</h5>
                  </div>
                  <h5 className="text-gray-500 text-xs sm:text-sm">
                    {formatDate(post.date)}
                  </h5>
                </div>
                <div className="overflow-auto flex-grow p-2 custom-scrollbar2">
                  <p className="tracking-tighter">{post.content}</p>
                </div>
                <div className="flex justify-between bg-transparent rounded-bl-md rounded-br-md p-2 border-t mt-auto">
                  <button
                    className="flex gap-1"
                    onClick={() => handleLike(post._id)}
                  >
                    <span className="relative bottom-1">
                      {post.likes.length}
                    </span>
                    <img
                      className="w-[19px] h-[19px]"
                      src={
                        post.likes.indexOf(user?._id) !== -1
                          ? "/images/uploads/like.svg"
                          : "/images/uploads/unlike.svg"
                      }
                      alt=""
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
