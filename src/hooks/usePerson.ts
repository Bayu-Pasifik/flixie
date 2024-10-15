import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';
import { DetailPerson } from '@/types/personType';
import { Images } from '@/types/imageType';
import { Crew, Cast, DetailTvCast, DetailTvCrew } from '@/types/movieType';

async function fetchDetailPerson(id: number): Promise<DetailPerson> {
    try {
      const response = await axiosInstance.get(`/person/${id}`);
      return response.data; // Asumsi response data berupa object Detailmovie
    } catch (error) {
      console.error('Error fetching person detail:', error);
      throw error;
    }
  }
  
  // Hook untuk menggunakan React Query
  export const useDetailPerson = (id: number) => {
    return useQuery<DetailPerson, Error>({
      queryKey: ['person/detail', id],
      queryFn: () => fetchDetailPerson(id),
    });
  };
async function fetchPersonImages(id: number): Promise<Images[]> {
    try {
      const response = await axiosInstance.get(`/person/${id}/images`);
      return response.data.profiles; // Asumsi response data berupa object Detailmovie
    } catch (error) {
      console.error('Error fetching person detail images:', error);
      throw error;
    }
  }
  
  // Hook untuk menggunakan React Query
  export const usePersonImages = (id: number) => {
    return useQuery<Images[], Error>({
      queryKey: ['person/detail/images', id],
      queryFn: () => fetchPersonImages(id),
    });
  };
  async function fetchMovieCredits(id: number): Promise<{ cast: Cast[]; crew: Crew[] }> {
    try {
        // Simulate delay to show animations
    await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 seconds delay
      const response = await axiosInstance.get(`/person/${id}/movie_credits`);
      // Asumsi bahwa API mengembalikan object dengan cast dan crew
      return {
        cast: response.data.cast,
        crew: response.data.crew
      };
    } catch (error) {
      console.error('Error fetching movie credits:', error);
      throw error;
    }
  }
  
  // Hook untuk menggunakan React Query
  export const usePersonMovieCredits = (id: number) => {
    return useQuery<{ cast: Cast[]; crew: Crew[] }, Error>({
      queryKey: ['person/movie_credits', id],
      queryFn: () => fetchMovieCredits(id),
    });
  };
  async function fetchTvCredits(id: number): Promise<{ cast: DetailTvCast[]; crew: DetailTvCrew[] }> {
    try {
        // Simulate delay to show animations
    await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 seconds delay
      const response = await axiosInstance.get(`/person/${id}/tv_credits`);
      // Asumsi bahwa API mengembalikan object dengan cast dan crew
      return {
        cast: response.data.cast,
        crew: response.data.crew
      };
    } catch (error) {
      console.error('Error fetching movie credits:', error);
      throw error;
    }
  }
  
  // Hook untuk menggunakan React Query
  export const usePersonTvCredits = (id: number) => {
    return useQuery<{ cast: DetailTvCast[]; crew: DetailTvCrew[] }, Error>({
      queryKey: ['person/tv_credits', id],
      queryFn: () => fetchTvCredits(id),
    });
  };