
'use client'
// src/hooks/usePosts.ts
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';
import { Movie } from '@/types/movieType';

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
