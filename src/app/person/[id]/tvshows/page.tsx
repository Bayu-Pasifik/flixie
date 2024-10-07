"use client";

import { LayoutTemplate } from "@/components/LayoutTemplate";
import MovieCard from "@/components/MovieCard";
import SkeletonMovieCard from "@/components/SkeletonMovieCard";
import { useDetailPerson, usePersonTvCredits } from "@/hooks/usePerson";
import { useParams } from "next/navigation";

export default function PersonMoviePage() {
  const { id } = useParams();
  const personId = typeof id === "string" ? parseInt(id, 10) : 0;
  const { data: person } = useDetailPerson(personId);
  const {
    data: tvShows,
    isLoading: isLoadingMovie,
    error: movieError,
  } = usePersonTvCredits(personId);
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        {" "}
        {person?.name} - Cast Tv Shows
      </h1>
      <LayoutTemplate layout="card">
        {isLoadingMovie
          ? Array.from({ length: 20 }).map((_, index) => (
              <SkeletonMovieCard key={`movie-skeleton-${index}`} />
            ))
          : movieError
          ? `Error: ${movieError.message}`
          : tvShows?.cast.map((tv) => (
              <MovieCard
                key={tv.id}
                id={tv.id}
                title={`${tv.name} (${tv.character || "-"})`}
                overview={tv.overview || "No overview available"}
                posterPath={tv.poster_path || ""}
              />
            ))}
      </LayoutTemplate>
      <h1 className="text-2xl font-bold my-8">
        {" "}
        {person?.name} - Crew Tv Shows
      </h1>
      {tvShows?.crew.length === 0 && (
        <p className="text-center font-bold text-2xl">No tv shows</p>
      )}
      <LayoutTemplate layout="card">
        {isLoadingMovie
          ? Array.from({ length: 20 }).map((_, index) => (
              <SkeletonMovieCard key={`movie-skeleton-${index}`} />
            ))
          : movieError
          ? `Error: ${movieError.message}`
          : tvShows?.crew.map((tv) => (
              <MovieCard
                key={tv.id}
                id={tv.id}
                title={`${tv.name} (${tv.job || "-"})`}
                overview={tv.overview || "No overview available"}
                posterPath={tv.poster_path || ""}
              />
            ))}
      </LayoutTemplate>
    </div>
  );
}
