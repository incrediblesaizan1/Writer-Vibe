import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Post from "@/lib/models/post.model";
import User from "@/lib/models/user.model";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function FeedPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (token) {
    redirect("/feed/loggedin");
  }

  await dbConnect();
  const posts = JSON.parse(
    JSON.stringify(await Post.find().populate("user").lean()),
  );
  const reversedPosts = [...posts].reverse();

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
        <div className="posts overflow-hidden">
          <div className="flex flex-wrap w-full -mx-0 sm:mx-2">
            {reversedPosts.map((post) => (
              <div
                key={post._id}
                className="post mb-4 sm:m-2 border rounded-lg min-h-40 max-h-56 w-full sm:w-[48%] lg:w-[32%] flex flex-col"
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
