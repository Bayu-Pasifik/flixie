import { Movie } from "@/types/movieType";
import { useInfiniteQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
async function fetchMovieByKeywords(
    id: number,
    { pageParam = 1 }: { pageParam?: number }
  ): Promise<{
    movies: Movie[];
    currentPage: number | null;
    nextPage: number | null;
    prevPage: number | null;
  }> {
    try {
      // Simulate delay to show animations
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 seconds delay
  
      const response = await axiosInstance.get(`/keyword/${id}/movies`, {
        params: { page: pageParam },
      });
  
      console.log('Response:', response.data.results);
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
      console.error('Error fetching trending movies:', error);
      throw error; // Re-throw the error for useQuery handling
    }
  }
  
  // Hook untuk useInfiniteQuery
  export const useInfiniteMovieByKeywords = (id: number) => {
    return useInfiniteQuery({
      queryKey: ['movies/keyword', id],
      queryFn:  ({ pageParam = 1 }) => fetchMovieByKeywords(id,{ pageParam }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };