"use client";

import { LayoutTemplate } from "@/components/LayoutTemplate";
import MovieCard from "@/components/MovieCard";
import SkeletonMovieCard from "@/components/SkeletonMovieCard";
import { useDetailPerson, usePersonMovieCredits } from "@/hooks/usePerson";
import { useParams } from "next/navigation";

export default function PersonMoviePage() {
  const { id } = useParams();
  const personId = typeof id === "string" ? parseInt(id, 10) : 0;
  const { data: person } = useDetailPerson(personId);
  const {
    data: movies,
    isLoading: isLoadingMovie,
    error: movieError,
  } = usePersonMovieCredits(personId);
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4"> {person?.name} - Movies</h1>
      <LayoutTemplate layout="card">
        {isLoadingMovie ? (
          Array.from({ length: 20 }).map((_, index) => (
            <SkeletonMovieCard key={`movie-skeleton-${index}`} />
          ))
        ) : movieError ? (
          `Error: ${movieError.message}`
        ) : (
          movies?.cast.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              overview={movie.overview || "No overview available"}
              posterPath={movie.poster_path || ""}
            />
          ))
        )}
      </LayoutTemplate>
    </div>
  );
}
