"use client";

import { LayoutTemplate } from "@/components/LayoutTemplate";
import MovieCard from "@/components/MovieCard";
import NewDataLoading from "@/components/NewDataLoading";
import SkeletonMovieCard from "@/components/SkeletonMovieCard";
import { useCreditsTv } from "@/hooks/useCredits";
import { useDetailTV } from "@/hooks/useDetailMovie";
import { useInfinityRecommendationsTv } from "@/hooks/useRecomendations";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export default function TvCastPage() {
  const { id } = useParams();
  const tvId = typeof id === "string" ? parseInt(id, 10) : 0;
  const { data } = useDetailTV(tvId);
  const {
    data: recommendations,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinityRecommendationsTv(tvId);

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
        <span className="text-teal-500">if you like</span> the {""}
        <span className="text-sky-500">{data?.name}</span> {""}
        here are some <span className="text-teal-500">recommendations</span> {""}
        for you
      </h1>
      <LayoutTemplate layout="card">
        {isLoading
          ? Array.from({ length: 20 }).map((_, index) => (
              <SkeletonMovieCard key={`movie-skeleton-${index}`} />
            ))
          : recommendations?.pages.map((page) =>
              page.recommendations.map((member) => (
                <MovieCard
                  key={member.id}
                  id={member.id}
                  title={member.name}
                  overview={`(${member.overview || "Unknown"})`} // Format overview for cast members with parentheses
                  posterPath={member.poster_path || ""}
                  type="person"
                />
              ))
            )}
      </LayoutTemplate>
      {!hasNextPage && (
        <div className="text-center font-bold text-2xl mt-6">
          You have reached the end of the list
        </div>
      )}
      {isFetchingNextPage && <NewDataLoading />}
      <div ref={ref} />
    </div>
  );
}
