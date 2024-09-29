"use client";
import { LayoutTemplate } from "@/components/LayoutTemplate";
import MovieCard from "@/components/MovieCard";
import { useMovieGenre } from "@/hooks/useGenres";
import {
  useInfiniteMovieByGenres,
  useInfiniteTVByGenres,
} from "@/hooks/useSearch";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import ToggleType from "@/components/ToggleType";
import ViewToggle from "@/components/ToogleView";
import { useInView } from "react-intersection-observer";
import NewDataLoading from "@/components/NewDataLoading";
import MovieListCard from "@/components/MovieListCard";
import { motion } from "framer-motion";
import LoadingIndicator from "@/components/LoadingIndicator";

export default function GenresPage() {
  const {
    data: genres,
    isLoading: genreLoading,
    error: genreError,
  } = useMovieGenre();
  const params = useParams();
  const keywordId = params.id;
  const genreId = typeof keywordId === "string" ? parseInt(keywordId, 10) : 0;
  const genre = Array.isArray(genres)
    ? genres.find((genre) => genre.id === genreId)
    : null;

  const [viewMode, setViewMode] = useState("card"); // State untuk mengatur view
  const [category, setCategory] = useState("Movie"); // State untuk toggle type

  const { ref, inView } = useInView(); // Intersection observer

  // Infinite scroll logic for Movies
  const {
    data: movie,
    isLoading: movieLoading,
    error: movieError,
    hasNextPage: hasNextPageMovie,
    fetchNextPage: fetchNextPageMovie,
    isFetchingNextPage: isFetchingNextPageMovie,
  } = useInfiniteMovieByGenres(genreId);

  // Infinite scroll logic for TV shows
  const {
    data: tv,
    isLoading: tvLoading,
    error: tvError,
    hasNextPage: hasNextPageTv,
    fetchNextPage: fetchNextPageTv,
    isFetchingNextPage: isFetchingNextPageTv,
  } = useInfiniteTVByGenres(genreId);

  // Infinite scroll fetching based on category
  useEffect(() => {
    if (inView) {
      if (category === "Movie" && hasNextPageMovie) {
        fetchNextPageMovie();
      } else if (category === "TV" && hasNextPageTv) {
        fetchNextPageTv();
      }
    }
  }, [inView, category, fetchNextPageMovie, fetchNextPageTv]);

  // Handle loading and error states
  if (genreLoading || movieLoading || tvLoading) return <LoadingIndicator />;
  if (genreError || movieError || tvError)
    return (
      <p>{genreError?.message || movieError?.message || tvError?.message}</p>
    );

  // Handle case when no data is available
  const isMovieEmpty =
    category === "Movie" && (!movie || movie.pages[0]?.movies.length === 0);
  const isTvEmpty =
    category === "TV" && (!tv || tv.pages[0]?.tvShows.length === 0);

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

      {category === "Movie" && (
        <>
          {isMovieEmpty ? (
            <div className="flex justify-center items-center min-h-screen">
              <p className="text-center text-2xl font-bold">No data movie</p>
            </div>
          ) : (
            <LayoutTemplate layout={viewMode}>
              {movie?.pages.map((page, index) => (
                <React.Fragment key={index}>
                  {page.movies.map((movie) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                    >
                      {viewMode === "card" ? (
                        <MovieCard
                          id={movie.id}
                          key={movie.id}
                          title={movie.title}
                          overview={movie.overview}
                          posterPath={movie.poster_path}
                          type={category.toLowerCase()}
                        />
                      ) : (
                        <MovieListCard
                          id={movie.id}
                          key={movie.id}
                          title={movie.title}
                          overview={movie.overview}
                          posterPath={movie.poster_path}
                          type={category.toLowerCase()}
                        />
                      )}
                    </motion.div>
                  ))}
                </React.Fragment>
              ))}
            </LayoutTemplate>
          )}
        </>
      )}

      {category === "TV" && (
        <>
          {isTvEmpty ? (
            <div className="flex justify-center items-center min-h-screen">
              <p className="text-center text-2xl font-bold">No data TV</p>
            </div>
          ) : (
            <LayoutTemplate layout={viewMode}>
              {tv?.pages.map((page, index) => (
                <React.Fragment key={index}>
                  {page.tvShows.map((tv) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                    >
                      {viewMode === "card" ? (
                        <MovieCard
                          id={tv.id}
                          key={tv.id}
                          title={tv.name}
                          overview={tv.overview}
                          posterPath={tv.poster_path}
                          type={category.toLowerCase()}
                        />
                      ) : (
                        <MovieListCard
                          id={tv.id}
                          key={tv.id}
                          title={tv.name}
                          overview={tv.overview}
                          posterPath={tv.poster_path}
                          type={category.toLowerCase()}
                        />
                      )}
                    </motion.div>
                  ))}
                </React.Fragment>
              ))}
            </LayoutTemplate>
          )}
        </>
      )}

      {/* Infinite scroll loader */}
      {(isFetchingNextPageMovie || isFetchingNextPageTv) && <NewDataLoading />}

      {/* Intersection observer trigger */}
      <div ref={ref} className="h-1"></div>

      {/* End of data message */}
      {!hasNextPageMovie && !hasNextPageTv && (
        <div className="text-center text-2xl font-bold my-4">
          You've reached the end!
        </div>
      )}
    </div>
  );
}
