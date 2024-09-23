
'use client'
// src/hooks/usePosts.ts
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';
import { Movie } from '@/types/movieType';

async function fetchUpcoming(): Promise<Movie[]> {
  try {
    const response = await axiosInstance.get('/movie/upcoming');
    console.log('Response:', response.data.results);
    return response.data.results; // Pastikan ini adalah array dari Post
  } catch (error) {
    console.error('Error fetching now movies:', error);
    throw error; // Re-throw the error for useQuery handling
  }
}

export const useUpcomingMovies = () => {
  return useQuery<Movie[], Error>({
    queryKey: ['movies/upcoming'],
    queryFn: fetchUpcoming,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
async function fetchInfinityUpcomingMovies({
  pageParam = 1,
}: { pageParam?: number }): Promise<{
  movies: Movie[];
  currentPage: number | null;
  nextPage: number | null;
  prevPage: number | null;
}> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 seconds delay

    const response = await axiosInstance.get("/movie/upcoming", {
      params: { page: pageParam },
    });

    console.log('Response:', response.data.results);
    return {
      movies: response.data.results,
      nextPage:
        response.data.page < response.data.total_pages
          ? response.data.page + 1
          : null,
      currentPage: pageParam,
      prevPage: response.data.page > 1 ? response.data.page - 1 : null,
    };
  } catch (error) {
    console.error('Error fetching now movies:', error);
    throw error; // Re-throw the error for useQuery handling
  }
}

export const useInfinityUpcomingMovies = () => {
  return useInfiniteQuery({
    queryKey: ["movies", "infinity_upcoming"],
    queryFn: fetchInfinityUpcomingMovies,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  });
};



