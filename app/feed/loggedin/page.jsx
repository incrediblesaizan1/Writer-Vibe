import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Post from "@/lib/models/post.model";
import User from "@/lib/models/user.model";
import { verifyToken } from "@/lib/auth";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function FeedLoggedInPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    redirect("/login");
  }

  const data = verifyToken(token.value);
  if (!data) redirect("/login");

  await dbConnect();
  const posts = JSON.parse(
    JSON.stringify(await Post.find().populate("user").lean()),
  );
  const user = JSON.parse(
    JSON.stringify(await User.findOne({ email: data.email }).lean()),
  );
  const reversedPosts = [...posts].reverse();

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
              <a
                href="/api/logout"
                className="bg-red-500 rounded-md px-4 py-2 text-sm sm:text-base sm:mt-0 lg:mt-2"
              >
                Log-Out
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
        <div className="posts">
          <div className="flex flex-wrap w-full -mx-0 sm:mx-2">
            {reversedPosts.map((post) => (
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
                  <a className="flex gap-1" href={`/api/like/${post._id}`}>
                    <span className="relative bottom-1">
                      {post.likes.length}
                    </span>
                    <img
                      className="w-[19px] h-[19px]"
                      src={
                        post.likes.indexOf(user._id) !== -1
                          ? "/images/uploads/like.svg"
                          : "/images/uploads/unlike.svg"
                      }
                      alt=""
                    />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
