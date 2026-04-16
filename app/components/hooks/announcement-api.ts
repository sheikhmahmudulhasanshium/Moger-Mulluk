// lib/announcement-api.ts
import { apiRequest } from "@/lib/api-client";

export interface AnnouncementMedia {
  thumbnail: string;
  gallery: string[];
}

export interface AnnouncementAttachments {
  pdfs: string[];
  externalUrls: string[];
}

export interface CreateAnnouncementDto {
  title: Record<string, string>;
  subtitle?: Record<string, string>;
  shortDescription?: Record<string, string>;
  longDescription?: Record<string, string>;
  priority?: number;
  isAvailable?: boolean;
  category: 'notice' | 'update' | 'alert' | 'directive' | 'news';
  attachments?: {
    pdfs?: string[];
    externalUrls?: string[];
  };
}

// Raw Announcement from Database
export interface Announcement extends CreateAnnouncementDto {
  _id: string;
  media: AnnouncementMedia;
  attachments: AnnouncementAttachments;
  createdAt: string;
  updatedAt: string;
}

// Localized Announcement for Frontend display (transformed by backend)
export interface AnnouncementFeedItem {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  longDescription: string;
  media: AnnouncementMedia;
  attachments: AnnouncementAttachments; // Matches the new backend structure
  priority: number;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export const announcementApi = {
  /**
   * PUBLIC ENDPOINTS
   */
  async getFeed(
    lang: string, 
    page = 1, 
    category?: string
  ): Promise<PaginatedResponse<AnnouncementFeedItem>> {
    const params = new URLSearchParams({ page: page.toString() });
    if (category && category !== "all") params.append('cat', category);
    
    return apiRequest<PaginatedResponse<AnnouncementFeedItem>>(
      `/announcements/feed/${lang}?${params.toString()}`
    );
  },

  /**
   * ADMIN ENDPOINTS
   */
  async create(dto: CreateAnnouncementDto): Promise<Announcement> {
    return apiRequest<Announcement>('/announcements', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  },

  async update(id: string, dto: Partial<CreateAnnouncementDto>): Promise<Announcement> {
    return apiRequest<Announcement>(`/announcements/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    });
  },

  async remove(id: string): Promise<{ success: boolean }> {
    return apiRequest<{ success: boolean }>(`/announcements/${id}`, {
      method: 'DELETE',
    });
  },

  async uploadMedia(
    id: string, 
    thumbnail?: File, 
    gallery?: File[]
  ): Promise<Announcement> {
    const formData = new FormData();
    if (thumbnail) formData.append('thumbnail', thumbnail);
    if (gallery && gallery.length > 0) {
      gallery.forEach((file) => formData.append('gallery', file));
    }
    return apiRequest<Announcement>(`/announcements/${id}/media`, {
      method: 'PATCH',
      body: formData,
    });
  },
};