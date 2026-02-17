"use client";

import { useRouter, useParams } from "next/navigation"; // useParams is better for client components usually
import { useEffect, useState, use } from "react";
import { getPost, editPost } from "@/lib/actions";

export default function EditPage({ params }) {
  const router = useRouter();
  // Unwrap params if needed, but useParams() is easier in Client Components usually.
  // However, since it is passed as prop, we can use use() hook or just await it if it was server component.
  // standard Next.js 15+ way for Client Component receiving params: use(params) or just use useParams hook.
  const { postId } = use(params);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await getPost(postId, token);
      if (res.success) {
        setPost(res.post);
      } else {
        alert(res.error || "Failed to load post");
        router.push("/profile");
      }
      setLoading(false);
    }
    fetchPost();
  }, [postId, router]);

  async function handleEdit(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const formData = new FormData(e.target);
    formData.append("token", token);
    formData.append("postId", postId);

    const res = await editPost(formData);
    if (res.success) {
      router.push("/profile");
    } else {
      alert("Failed to edit post");
    }
  }

  if (loading) return <div className="text-white p-10">Loading...</div>;
  if (!post) return null;

  return (
    <div className="w-full min-h-screen bg-zinc-900 text-white content-center">
      <h1 className="text-3xl px-16 lg:px-56 py-4">Edit User</h1>
      <form onSubmit={handleEdit} className="flex flex-col items-center">
        <textarea
          name="content"
          className="p-3 bg-transparent border block outline-none w-2/3 resize-none px-3 py-2 my-1 rounded-md border-zinc-800"
          rows="6"
          defaultValue={post.content}
          required
        ></textarea>
        <input
          className="px-5 py-2 my-1 w-2/3 lg:w-32 rounded-md bg-yellow-500 cursor-pointer"
          type="submit"
          value="Edit"
        />
      </form>
    </div>
  );
}
