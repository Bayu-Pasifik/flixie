import axiosInstance from "@/lib/axios";
import { Tv } from "@/types/movieType";
import { useInfiniteQuery } from "@tanstack/react-query";

async function fetchTvByAringCompany(
    id: number,
    { pageParam = 1 }: { pageParam?: number }
  ): Promise<{
    tvShows: Tv[];
    currentPage: number | null;
    nextPage: number | null;
    prevPage: number | null;
  }> {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 seconds delay
    const response = await axiosInstance.get(`/discover/tv`, {
      params: { with_networks: id,page: pageParam },
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

  export const useInfinityTvByAringCompany = (id: number) => {
    return useInfiniteQuery({
      queryKey: ["tv/airing_company", id],
      queryFn: ({ pageParam = 1 }) => fetchTvByAringCompany(id, { pageParam }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    });
  };