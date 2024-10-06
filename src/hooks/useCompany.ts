import axios from "axios";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import  axiosInstance  from "../lib/axios";
import { Company, DetailCompany } from "@/types/companyType";
import { Images } from "@/types/imageType";
import { Movie, Tv } from "@/types/movieType";

async function fetchInfinityCompany(
  query: string,
    {
    pageParam = 1,
  }: { pageParam?: number }): Promise<{
    company: Company[];  // Sesuaikan dengan tipe TV show Anda
    currentPage: number | null;
    nextPage: number | null;
    prevPage: number | null;
  }> {
    try {
      // Simulasi delay untuk animasi (opsional)
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 seconds delay
  
      // Lakukan request ke API dengan paginasi
      const response = await axiosInstance.get("/search/company", {
        params: { 
            query: query,
            page: pageParam },
      });
  
      return {
        company: response.data.results,
        nextPage:
          response.data.page < response.data.total_pages
            ? response.data.page + 1
            : null,
        currentPage: response.data.page,
        prevPage: response.data.page > 1 ? response.data.page - 1 : null,
      };
    } catch (error) {
      console.error("Error fetching search company:", error);
      throw error; // Rethrow error untuk React Query menangani
    }
  }
  
  // Hook untuk infinite scroll pada TV shows
  export const useInfinityCompany = (query: string) => {
    return useInfiniteQuery({
      queryKey: ["company",query],
      queryFn: ({ pageParam = 1}) => fetchInfinityCompany(query, { pageParam}),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    });
  };


  async function fetchDetailCompany(id: number): Promise<DetailCompany> {
    try {
      const response = await axiosInstance.get(`/company/${id}`);
      return response.data; 
    } catch (error) {
      console.error('Error fetching company detail:', error);
      throw error;
    }
  }
  
  // Hook untuk menggunakan React Query
  export const useDetailCompany = (id: number) => {
    return useQuery<DetailCompany, Error>({
      queryKey: ['company/detail', id],
      queryFn: () => fetchDetailCompany(id),
    });
  };

  async function fetchCompanyImages(id: number): Promise<Images[]> {
    try {
      const response = await axiosInstance.get(`/company/${id}/images`);
      return response.data.logos; // Asumsi response data berupa object Detailmovie
    } catch (error) {
      console.error('Error fetching company detail images:', error);
      throw error;
    }
  }
  
  // Hook untuk menggunakan React Query
  export const useCompanyImages = (id: number) => {
    return useQuery<Images[], Error>({
      queryKey: ['company/detail/images', id],
      queryFn: () => fetchCompanyImages(id),
    });
  };


  async function fetchMovieByCompany(
    id: number,
      {
      pageParam = 1,
    }: { pageParam?: number }): Promise<{
      movies: Movie[];  // Sesuaikan dengan tipe TV show Anda
      currentPage: number | null;
      nextPage: number | null;
      prevPage: number | null;
    }> {
      try {
        // Simulasi delay untuk animasi (opsional)
        await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 seconds delay
    
        // Lakukan request ke API dengan paginasi
        const response = await axiosInstance.get("/discover/movie", {
          params: { 
              with_companies: id,
              page: pageParam },
        });
    
        return {
          movies: response.data.results,
          nextPage:
            response.data.page < response.data.total_pages
              ? response.data.page + 1
              : null,
          currentPage: response.data.page,
          prevPage: response.data.page > 1 ? response.data.page - 1 : null,
        };
      } catch (error) {
        console.error("Error fetching search movie by company:", error);
        throw error; // Rethrow error untuk React Query menangani
      }
    }
    
    // Hook untuk infinite scroll pada TV shows
    export const useInfinityMovieByCompany = (id: number) => {
      return useInfiniteQuery({
        queryKey: ["company/movie",id],
        queryFn: ({ pageParam = 1}) => fetchMovieByCompany(id, { pageParam}),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
      });
    };
  async function fetchTvByCompany(
    id: number,
      {
      pageParam = 1,
    }: { pageParam?: number }): Promise<{
      tvShows: Tv[];  // Sesuaikan dengan tipe TV show Anda
      currentPage: number | null;
      nextPage: number | null;
      prevPage: number | null;
    }> {
      try {
        // Simulasi delay untuk animasi (opsional)
        await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 seconds delay
    
        // Lakukan request ke API dengan paginasi
        const response = await axiosInstance.get("/discover/tv", {
          params: { 
              with_companies: id,
              page: pageParam },
        });
    
        return {
          tvShows: response.data.results,
          nextPage:
            response.data.page < response.data.total_pages
              ? response.data.page + 1
              : null,
          currentPage: response.data.page,
          prevPage: response.data.page > 1 ? response.data.page - 1 : null,
        };
      } catch (error) {
        console.error("Error fetching search movie by company:", error);
        throw error; // Rethrow error untuk React Query menangani
      }
    }
    
    // Hook untuk infinite scroll pada TV shows
    export const useInfinityTvByCompany = (id: number) => {
      return useInfiniteQuery({
        queryKey: ["company/tv",id],
        queryFn: ({ pageParam = 1}) => fetchTvByCompany(id, { pageParam}),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
      });
    };