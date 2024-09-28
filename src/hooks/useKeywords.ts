'use client'
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';
import { Keywords } from '@/types/keywordsType';

// Mengambil detail movie berdasarkan ID
async function fetchKeywords(id: number): Promise<Keywords[]> {
  try {
    const response = await axiosInstance.get(`/movie/${id}/keywords`);
    return response.data.keywords; // Asumsi response data berupa object Detailmovie
  } catch (error) {
    console.error('Error fetching movie detail:', error);
    throw error;
  }
}

// Hook untuk menggunakan React Query
export const useKeywords = (id: number) => {
  return useQuery<Keywords[], Error>({
    queryKey: ['movies/keywords', id],
    queryFn: () => fetchKeywords(id),
    staleTime: 1000 * 60 * 5, // 5 menit
  });
};
async function fetchKeywordsTv(id: number): Promise<Keywords[]> {
  try {
    const response = await axiosInstance.get(`tv/${id}/keywords`);
    return response.data.results; 
  } catch (error) {
    console.error('Error fetching keywords:', error);
    throw error;
  }
}

// Hook untuk menggunakan React Query
export const useKeywordsTv = (id: number) => {
  return useQuery<Keywords[], Error>({
    queryKey: ['tv/keywords', id],
    queryFn: () => fetchKeywordsTv(id),
    staleTime: 1000 * 60 * 5, // 5 menit
  });
};

async function fetchDetailKeyword(id: number): Promise<Keywords> {
  try {
    const response = await axiosInstance.get(`/keyword/${id}`);
    return response.data; // Asumsi response data berupa object Detailmovie
  } catch (error) {
    console.error('Error fetching movie detail:', error);
    throw error;
  }
}

// Hook untuk menggunakan React Query
export const useDetailKeywords = (id: number) => {
  return useQuery({
    queryKey: ['detail/keywords', id],
    queryFn: () => fetchDetailKeyword(id),
    staleTime: 1000 * 60 * 5, // 5 menit
  });
};