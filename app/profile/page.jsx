import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import fs from "fs";
import path from "path";
import dbConnect from "@/lib/db";
import User from "@/lib/models/user.model";
import Post from "@/lib/models/post.model";
import { verifyToken } from "@/lib/auth";
import { createPost } from "@/lib/actions";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    redirect("/login");
  }

  const data = verifyToken(token.value);
  if (!data) redirect("/login");

  await dbConnect();
  const user = JSON.parse(
    JSON.stringify(
      await User.findOne({
        $or: [{ email: data.email }, { username: data.username }],
      }).populate("post"),
    ),
  );

  // Get random wallpaper
  const walpaperDir = path.join(process.cwd(), "public", "images", "walpaper");
  const files = fs.readdirSync(walpaperDir);
  const walpaper = files[Math.floor(Math.random() * files.length)];

  const reversedPosts = [...user.post].reverse();

  return (
    <div className="w-full min-h-screen text-white relative custom-scrollbar">
      <div
        className="absolute inset-0 bg-cover bg-no-repeat bg-right-top brightness-[0.3] z-0"
        style={{ backgroundImage: `url('/images/walpaper/${walpaper}')` }}
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
              <a
                href="/api/logout"
                className="bg-red-500 rounded-md px-4 py-2 text-sm sm:text-base sm:mt-0 lg:mt-2"
              >
                Logout
              </a>
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

          <form action={createPost}>
            <textarea
              placeholder="What's on your mind?"
              className="p-3 bg-transparent border block outline-none resize-none w-full sm:w-1/3"
              rows="5"
              cols="30"
              name="content"
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
              {reversedPosts.map((post) => (
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
                    <a
                      href={`/api/delete/${post._id}`}
                      className="text-red-500 font-semibold"
                    >
                      Delete
                    </a>
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
