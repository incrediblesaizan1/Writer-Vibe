'use server'

import { redirect } from 'next/navigation';
import bcrypt from 'bcrypt';
import dbConnect from '@/lib/db';
import User from '@/lib/models/user.model';
import Post from '@/lib/models/post.model';
import { createToken, getCurrentUser } from '@/lib/auth';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs/promises';

export async function registerUser(formData) {
  await dbConnect();

  const username = formData.get('username');
  const name = formData.get('name');
  const email = formData.get('email');
  const password = formData.get('password');
  const age = formData.get('age');

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    redirect('/register');
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await User.create({
    username, name, email, age, password: hash
  });

  const token = createToken({ email, userid: user._id });

  const cookieStore = await cookies();
  cookieStore.set('token', token, { path: '/' });
  redirect('/profile');
}

export async function loginUser(formData) {
  await dbConnect();

  const identifier = formData.get('identifier');
  const password = formData.get('password');

  const user = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }]
  });

  if (!user) {
    redirect('/login');
    return;
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    redirect('/login');
    return;
  }

  const token = createToken({
    email: user.email,
    username: user.username,
    userid: user._id
  });

  const cookieStore = await cookies();
  cookieStore.set('token', token, { path: '/' });
  redirect('/profile');
}

export async function createPost(formData) {
  await dbConnect();

  const userData = await getCurrentUser();
  if (!userData) redirect('/login');

  const user = await User.findOne({ email: userData.email });
  const post = await Post.create({
    user: user._id,
    content: formData.get('content'),
  });

  user.post.push(post._id);
  await user.save();

  redirect('/profile');
}

export async function editPost(formData) {
  await dbConnect();

  const userData = await getCurrentUser();
  if (!userData) redirect('/login');

  const postId = formData.get('postId');
  const content = formData.get('content');

  await Post.findOneAndUpdate(
    { _id: postId },
    { content }
  );

  redirect('/profile');
}

export async function uploadDp(formData) {
  await dbConnect();

  const userData = await getCurrentUser();
  if (!userData) redirect('/login');

  const file = formData.get('image');
  if (!file || file.size === 0) {
    redirect('/profile/upload');
    return;
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const randomName = crypto.randomBytes(10).toString('hex');
  const ext = path.extname(file.name);
  const filename = randomName + ext;

  const uploadDir = path.join(process.cwd(), 'public', 'images', 'uploads');
  await fs.writeFile(path.join(uploadDir, filename), buffer);

  await User.findOneAndUpdate(
    { email: userData.email },
    { dp: filename }
  );

  redirect('/profile/upload');
}
