// app/components/hooks/hooks-server.ts
import axios, { isAxiosError } from 'axios';
import { cache } from 'react';
import { HomePageData } from '../types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const getPageData = cache(async (lang: string, key: string): Promise<HomePageData | null> => {
  try {
    const response = await api.get(`/pages/key/${lang}/${key}`);
    return response.data;
  } catch (error) {
    // Check if it's an Axios error instead of using 'any'
    if (isAxiosError(error)) {
      console.error(`Axios Error [${key}]:`, 
        error.response?.status, 
        error.response?.data
      );
    } else {
      // Handle non-axios errors (like network crashes)
      console.error(`Unexpected Error [${key}]:`, error);
    }
    return null;
  }
});