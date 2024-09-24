
'use client'
// src/hooks/usePosts.ts
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';
import { Movie, Tv } from '@/types/movieType';

async function fetchNowPlaying(): Promise<Movie[]> {
  try {
    const response = await axiosInstance.get('/movie/now_playing');
    console.log('Response:', response.data.results);
    return response.data.results; // Pastikan ini adalah array dari Post
  } catch (error) {
    console.error('Error fetching now movies:', error);
    throw error; // Re-throw the error for useQuery handling
  }
}

export const useCurrentlyAiring = () => {
  return useQuery<Movie[], Error>({
    queryKey: ['movies/now_playing'],
    queryFn: fetchNowPlaying,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

async function fetchInfinityAiring({
  pageParam = 1,
}: { pageParam?: number }): Promise<{
  movies: Movie[];
  currentPage: number | null;
  nextPage: number | null;
  prevPage: number | null;
}> {
  try {
    // Simulate delay to show animations
    await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 seconds delay

    const response = await axiosInstance.get("/movie/now_playing", {
      params: { page: pageParam },
    });

    return {
      movies: response.data.results,
      nextPage:
        response.data.page < response.data.total_pages
          ? response.data.page + 1
          : null,
      currentPage: response.data.page,
      prevPage: response.data.page > 1 ? response.data.page - 1 : null,
    };
  } catch (error) {
    console.error("Error fetching currently airing movies:", error);
    throw error; // Rethrow error for React Query to handle
  }
}

export const useInfinityAiring = () => {
  return useInfiniteQuery({
    queryKey: ["movies", "infinity_airing"],
    queryFn: fetchInfinityAiring,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  });
};


// Fungsi untuk mengambil data TV dengan paginasi
async function fetchInfinityAiringTV({
  pageParam = 1,
}: { pageParam?: number }): Promise<{
  tvShows: Tv[];  // Sesuaikan dengan tipe TV show Anda
  currentPage: number | null;
  nextPage: number | null;
  prevPage: number | null;
}> {
  try {
    // Simulasi delay untuk animasi (opsional)
    await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 seconds delay

    // Lakukan request ke API dengan paginasi
    const response = await axiosInstance.get("/tv/airing_today", {
      params: { page: pageParam },
    });

    return {
      tvShows: response.data.results,
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
export const useInfinityAiringTV = () => {
  return useInfiniteQuery({
    queryKey: ["tvShows", "infinity_airing_tv"],
    queryFn: fetchInfinityAiringTV,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  });
};
