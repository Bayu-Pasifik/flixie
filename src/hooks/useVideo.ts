import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';
import { Videos } from '@/types/videoType';

// Mengambil detail movie berdasarkan ID
async function fetchVideos(id: number): Promise<Videos[]> {
  try {
    const response = await axiosInstance.get(`/movie/${id}/videos`);
    console.log('Response:', response.data);
    return response.data.results; // Asumsi response data berupa object Detailmovie
  } catch (error) {
    console.error('Error fetching movie videos:', error);
    throw error;
  }
}

// Hook untuk menggunakan React Query
export const useVideos = (id: number) => {
  return useQuery<Videos[], Error>({
    queryKey: ['movie/videos', id],
    queryFn: () => fetchVideos(id),
    staleTime: 1000 * 60 * 5, // 5 menit
  });
};
