'use client'
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';
import {Credit, TvCredit} from '@/types/personType'

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
