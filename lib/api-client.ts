// REMOVE "use client" from the very top if it's there, 
// or keep it but wrap window calls.

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  if (!BASE_URL) throw new Error("API URL missing.");

  const cleanBase = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const fullUrl = `${cleanBase}${cleanEndpoint}`;

  try {
    const headers = new Headers(options.headers);
    if (options.body && !(options.body instanceof FormData)) {
      if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    }

    const res = await fetch(fullUrl, { ...options, headers });

    // SAFE WINDOW CHECK (Server-side safety)
    if (typeof window !== 'undefined') {
      if (res.ok) window.dispatchEvent(new Event("api-online"));
      else if (res.status >= 500) window.dispatchEvent(new Event("api-degraded"));
    }

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Status ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    if (typeof window !== 'undefined') window.dispatchEvent(new Event("api-offline"));
    throw error;
  }
}