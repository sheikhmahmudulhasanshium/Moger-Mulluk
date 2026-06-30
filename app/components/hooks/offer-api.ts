// src/lib/offer-api.ts
import { Offer, OfferStats, OfferWithProducts } from "@/app/components/types";
import { apiRequest } from "@/lib/api-client";

export const offerApi = {
  async getStats(): Promise<OfferStats> {
    return apiRequest<OfferStats>('/offers/stats/count');
  },

  async getByType(type: string): Promise<Offer[]> {
    return apiRequest<Offer[]>(`/offers/type/${type}`);
  },

  async getByStatus(status: 'recent' | 'upcoming' | 'archived' | 'raw'): Promise<Offer[]> {
    const endpoint = status === 'raw' ? '/offers/raw' : `/offers/${status}`;
    const response = await apiRequest<Offer[] | { data: Offer[] }>(endpoint);
    if ('data' in response) return response.data;
    return response;
  },
    async getByProduct(productId: string): Promise<Offer[]> {
    return apiRequest<Offer[]>(`/offers/product/${productId}`);
  },

  async getById(id: string): Promise<OfferWithProducts> {
    return apiRequest<OfferWithProducts>(`/offers/${id}`);
  },
   // Useful for generateStaticParams (SSG)
  async getAllIds(): Promise<{ id: string }[]> {
     const response = await apiRequest<Offer[]>('/offers/recent');
     return response.map(o => ({ id: o.id }));
  }
};