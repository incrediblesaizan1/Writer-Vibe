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

export function createToken(payload) {
  return jwt.sign(payload, JWT_SECRET);
}

export async function getCurrentUser() {
  // Deprecated: Moving to localStorage token based auth
  return null;
}
