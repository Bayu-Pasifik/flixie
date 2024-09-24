
'use client'
// src/hooks/usePosts.ts
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';
import { Movie } from '@/types/movieType';

async function fetchTrendingMovie(time: string): Promise<Movie[]> {
  try {
    const response = await axiosInstance.get(`/trending/movie/${time}`);
    return response.data.results; // Pastikan ini adalah array dari Post
  } catch (error) {
    console.error('Error fetching now movies:', error);
    throw error; // Re-throw the error for useQuery handling
  }
}

export const useTrendingMovie = (time:string) => {
  return useQuery<Movie[], Error>({
    queryKey: ['movies/trending_movie', time],
    queryFn: ()=> fetchTrendingMovie(time),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};


async function fetchInfinityTrendingMovie(
    time: string,
    { pageParam = 1 }: { pageParam?: number }
  ): Promise<{
    movies: Movie[];
    currentPage: number | null;
    nextPage: number | null;
    prevPage: number | null;
  }> {
    try {
      // Simulate delay to show animations
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 seconds delay
  
      const response = await axiosInstance.get(`/trending/movie/${time}`, {
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
      console.error('Error fetching trending movies:', error);
      throw error; // Re-throw the error for useQuery handling
    }
  }
  
  // Hook untuk useInfiniteQuery
  export const useInfinityTrendingMovie = (time: string) => {
    return useInfiniteQuery({
      queryKey: ['movies/infinity_trending_movie', time],
      queryFn: ({ pageParam = 1 }) => fetchInfinityTrendingMovie(time, { pageParam }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };
  
