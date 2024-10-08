import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';
import { Detailmovie } from '@/types/detailMovieType';
import { DetailTv, Network } from '@/types/detailTVType';

// Mengambil detail movie berdasarkan ID
async function fetchDetailMovie(id: number): Promise<Detailmovie> {
  try {
    const response = await axiosInstance.get(`/movie/${id}`);
    return response.data; // Asumsi response data berupa object Detailmovie
  } catch (error) {
    console.error('Error fetching movie detail:', error);
    throw error;
  }
}

// Hook untuk menggunakan React Query
export const useDetailMovie = (id: number) => {
  return useQuery<Detailmovie, Error>({
    queryKey: ['movieDetail', id],
    queryFn: () => fetchDetailMovie(id),
    staleTime: 1000 * 60 * 5, // 5 menit
  });
};
async function fetchDetailTV(id: number): Promise<DetailTv> {
  try {
    const response = await axiosInstance.get(`/tv/${id}`);
    return response.data; // Asumsi response data berupa object DetailTv
  } catch (error) {
    console.error('Error fetching movie detail:', error);
    throw error;
  }
}

// Hook untuk menggunakan React Query
export const useDetailTV = (id: number) => {
  return useQuery<DetailTv, Error>({
    queryKey: ['detailTV', id],
    queryFn: () => fetchDetailTV(id),
    staleTime: 1000 * 60 * 5, // 5 menit
  });
};
async function fetchDetailNework(id: number): Promise<Network> {
  try {
    const response = await axiosInstance.get(`/network/${id}`);
    return response.data; // Asumsi response data berupa object Network
  } catch (error) {
    console.error('Error fetching movie detail:', error);
    throw error;
  }
}

// Hook untuk menggunakan React Query
export const useDetailNetwork = (id: number) => {
  return useQuery<Network, Error>({
    queryKey: ['network', id],
    queryFn: () => fetchDetailNework(id),
    staleTime: 1000 * 60 * 5, // 5 menit
  });
};
