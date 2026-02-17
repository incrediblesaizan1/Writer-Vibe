import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Post from '@/lib/models/post.model';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(request, { params }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const data = verifyToken(token.value);
  if (!data) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  await dbConnect();
  const { postId } = await params;

  await Post.findOneAndDelete({ _id: postId });

  return NextResponse.redirect(new URL('/profile', request.url));
}
