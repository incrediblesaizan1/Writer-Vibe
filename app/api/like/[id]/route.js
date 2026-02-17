import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Post from '@/lib/models/post.model';
import User from '@/lib/models/user.model';
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
  const { id } = await params;

  const post = await Post.findOne({ _id: id }).populate('user');
  if (post.likes.indexOf(data.userid) === -1) {
    post.likes.push(data.userid);
  } else {
    post.likes.splice(post.likes.indexOf(data.userid), 1);
  }
  await post.save();

  return NextResponse.redirect(new URL('/feed/loggedin', request.url));
}
