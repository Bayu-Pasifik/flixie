import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';
import { Detailmovie } from '@/types/detailMovieType';
import { Images } from '@/types/imageType';

// Mengambil detail movie berdasarkan ID
async function fetchImages(id: number): Promise<{ backdrops: Images[]; posters: Images[]; logos: Images[] }> {
  try {
    const response = await axiosInstance.get(`/movie/${id}/images`);
    return {
      backdrops: response.data.backdrops,
      posters: response.data.posters,
      logos: response.data.logos,
    }; 
  } catch (error) {
    console.error('Error fetching movie images:', error);
    throw error;
  }
}

// Hook untuk menggunakan React Query
export const useImages = (id: number) => {
  return useQuery<{ backdrops: Images[]; posters: Images[]; logos: Images[] }, Error>({
    queryKey: ['movie/images', id],
    queryFn: () => fetchImages(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
async function fetchImagesTv(id: number): Promise<{ backdrops: Images[]; posters: Images[]; logos: Images[] }> {
  try {
    const response = await axiosInstance.get(`/tv/${id}/images`);
    return {
      backdrops: response.data.backdrops,
      posters: response.data.posters,
      logos: response.data.logos,
    }; 
  } catch (error) {
    console.error('Error fetching movie images:', error);
    throw error;
  }
}

// Hook untuk menggunakan React Query
export const useImagesTv = (id: number) => {
  return useQuery<{ backdrops: Images[]; posters: Images[]; logos: Images[] }, Error>({
    queryKey: ['tv/images', id],
    queryFn: () => fetchImagesTv(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
