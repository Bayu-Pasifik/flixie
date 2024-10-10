import { Movie, Tv } from "@/types/movieType";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";

// Fetch Movies by Keyword
async function fetchMovieByKeywords(
  id: number,
  { pageParam = 1 }: { pageParam?: number }
): Promise<{
  movies: Movie[];
  currentPage: number | null;
  nextPage: number | null;
  prevPage: number | null;
}> {
  await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 seconds delay
  const response = await axiosInstance.get(`/keyword/${id}/movies`, {
    params: { page: pageParam },
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
}

// Fetch TV Shows by Keyword
async function fetchTvByKeywords(
  id: number,
  { pageParam = 1 }: { pageParam?: number }
): Promise<{
  tvShows: Tv[];
  currentPage: number | null;
  nextPage: number | null;
  prevPage: number | null;
}> {
  await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 seconds delay
  const response = await axiosInstance.get(`/discover/tv?with_keywords=${id}`, {
    params: { page: pageParam },
  });

  console.log(response.data.results); // Tambahkan ini untuk memeriksa response data API

  return {
    tvShows: response.data.results, // Pastikan ini sesuai dengan struktur yang dikembalikan API
    nextPage:
      response.data.page < response.data.total_pages
        ? response.data.page + 1
        : null,
    currentPage: response.data.page,
    prevPage: response.data.page > 1 ? response.data.page - 1 : null,
  };
}

async function fetchMovieByGenre(
  id: number,
  { pageParam = 1 }: { pageParam?: number }
): Promise<{
  movies: Movie[];
  currentPage: number | null;
  nextPage: number | null;
  prevPage: number | null;
}> {
  await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 seconds delay
  const response = await axiosInstance.get(`/discover/movie?with_genres=${id}`, {
    params: { page: pageParam },
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
}
async function fetchTVByGenre(
  id: number,
  { pageParam = 1 }: { pageParam?: number }
): Promise<{
  tvShows: Tv[];
  currentPage: number | null;
  nextPage: number | null;
  prevPage: number | null;
}> {
  await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 seconds delay
  const response = await axiosInstance.get(`/discover/tv?with_genres=${id}`, {
    params: { page: pageParam },
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
}
async function fetchSearchMovie(
  query: string,
  { pageParam = 1 }: { pageParam?: number }
): Promise<{
  movies: Movie[];
  currentPage: number | null;
  nextPage: number | null;
  prevPage: number | null;
}> {
  await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 seconds delay
  const response = await axiosInstance.get(`/search/movie?query=${query}`, {
    params: { page: pageParam },
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
}
async function fetachSearchTv(
  query: string,
  { pageParam = 1 }: { pageParam?: number }
): Promise<{
  tvShows: Tv[];
  currentPage: number | null;
  nextPage: number | null;
  prevPage: number | null;
}> {
  await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 seconds delay
  const response = await axiosInstance.get(`/search/tv?query=${query}`, {
    params: { page: pageParam },
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
}

// Hook to handle infinite fetching for Movies
export const useInfiniteMovieByKeywords = (id: number) => {
  return useInfiniteQuery({
    queryKey: ["movies/keyword", id],
    queryFn: ({ pageParam = 1 }) => fetchMovieByKeywords(id, { pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  });
};

// Hook to handle infinite fetching for TV Shows
export const useInfiniteTvByKeywords = (id: number) => {
  return useInfiniteQuery({
    queryKey: ["tv/keyword", id],
    queryFn: ({ pageParam = 1 }) => fetchTvByKeywords(id, { pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  });
};

export const useInfiniteMovieByGenres = (id: number) => {
  return useInfiniteQuery({
    queryKey: ["movies/genre", id],
    queryFn: ({ pageParam = 1 }) => fetchMovieByGenre(id, { pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  });
};
export const useInfiniteTVByGenres = (id: number) => {
  return useInfiniteQuery({
    queryKey: ["tv/genre", id],
    queryFn: ({ pageParam = 1 }) => fetchTVByGenre(id, { pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  });
};
export const useInfinitySearchMovie = (query: string) => {
  return useInfiniteQuery({
    queryKey: ["search/movie", query],
    queryFn: ({ pageParam = 1 }) => fetchSearchMovie(query, { pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  });
};
export const useInfinitySearchTV = (query: string) => {
  return useInfiniteQuery({
    queryKey: ["search/tv", query],
    queryFn: ({ pageParam = 1 }) => fetachSearchTv(query, { pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    placeholderData : (prevData) => prevData,
  });
};

async function fetchSimpleSearhMovie(query: string): Promise<Movie[]> {
  try {
    const response = await axiosInstance.get(`/search/movie?query=${query}`);
    console.log('simple search movie:', response.data.results);
    return response.data.results; // Pastikan ini adalah array dari Post
  } catch (error) {
    console.error('Error fetching now movies:', error);
    throw error; // Re-throw the error for useQuery handling
  }
}

export const useSimpleSearchMovie = (query: string) => {
  return useQuery<Movie[], Error>({
    queryKey: ['simple/search/movie', query], 
    queryFn: () => fetchSimpleSearhMovie(query),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};



async function fetchSimpleSearchTv(query: string): Promise<Tv[]> {
  try {
    const response = await axiosInstance.get(`/search/tv?query=${query}`);
    return response.data.results; // Pastikan response.data sesuai dengan tipe Genres[]
  } catch (error) {
    console.error('Error fetching simple search tv:', error);
    throw error;
  }
}

// Hook untuk menggunakan React Query
export const useSimpleSearchTv = (query: string) =>{ // Tambahkan type annotation
  return useQuery<Tv[]>({
    queryKey: ['simple/search/tv', query],
    queryFn: () => fetchSimpleSearchTv(query),
    staleTime: 1000 * 60 * 5, // 5 menit
  });
};