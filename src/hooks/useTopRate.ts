
'use client'
// src/hooks/usePosts.ts
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';
import { Movie } from '@/types/movieType';

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
