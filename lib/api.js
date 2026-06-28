import axios from "axios";

// Single axios instance. withCredentials sends the httpOnly JWT cookie so the
// session survives reloads without storing tokens in JS-accessible storage.
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001",
  withCredentials: true,
});

// Normalize server error messages for toasts.
export function apiError(err, fallback = "Something went wrong") {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message || err.message || fallback;
  }
  return fallback;
}
