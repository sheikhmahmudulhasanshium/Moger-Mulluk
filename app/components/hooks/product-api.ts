import { apiRequest } from "@/lib/api-client";

/** 
 * ADMIN INTERFACES 
 */
export interface CreateProductDto {
  shortId?: string;
  position: number;
  category: 'tea' | 'coffee' | 'beverage' | 'desert' | 'snacks';
  tags: string[];
  title: Record<string, string>;
  description: Record<string, string>;
  ingredients?: Record<string, string>;
  healthBenefit?: Record<string, string>;
  origin?: Record<string, string>;
  funFact?: Record<string, string>;
  logistics: {
    stock: number;
    isAvailable: boolean;
    grandTotal: number;
    uKey: 'c' | 'g';
    calories: number;
  };
}

export interface Product extends CreateProductDto {
  _id: string;
  media?: {
    thumbnail: string;
    gallery: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProductStats {
  total: number;
  breakdown: { _id: string; c: number }[];
  timestamp: string;
}

/** 
 * PUBLIC INTERFACES (Transformed by Backend) 
 */
export interface ProductCard {
  shortId: string;
  category: string;
  title: string;
  price: number;
  unit: string;
  thumbnail: string;
}

export interface ProductDetail {
  shortId: string;
  title: string;
  description: string;
  price: number;
  unit: string;
  media: {
    thumbnail: string;
    gallery: string[];
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    totalItems: number;
    currentPage: number;
  };
}

export const productApi = {
  /**
   * ADMIN & SYSTEM ENDPOINTS
   */

  async create(dto: CreateProductDto): Promise<Product> {
    return apiRequest<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  },

  async getStats(): Promise<ProductStats> {
    return apiRequest<ProductStats>('/products/stats/count');
  },

  async getAdminProducts(page = 1, limit = 20): Promise<PaginatedResponse<Product>> {
    return apiRequest<PaginatedResponse<Product>>(`/products/admin/raw?page=${page}&limit=${limit}`);
  },

  async getById(id: string): Promise<Product> {
    return apiRequest<Product>(`/products/${id}`);
  },

  async update(id: string, dto: Partial<CreateProductDto>): Promise<Product> {
    return apiRequest<Product>(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    });
  },

  async remove(id: string): Promise<void> {
    return apiRequest<void>(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * MEDIA & ASSET ENDPOINTS
   */

  // 1. Link an external URL (Remote)
  async uploadMediaLink(id: string, url: string): Promise<Product> {
    return apiRequest<Product>(`/products/${id}/media-link`, {
      method: 'PATCH',
      body: JSON.stringify({ url }),
    });
  },

  // 2. Upload Binary Files (Local)
  // Refactored to use apiRequest to maintain System Status monitoring
  async uploadMedia(id: string, thumbnail?: File, gallery?: File[]): Promise<Product> {
    const formData = new FormData();
    if (thumbnail) formData.append('thumbnail', thumbnail);
    if (gallery && gallery.length > 0) {
      gallery.forEach((file) => formData.append('gallery', file));
    }

    return apiRequest<Product>(`/products/${id}/media`, {
      method: 'PATCH',
      body: formData,
    });
  },

  async reorderMedia(id: string, thumbnail: string, gallery: string[]): Promise<Product> {
    return apiRequest<Product>(`/products/${id}/media/reorder`, {
      method: 'PATCH',
      body: JSON.stringify({ thumbnail, gallery }),
    });
  },

  /**
   * PUBLIC ENDPOINTS
   */

  async search(lang: string, q: string, cat?: string, page = 1, limit = 10): Promise<PaginatedResponse<ProductCard>> {
    const params = new URLSearchParams({ q, page: page.toString(), limit: limit.toString() });
    if (cat) params.append('cat', cat);
    return apiRequest<PaginatedResponse<ProductCard>>(`/products/search/${lang}?${params.toString()}`);
  },

  async getMenu(lang: string, page = 1, limit = 10, cat?: string): Promise<PaginatedResponse<ProductCard>> {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (cat) params.append('cat', cat);
    return apiRequest<PaginatedResponse<ProductCard>>(`/products/menu/${lang}?${params.toString()}`);
  },

  async getDetail(lang: string, shortId: string): Promise<ProductDetail> {
    return apiRequest<ProductDetail>(`/products/detail/${lang}/${shortId}`);
  },

  /**
   * MAINTENANCE HELPERS
   */

  async getIncompleteProducts(): Promise<Product[]> {
    const res = await this.getAdminProducts(1, 100);
    // Filters items that either have no media object or have an empty thumbnail string
    return res.data.filter(p => !p.media?.thumbnail || p.media.thumbnail === "");
  },

  async getPublicMenu(): Promise<Product[]> {
    const response = await this.getAdminProducts(1, 100);
    return response.data.filter(p => p.logistics.isAvailable);
  }
};