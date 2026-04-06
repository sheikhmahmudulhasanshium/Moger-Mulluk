// lib/api-client.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  if (!BASE_URL) throw new Error("API URL missing. Check your .env file.");

  const cleanBase = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const fullUrl = `${cleanBase}${cleanEndpoint}`;

  try {
    const headers = new Headers(options.headers);
    if (options.body && !(options.body instanceof FormData)) {
      if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    }

    const res = await fetch(fullUrl, { ...options, headers });

    // Handle Server Error Responses
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        
        // NestJS returns validation errors in errorData.message (often as an array)
        const serverMessage = Array.isArray(errorData.message) 
            ? errorData.message.join(", ") 
            : errorData.message;

        throw new Error(serverMessage || `Error ${res.status}: ${res.statusText}`);
    }

    // SSR SAFE WINDOW CHECK
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent("api-online"));
    }

    return await res.json();
  } catch (error) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent("api-offline"));
    }
    throw error;
  }
}