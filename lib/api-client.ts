"use client";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers },
    });

    if (res.ok) {
      window.dispatchEvent(new Event("api-online"));
    }

    if (res.status >= 500) {
      window.dispatchEvent(new Event("api-degraded"));
      throw new Error("Server Error");
    }

    return await res.json();
  } catch (error) {
    window.dispatchEvent(new Event("api-offline"));
    throw error;
  }
}
