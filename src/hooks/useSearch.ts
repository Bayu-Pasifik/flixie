import { Movie, Tv } from "@/types/movieType";
import { useInfiniteQuery } from "@tanstack/react-query";
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