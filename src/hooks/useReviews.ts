import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import { Reviews } from "@/types/reviews";







async function fetchReviewsTv(id: number): Promise<Reviews[]> {
    try {
      const response = await axiosInstance.get(`/tv/${id}/reviews`);
      return response.data.results; // Pastikan ini adalah array dari Post
    } catch (error) {
      console.error('Error fetching now movies:', error);
      throw error; // Re-throw the error for useQuery handling
    }
  }
  
  export const useReviewsTv = (id:number) => {
    return useQuery<Reviews[], Error>({
      queryKey: ['tv/reviews', id],
      queryFn: ()=> fetchReviewsTv(id),
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };