'use client'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';
import {Credit, Person, TvCredit} from '@/types/personType'

// Mengambil detail movie berdasarkan ID
async function fetchCredits(id: number): Promise<Credit[]> {
  try {
    const response = await axiosInstance.get(`/movie/${id}/credits`);
    return response.data.cast; // Asumsi response data berupa object Detailmovie
  } catch (error) {
    console.error('Error fetching movie detail:', error);
    throw error;
  }
}

// Hook untuk menggunakan React Query
export const useCredits = (id: number) => {
  return useQuery<Credit[], Error>({
    queryKey: ['movies/credits', id],
    queryFn: () => fetchCredits(id),
    staleTime: 1000 * 60 * 5, // 5 menit
  });
};
async function fetchTvCredits(id: number): Promise<TvCredit[]> {
  try {
    const response = await axiosInstance.get(`/tv/${id}/credits`);
    return response.data.cast; // Asumsi response data berupa object Detailmovie
  } catch (error) {
    console.error('Error fetching movie detail:', error);
    throw error;
  }
}

// Hook untuk menggunakan React Query
export const useCreditsTv = (id: number) => {
  return useQuery<TvCredit[], Error>({
    queryKey: ['tv/credits', id],
    queryFn: () => fetchTvCredits(id),
    staleTime: 1000 * 60 * 5, // 5 menit
  });
};
async function fetchInfinityPopularPerson({
  pageParam = 1,
}: { pageParam?: number }): Promise<{
  persons: Person[];  // Sesuaikan dengan tipe TV show Anda
  currentPage: number | null;
  nextPage: number | null;
  prevPage: number | null;
}> {
  try {
    // Simulasi delay untuk animasi (opsional)
    await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 seconds delay

    // Lakukan request ke API dengan paginasi
    const response = await axiosInstance.get("/person/popular", {
      params: { page: pageParam },
    });

    return {
      persons: response.data.results,
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
export const useInfinityPopularPerson = () => {
  return useInfiniteQuery({
    queryKey: ["person/popular"],
    queryFn: fetchInfinityPopularPerson,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  });
};
