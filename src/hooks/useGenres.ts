import { Genres } from "@/types/genreType";
import { useQuery, UseQueryResult } from "@tanstack/react-query"; // Impor UseQueryResult untuk type annotation
import axiosInstance from "@/lib/axios";

async function fetchMovieGenre(): Promise<Genres[]> {
  try {
    const response = await axiosInstance.get(`/genre/movie/list`);
    return response.data.genres; // Pastikan response.data sesuai dengan tipe Genres[]
  } catch (error) {
    console.error('Error fetching movie detail:', error);
    throw error;
  }
}

// Hook untuk menggunakan React Query
export const useMovieGenre = (): UseQueryResult<Genres[]> => { // Tambahkan type annotation
  return useQuery<Genres[]>({
    queryKey: ['genre/movie'],
    queryFn: fetchMovieGenre,
    staleTime: 1000 * 60 * 5, // 5 menit
  });
};

async function fetchTvGenres(): Promise<Genres[]> {
  try {
    const response = await axiosInstance.get(`/genre/tv/list`);
    return response.data.genres; // Pastikan response.data sesuai dengan tipe Genres[]
  } catch (error) {
    console.error('Error fetching movie detail:', error);
    throw error;
  }
}

// Hook untuk menggunakan React Query
export const useTvGenres = (): UseQueryResult<Genres[]> => { // Tambahkan type annotation
  return useQuery<Genres[]>({
    queryKey: ['genre/movie'],
    queryFn: fetchTvGenres,
    staleTime: 1000 * 60 * 5, // 5 menit
  });
};
