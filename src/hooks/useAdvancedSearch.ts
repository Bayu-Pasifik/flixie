// hooks/useAdvancedSearchData.js
import axiosInstance from "@/lib/axios";
import { Country, Languages } from "@/types/countryType";
import { Movie, Tv } from "@/types/movieType";
import { useInfiniteQuery, useQuery, UseQueryResult } from "@tanstack/react-query";
import { useState, useEffect } from "react";

type Company = {
  id: number;
  name: string;
};

type Keyword = {
  id: number;
  name: string;
};

export function useAdvancedSearchData() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [companyRes, keywordRes] = await Promise.all([
          fetch("/json/allCompany.json"),
          fetch("/json/keyword.json"),
        ]);

        // Parsing response sebagai JSON
        const companyData = await companyRes.json();
        const keywordData = await keywordRes.json();

        // Mengakses properti 'data' untuk mendapatkan array yang diinginkan
        setCompanies(companyData.data);
        setKeywords(keywordData.data);
      } catch (error) {
        console.error("Error fetching advanced search data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { companies, keywords, loading };
}


async function fetchCountries(): Promise<Country[]> {
    try {
      const response = await axiosInstance.get(`/configuration/countries`);
      return response.data; // Pastikan response.data sesuai dengan tipe Country[]
    } catch (error) {
      console.error('Error fetching countries:', error);
      throw error;
    }
  }
  
  // Hook untuk menggunakan React Query
  export const useCountries = (): UseQueryResult<Country[]> => { // Tambahkan type annotation
    return useQuery<Country[], Error>({
      queryKey: ['all/countries'],
      queryFn: fetchCountries,
      staleTime: 1000 * 60 * 5, // 5 menit
    });
  };
async function fetchLanguages(): Promise<Languages[]> {
    try {
      const response = await axiosInstance.get(`/configuration/languages`);
      return response.data; // Pastikan response.data sesuai dengan tipe Languages[]
    } catch (error) {
      console.error('Error fetching countries:', error);
      throw error;
    }
  }
  
  // Hook untuk menggunakan React Query
  export const useLanguages = (): UseQueryResult<Languages[]> => { // Tambahkan type annotation
    return useQuery<Languages[], Error>({
      queryKey: ['all/languages'],
      queryFn: fetchLanguages,
      staleTime: 1000 * 60 * 5, // 5 menit
    });
  };

  async function fetchAdvancedSearchMovie(
    filters: {
      runTimeLess?: number;
      runTimeGreater?: number;
      year?: number;
      vote_averageMoreThan?: number; // Added parameter
      vote_averageLessThan?: number; // Added parameter
      companyId?: string[];
      keywordsId?: string[];
      genresId?: string[];
      countryId?: string;
      languagesId?: string;
    },
    pageParam: number = 1
  ): Promise<{
    movies: Movie[];
    currentPage: number | null;
    nextPage: number | null;
    prevPage: number | null;
  }> {
    const {
      runTimeLess,
      runTimeGreater,
      year,
      vote_averageMoreThan, // Destructure added parameter
      vote_averageLessThan,  // Destructure added parameter
      companyId,
      keywordsId,
      genresId,
      countryId,
      languagesId,
    } = filters;
  
    const params: any = {
      page: pageParam,
      ...(runTimeGreater && { 'with_runtime.gte': runTimeGreater }), // Updated format
      ...(runTimeLess && { 'with_runtime.lte': runTimeLess }), // Updated format
      ...(year && { year }),
      ...(vote_averageMoreThan && { 'vote_average.gte': vote_averageMoreThan }), // Updated format
      ...(vote_averageLessThan && { 'vote_average.lte': vote_averageLessThan }), // Updated format
      ...(companyId && { with_companies: companyId.join(",") }),
      ...(keywordsId && { with_keywords: keywordsId.join(",") }),
      ...(genresId && { with_genres: genresId.join(",") }),
      ...(countryId && { with_origin_country: countryId }),
      ...(languagesId && { with_original_language: languagesId}),
    };
  
    const response = await axiosInstance.get(`/discover/movie`, { params });
    console.log('Response:', response.request.responseURL);
  
    return {
      movies: response.data.results,
      currentPage: response.data.page,
      nextPage: response.data.page < response.data.total_pages ? response.data.page + 1 : null,
      prevPage: response.data.page > 1 ? response.data.page - 1 : null,
    };
  }
  

  export const useMovieByAdvancedSearch = (filters: {
    runTimeLess?: number;
    runTimeGreater?: number;
    year?: number;
    vote_averageMoreThan?: number; // Added parameter
    vote_averageLessThan?: number; // Added parameter
    companyId?: string[];
    keywordsId?: string[];
    genresId?: string[];
    countryId?: string;
    languagesId?: string;
  }) => {
    return useInfiniteQuery({
      queryKey: ["movieByAdvancedSearch", filters],
      queryFn: ({ pageParam = 1 }) => fetchAdvancedSearchMovie(filters, pageParam),
      getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
      initialPageParam: 1,
    });
  };
  async function fetchAdvancedSearchTv(
    filters: {
      runTimeLess?: number;
      runTimeGreater?: number;
      year?: number;
      vote_averageMoreThan?: number; // Added parameter
      vote_averageLessThan?: number; // Added parameter
      companyId?: string[];
      keywordsId?: string[];
      genresId?: string[];
      countryId?: string;
      languagesId?: string;
    },
    pageParam: number = 1
  ): Promise<{
    tvShows: Tv[];
    currentPage: number | null;
    nextPage: number | null;
    prevPage: number | null;
  }> {
    const {
      runTimeLess,
      runTimeGreater,
      year,
      vote_averageMoreThan, // Destructure added parameter
      vote_averageLessThan,  // Destructure added parameter
      companyId,
      keywordsId,
      genresId,
      countryId,
      languagesId,
    } = filters;
  
    const params: any = {
      page: pageParam,
      ...(runTimeGreater && { 'with_runtime.gte': runTimeGreater }), // Updated format
      ...(runTimeLess && { 'with_runtime.lte': runTimeLess }), // Updated format
      ...(year && { year }),
      ...(vote_averageMoreThan && { 'vote_average.gte': vote_averageMoreThan }), // Updated format
      ...(vote_averageLessThan && { 'vote_average.lte': vote_averageLessThan }), // Updated format
      ...(companyId && { with_companies: companyId.join(",") }),
      ...(keywordsId && { with_keywords: keywordsId.join(",") }),
      ...(genresId && { with_genres: genresId.join(",") }),
      ...(countryId && { with_origin_country: countryId }),
      ...(languagesId && { with_original_language: languagesId}),
    };
  
    const response = await axiosInstance.get(`/discover/movie`, { params });
    console.log('Response:', response.request.responseURL);
  
    return {
      tvShows: response.data.results,
      currentPage: response.data.page,
      nextPage: response.data.page < response.data.total_pages ? response.data.page + 1 : null,
      prevPage: response.data.page > 1 ? response.data.page - 1 : null,
    };
  }
  

  export const useTvByAdvancedSearch = (filters: {
    runTimeLess?: number;
    runTimeGreater?: number;
    year?: number;
    vote_averageMoreThan?: number; // Added parameter
    vote_averageLessThan?: number; // Added parameter
    companyId?: string[];
    keywordsId?: string[];
    genresId?: string[];
    countryId?: string;
    languagesId?: string;
  }) => {
    return useInfiniteQuery({
      queryKey: ["TvByAdvancedSearch", filters],
      queryFn: ({ pageParam = 1 }) => fetchAdvancedSearchTv(filters, pageParam),
      getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
      initialPageParam: 1,
    });
  };
  
  
