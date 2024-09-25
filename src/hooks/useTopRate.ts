
'use client'
// src/hooks/usePosts.ts
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';
import { Movie, Tv } from '@/types/movieType';

async function fetchTopMovie(): Promise<Movie[]> {
  try {
    const response = await axiosInstance.get('/movie/top_rated');
    console.log('Response:', response.data.results);
    return response.data.results; // Pastikan ini adalah array dari Post
  } catch (error) {
    console.error('Error fetching top movies:', error);
    throw error; // Re-throw the error for useQuery handling
  }
}

export const useTopMovies = () => {
  return useQuery<Movie[], Error>({
    queryKey: ['movies/top_rated'],
    queryFn: fetchTopMovie,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};





async function fetchInfinityTopRateTV(
  { pageParam = 1 }: { pageParam?: number }
): Promise<{
  tvShows: Tv[];
  currentPage: number | null;
  nextPage: number | null;
  prevPage: number | null;
}> {
  try {
    // Simulate delay to show animations
    await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 seconds delay

    const response = await axiosInstance.get(`/tv/top_rated`, {
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
    console.error('Error fetching trending movies:', error);
    throw error; // Re-throw the error for useQuery handling
  }
}

// Hook untuk useInfiniteQuery
export const useInfinityTopRateTv = () => {
  return useInfiniteQuery({
    queryKey: ['tv/infinity_top_rate'],
    queryFn: ({ pageParam = 1 }) => fetchInfinityTopRateTV({ pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};