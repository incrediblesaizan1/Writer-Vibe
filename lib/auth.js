import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = "slsldlkff";

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function createToken(payload, expiresIn = '1d') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
  if (!token) return null;
  return verifyToken(token.value);
}
