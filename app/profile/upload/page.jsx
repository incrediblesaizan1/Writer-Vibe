import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import User from "@/lib/models/user.model";
import { verifyToken } from "@/lib/auth";
import { uploadDp } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function UploadPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) redirect("/login");

  const data = verifyToken(token.value);
  if (!data) redirect("/login");

  await dbConnect();
  const user = JSON.parse(
    JSON.stringify(await User.findOne({ email: data.email }).lean()),
  );

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
          action={uploadDp}
          className="flex justify-center items-center"
          encType="multipart/form-data"
        >
          <input type="file" name="image" className="w-24 lg:w-[50%]" />
          <input
            className="px-5 py-2 my-1 w-32 rounded-md bg-blue-500"
            type="submit"
            value="Upload Image"
          />
        </form>
      </div>
    </div>
  );
}
