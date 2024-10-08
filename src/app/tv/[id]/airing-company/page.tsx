"use client";
import { LayoutTemplate } from "@/components/LayoutTemplate";
import MovieCard from "@/components/MovieCard";
import NewDataLoading from "@/components/NewDataLoading";
import SkeletonMovieCard from "@/components/SkeletonMovieCard";
import { useDetailNetwork } from "@/hooks/useDetailMovie";
import { useInfinityTvByAringCompany } from "@/hooks/useDiscover";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
export default function TvAiringCompanyPage() {
  const { id } = useParams();
  const tvId = typeof id === "string" ? parseInt(id, 10) : 0;
  const { data } = useDetailNetwork(tvId);
  const {
    data: tvShows,
    isLoading,
    error,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfinityTvByAringCompany(tvId);
  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 uppercase">
        Tv Show Aired By {data?.name}
      </h1>
      <LayoutTemplate layout="card">
        {isLoading
          ? Array.from({ length: 20 }).map((_, index) => (
              <SkeletonMovieCard key={`movie-skeleton-${index}`} />
            ))
          : tvShows?.pages.map((Tv) =>
              Tv.tvShows.map((tv, index) => (
                <div key={index}>
                  <MovieCard
                    id={tv.id}
                    title={tv.name}
                    overview={tv.overview || "No overview available"}
                    posterPath={tv.poster_path || ""}
                    key={index}
                    type="tv"
                  />
                </div>
              ))
            )}
      </LayoutTemplate>
      {!hasNextPage && (
        <p className="text-center font-bold text-2xl mt-6">No more tv shows</p>  
      )}
      {isFetchingNextPage && (
          <NewDataLoading />
      )}
      <div ref={ref} className="h-1"/>
    </div>
  );
}
