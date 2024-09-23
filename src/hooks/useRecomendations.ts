'use client'
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';
import { Keywords } from '@/types/keywordsType';
import { Recomendation } from '@/types/recomendationType';

// Mengambil detail movie berdasarkan ID
async function fetchRecommendations(id: number): Promise<Recomendation[]> {
  try {
    const response = await axiosInstance.get(`/movie/${id}/recommendations`);
    return response.data.results; // Asumsi response data berupa object Detailmovie
  } catch (error) {
    console.error('Error fetching movie detail:', error);
    throw error;
  }
}

// Hook untuk menggunakan React Query
export const useRecommendations = (id: number) => {
  return useQuery<Recomendation[], Error>({
    queryKey: ['movies/recommendations', id],
    queryFn: () => fetchRecommendations(id),
    staleTime: 1000 * 60 * 5, // 5 menit
  });
};
