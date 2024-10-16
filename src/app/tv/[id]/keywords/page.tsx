"use client";

import { LayoutTemplate } from "@/components/LayoutTemplate";
import MovieCard from "@/components/MovieCard";
import NewDataLoading from "@/components/NewDataLoading";
import SkeletonMovieCard from "@/components/SkeletonMovieCard";
import { useDetailKeywords } from "@/hooks/useKeywords";
import {
  useInfiniteTVByGenres,
  useInfiniteTvByKeywords,
} from "@/hooks/useSearch";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export default function TVKeywordsPage() {
  const { id } = useParams();
  const keywordId = typeof id === "string" ? parseInt(id, 10) : 0;
  const { data: keyword } = useDetailKeywords(keywordId);


  const {
    data: movies,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteTvByKeywords(keywordId);
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
        <span className="text-teal-500">TV Shows</span> with Keywords of{" "}
        <span className="text-sky-500">{keyword?.name}</span>
      </h1>
      <LayoutTemplate layout="card">
        {isLoading
          ? Array.from({ length: 20 }).map((_, index) => (
              <SkeletonMovieCard key={`movie-skeleton-${index}`} />
            ))
          : movies?.pages.map((tv) =>
              tv.tvShows.map((Tv) => (
                <MovieCard
                  key={Tv.id}
                  id={Tv.id}
                  title={Tv.name}
                  overview={Tv.overview || "No overview available"}
                  posterPath={Tv.poster_path || ""}
                  type="tv"
                />
              ))
            )}
      </LayoutTemplate>
      {isFetchingNextPage && <NewDataLoading />}
      {!hasNextPage && (
        <p className="text-center text-2xl font-bold mt-6">
          Congrat's you've reached the end
        </p>
      )}
      <div ref={ref}></div>
    </div>
  );
}
