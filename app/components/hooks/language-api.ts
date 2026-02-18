import { apiRequest } from "@/lib/api-client";

export interface Language {
  _id: string;
  label: string;
  code: string;
  CountryCode: string;
}

export const languageApi = {
  async getLanguages(): Promise<Language[]> {
    return apiRequest<Language[]>('/languages');
  }
};