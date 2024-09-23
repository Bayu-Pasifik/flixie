'use client'
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';
import {Credit} from '@/types/personType'
import { Keywords } from '@/types/keywordsType';

// Mengambil detail movie berdasarkan ID
async function fetchKeywords(id: number): Promise<Keywords[]> {
  try {
    const response = await axiosInstance.get(`/movie/${id}/keywords`);
    return response.data.keywords; // Asumsi response data berupa object Detailmovie
  } catch (error) {
    console.error('Error fetching movie detail:', error);
    throw error;
  }
}

// Hook untuk menggunakan React Query
export const useKeywords = (id: number) => {
  return useQuery<Keywords[], Error>({
    queryKey: ['movies/keywords', id],
    queryFn: () => fetchKeywords(id),
    staleTime: 1000 * 60 * 5, // 5 menit
  });
};
