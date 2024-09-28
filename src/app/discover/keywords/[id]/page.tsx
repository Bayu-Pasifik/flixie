"use client";
import React, { use, useEffect, useState } from "react";
import { motion } from "framer-motion";
import LoadingIndicator from "@/components/LoadingIndicator";
import MovieCard from "@/components/MovieCard";
import ToggleType from "@/components/ToggleType";
import ViewToggle from "@/components/ToogleView";
import {
  useInfiniteMovieByKeywords,
  useInfiniteTvByKeywords,
} from "@/hooks/useSearch";
import { useParams, useSearchParams } from "next/navigation";
import { useInView } from "react-intersection-observer"; 
import { LayoutTemplate } from "@/components/LayoutTemplate";
import { Movie, Tv } from "@/types/movieType";
import NewDataLoading from "@/components/NewDataLoading";
import MovieListCard from "@/components/MovieListCard";
import { useDetailKeywords } from "@/hooks/useKeywords";

export default function KeywordsPage() {
  const params = useParams(); 
  const keywordId = params.id;
  const movieId = typeof keywordId === "string" ? parseInt(keywordId, 10) : 0;
  const [viewMode, setViewMode] = useState("card");
  const [category, setCategory] = useState("Movie");

 const {
  data: keywords
 } = useDetailKeywords(movieId);

  const handleViewChange = (view: string) => {
    setViewMode(view);
  };

  const handleCategoryChange = (category: string) => {
    setCategory(category);
  };

  const {
    data: movies,
    isLoading: loadingMovies,
    error: errorMovies,
    fetchNextPage: fetchNextPageMovie,
    isFetchingNextPage: isFetchingNextPageMovie,
    hasNextPage: hasNextPageMovie,
  } = useInfiniteMovieByKeywords(movieId);

  const {
    data: tv,
    isLoading: loadingTv,
    error: errorTv,
    fetchNextPage: fetchNextPageTv,
    isFetchingNextPage: isFetchingNextPageTv,
    hasNextPage: hasNextPageTv,
  } = useInfiniteTvByKeywords(movieId);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      if (category === "Movie") {
        fetchNextPageMovie();
      } else {
        fetchNextPageTv();
      }
    }
  }, [inView, fetchNextPageMovie, fetchNextPageTv, category]);

  if (loadingMovies || loadingTv) return <LoadingIndicator />;
  if (errorMovies || errorTv)
    return <div>{errorMovies!.message || errorTv!.message}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Result Keyword: <span className="text-blue-500 uppercase">{keywords?.name}</span>
      </h1>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
        <div className="w-full sm:w-auto">
          <ToggleType
            selectedView={category}
            onViewChange={handleCategoryChange}
          />
        </div>
        <div className="flex flex-row justify-end">
          <ViewToggle selectedView={viewMode} onViewChange={handleViewChange} />
        </div>
      </div>

      {category === "Movie" && (
        <LayoutTemplate layout={viewMode}>
          {movies?.pages?.map((page, pageIndex) => (
            <React.Fragment key={pageIndex}>
              {page.movies.map((movie: Movie, index) => (
                <motion.div
                  key={movie.id} 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  {viewMode === "card" ? (
                    <MovieCard
                      id={movie.id}
                      title={movie.title}
                      overview={movie.overview || "No overview available"}
                      posterPath={movie.poster_path || ""}
                    />
                  ) : (
                    <MovieListCard
                      id={movie.id}
                      title={movie.title}
                      overview={movie.overview || "No overview available"}
                      posterPath={movie.poster_path || ""}
                    />
                  )}
                </motion.div>
              ))} 
            </React.Fragment>
          ))}
        </LayoutTemplate>
      )}

      {category === "TV" && (
        <LayoutTemplate layout={viewMode}>
          {tv?.pages?.map((page, pageIndex) => (
            <React.Fragment key={pageIndex}>
              {page.tvShows?.map((tvShow: Tv, index) => (
                <motion.div
                  key={tvShow.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  {viewMode === "card" ? (
                    <MovieCard
                      id={tvShow.id}
                      title={tvShow.name}
                      overview={tvShow.overview || "No overview available"}
                      posterPath={tvShow.poster_path || ""}
                    />
                  ) : (
                    <MovieListCard
                      id={tvShow.id}
                      title={tvShow.name}
                      overview={tvShow.overview || "No overview available"}
                      posterPath={tvShow.poster_path || ""}
                    />
                  )}
                </motion.div>
              ))}
            </React.Fragment>
          ))}
        </LayoutTemplate>
      )}

      {isFetchingNextPageMovie && category === "Movie" && (
        <div className="text-center mt-4">
          <NewDataLoading />
        </div>
      )}

      {isFetchingNextPageTv && category === "TV" && (
        <div className="text-center mt-4">
          <NewDataLoading />
        </div>
      )}

      <div ref={ref} className="h-1"></div>
      <div className="text-center text-2xl font-bold my-4">
        {!hasNextPageMovie && category === "Movie" && "Congrats, you've reached the end!"}
        {!hasNextPageTv && category === "TV" && "Congrats, you've reached the end!"}
      </div>
    </div>
  );
}
