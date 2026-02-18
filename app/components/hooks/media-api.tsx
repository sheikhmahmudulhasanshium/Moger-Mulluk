import { Media, MediaPaginatedResponse, MediaPurpose } from "../types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const mediaApi = {
  // 1. Binary File Upload
  async uploadFile(file: File, purpose: MediaPurpose): Promise<Media> {
    // Vercel Gatekeeper check
    if (file.size > 4.5 * 1024 * 1024) {
      throw new Error("File too large for Vercel (Limit 4.5MB)");
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('purpose', purpose);

    const res = await fetch(`${BASE_URL}/media/upload-file`, {
      method: 'POST',
      body: formData, // Browser automatically sets Content-Type to multipart/form-data
    });
    
    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  },

  // 2. Link/Base64 Upload
  async uploadLink(url: string, purpose: MediaPurpose, name?: string): Promise<Media> {
    const res = await fetch(`${BASE_URL}/media/upload-link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, purpose, name }),
    });
    
    if (!res.ok) throw new Error('Link upload failed');
    return res.json();
  },

  // 3. Get Paginated
  async getMedia(page = 1, limit = 10, purpose?: MediaPurpose): Promise<MediaPaginatedResponse> {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(purpose && { purpose }),
    });
    
    const res = await fetch(`${BASE_URL}/media?${query}`);
    return res.json();
  },

  // 4. Delete
  async deleteMedia(id: string): Promise<void> {
    await fetch(`${BASE_URL}/media/${id}`, { method: 'DELETE' });
  }
};