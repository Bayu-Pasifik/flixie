import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';
import { Detailmovie } from '@/types/detailMovieType';
import { Images } from '@/types/imageType';

// Mengambil detail movie berdasarkan ID
async function fetchImages(id: number): Promise<Images> {
  try {
    const response = await axiosInstance.get(`/movie/${id}/images`);
    return response.data; // Asumsi response data berupa object Detailmovie
  } catch (error) {
    console.error('Error fetching movie detail:', error);
    throw error;
  }
}

// Hook untuk menggunakan React Query
export const useImages = (id: number) => {
  return useQuery<Images, Error>({
    queryKey: ['movie/images', id],
    queryFn: () => fetchImages(id),
    staleTime: 1000 * 60 * 5, // 5 menit
  });
};
