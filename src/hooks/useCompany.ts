import axios from "axios";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import  axiosInstance  from "../lib/axios";
import { Company } from "@/types/companyType";

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
