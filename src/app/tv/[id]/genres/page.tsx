"use client";

import { LayoutTemplate } from "@/components/LayoutTemplate";
import MovieCard from "@/components/MovieCard";
import SkeletonMovieCard from "@/components/SkeletonMovieCard";
import { useMovieGenre } from "@/hooks/useGenres";
import { useInfiniteTVByGenres } from "@/hooks/useSearch";
import { useParams } from "next/navigation";

export default function MovieGenresPage() {
  const { id } = useParams();
  const genreId = typeof id === "string" ? parseInt(id, 10) : 0;
  const { data: genres } = useMovieGenre();
  const genre = Array.isArray(genres)
    ? genres.find((genre) => genre.id === genreId)
    : null;
  const { data: movies, isLoading, error } = useInfiniteTVByGenres(genreId);
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
                  overview={Tv.overview}
                  posterPath={Tv.poster_path}
                />
              ))
            )}
      </LayoutTemplate>
    </div>
  );
}
