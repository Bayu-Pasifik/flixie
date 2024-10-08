'use client'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
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
async function fetchInfinityRecommendationTv(
id: number,
{ pageParam = 1 }: { pageParam?: number }): Promise<{
  recommendations: Recomendation[];  // Sesuaikan dengan tipe TV show Anda
  currentPage: number | null;
  nextPage: number | null;
  prevPage: number | null;
}> {
  try {
    // Simulasi delay untuk animasi (opsional)
    await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 seconds delay
    // Lakukan request ke API dengan paginasi
    const response = await axiosInstance.get("/tv/" + id + "/recommendations", {
      params: { page: pageParam },
    });

    return {
      recommendations: response.data.results,
      nextPage:
        response.data.page < response.data.total_pages
          ? response.data.page + 1
          : null,
      currentPage: response.data.page,
      prevPage: response.data.page > 1 ? response.data.page - 1 : null,
    };
  } catch (error) {
    console.error("Error fetching currently airing TV shows:", error);
    throw error; // Rethrow error untuk React Query menangani
  }
}

// Hook untuk infinite scroll pada TV shows
export const useInfinityRecommendationsTv = (id: number) => {
  return useInfiniteQuery({
    queryKey: ["recommendations/tv", id],
    queryFn: ({ pageParam = 1 }) => fetchInfinityRecommendationTv(id,{
      pageParam,}),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  });
};
