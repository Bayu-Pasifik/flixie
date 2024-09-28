"use client";
import { LayoutTemplate } from "@/components/LayoutTemplate";
import MovieCard from "@/components/MovieCard";
import { useMovieGenre } from "@/hooks/useGenres";
import { useInfiniteMovieByGenres } from "@/hooks/useSearch";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import ToggleType from "@/components/ToggleType";
import ViewToggle from "@/components/ToogleView";
import { useInView } from "react-intersection-observer";
import NewDataLoading from "@/components/NewDataLoading";

export default function GenresPage() {
  const {
    data: genres,
    isLoading: genreLoading,
    error: genreError,
  } = useMovieGenre();
  const params = useParams();
  const keywordId = params.id;
  const movieId = typeof keywordId === "string" ? parseInt(keywordId, 10) : 0;
  const genre = Array.isArray(genres)
    ? genres.find((genre) => genre.id === movieId)
    : null;

  const {
    data: movie,
    isLoading: movieLoading,
    error: movieError,
    hasNextPage: hasNextPageMovie,
    fetchNextPage: fetchNextPageMovie,
    isFetchingNextPage: isFetchingNextPageMovie,
  } = useInfiniteMovieByGenres(movieId);

  const [viewMode, setViewMode] = useState("card"); // State untuk mengatur view
  const [category, setCategory] = useState("Movie"); // State untuk toggle type

  const { ref, inView } = useInView(); // Intersection observer

  // Trigger fetching next page when reaching bottom of the page
  useEffect(() => {
    if (inView && hasNextPageMovie) {
      fetchNextPageMovie();
    }
  }, [inView, hasNextPageMovie, fetchNextPageMovie]);

  // Handle loading and error states
  if (genreLoading || movieLoading) return <p>Loading...</p>;
  if (genreError || movieError)
    return <p>{genreError?.message || movieError?.message}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Result Genre:{" "}
        <span className="text-blue-500 uppercase">{genre?.name}</span>
      </h1>

      {/* Responsive controls for view and toggle */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
        <div className="w-full sm:w-auto">
          <ToggleType selectedView={category} onViewChange={setCategory} />
        </div>
        <div className="flex flex-row justify-end">
          <ViewToggle selectedView={viewMode} onViewChange={setViewMode} />
        </div>
      </div>

      <LayoutTemplate layout={viewMode}>
        {movie?.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.movies.map((movie) => (
              <MovieCard
                id={movie.id}
                key={movie.id}
                title={movie.title}
                overview={movie.overview}
                posterPath={movie.poster_path}
                type="movie"
              />
            ))}
          </React.Fragment>
        ))}
      </LayoutTemplate>

      {/* Infinite scroll loader */}
      {isFetchingNextPageMovie && <NewDataLoading />}

      {/* Intersection observer trigger */}
      <div ref={ref} className="h-1"></div>

      {/* End of data message */}
      {!hasNextPageMovie && (
        <div className="text-center text-2xl font-bold my-4">
          You've reached the end!
        </div>
      )}
    </div>
  );
}
