"use client";

import { LayoutTemplate } from "@/components/LayoutTemplate";
import MovieCard from "@/components/MovieCard";
import NewDataLoading from "@/components/NewDataLoading";
import SkeletonMovieCard from "@/components/SkeletonMovieCard";
import { useMovieGenre, useTvGenres } from "@/hooks/useGenres";
import { useInfiniteTVByGenres } from "@/hooks/useSearch";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export default function MovieGenresPage() {
  const { id } = useParams();
  const genreId = typeof id === "string" ? parseInt(id, 10) : 0;
  const { data: genres } = useTvGenres();
  const genre = Array.isArray(genres)
    ? genres.find((genre) => genre.id === genreId)
    : null;
  console.log(genre);
  const {
    data: movies,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteTVByGenres(genreId);
  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Tv Shows with Genre of {genre?.name}
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
                  overview={Tv.overview || 'No overview available'}
                  posterPath={Tv.poster_path || ''}
                  type="tv"
                />
              ))
            )}
      </LayoutTemplate>
      {isFetchingNextPage && <NewDataLoading />}
      {!hasNextPage && (
        <p className="text-center font-2xl text-bold">
          Congrat's you've reached the end
        </p>
      )}
      <div ref={ref}></div>
    </div>
  );
}
