import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Post from "@/lib/models/post.model";
import { verifyToken } from "@/lib/auth";
import { editPost } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function EditPage({ params }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) redirect("/login");

  const data = verifyToken(token.value);
  if (!data) redirect("/login");

  await dbConnect();
  const { postId } = await params;
  const post = JSON.parse(
    JSON.stringify(await Post.findOne({ _id: postId }).lean()),
  );

  return (
    <div className="w-full min-h-screen bg-zinc-900 text-white content-center">
      <h1 className="text-3xl px-16 lg:px-56 py-4">Edit User</h1>
      <form action={editPost} className="flex flex-col items-center">
        <input type="hidden" name="postId" value={post._id} />
        <textarea
          name="content"
          className="p-3 bg-transparent border block outline-none w-2/3 resize-none px-3 py-2 my-1 rounded-md border-zinc-800"
          rows="6"
          defaultValue={post.content}
        ></textarea>
        <input
          className="px-5 py-2 my-1 w-2/3 lg:w-32 rounded-md bg-yellow-500"
          type="submit"
          value="Edit"
        />
      </form>
    </div>
  );
}
