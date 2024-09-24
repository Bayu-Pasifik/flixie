"use client";
import { useInView } from "react-intersection-observer";
import MovieCard from "@/components/MovieCard";
import MovieListCard from "@/components/MovieListCard"; // Import versi list panjang
import NewDataLoading from "@/components/NewDataLoading";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Movie } from "@/types/movieType";
import LoadingIndicator from "@/components/LoadingIndicator";
import React from "react";
import { useInfinityTrendingMovie } from "@/hooks/useTrending";
import TimeToggle from "@/components/ToggleTime";
import ViewToggle from "@/components/ToogleView";
import { time } from "console";

const TrendingPage = () => {
  const { ref, inView } = useInView();
  const [viewMode, setViewMode] = useState("card");
  const [timeMode, setTimeMode] = useState("day");
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfinityTrendingMovie(timeMode);

  const handleViewChange = (view: string) => {
    setViewMode(view);
  };

  const handleTimeChange = (time: string) => {
    setTimeMode(time);
  };

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (error) return <div>{error.message}</div>;

  if (isLoading) {
    return (
      <div>
        <LoadingIndicator />
      </div>
    );
  }

  // Define styles for card and list view modes
  const styleCard =
    "grid-cols-3 gap-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4";
  const styleList =
    "grid-cols-1 gap-1 md:grid-cols-1 lg:grid-cols-1 2xl:grid-cols-1";

  return (
    <div className="bg-slate-800 min-h-screen p-4">
      <div>
        <div className="flex justify-between p-1 mb-4">
          <h1 className="text-3xl font-bold">Trending Movie Movies</h1>
          <ViewToggle selectedView={viewMode} onViewChange={handleViewChange} />
        </div>

        <div className="flex justify-center p-1 mb-4">
          <TimeToggle selectedView={timeMode} onViewChange={handleTimeChange} />
        </div>
        {/* Render seluruh data film yang telah dimuat dengan animasi */}
        <div className={`grid ${viewMode === "card" ? styleCard : styleList}`}>
          {data?.pages?.map((page, pageIndex) => (
            <React.Fragment key={pageIndex}>
              {page.movies.map((movie: Movie, index) => (
                <motion.div
                  key={index}
                  className="p-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  {viewMode === "card" ? (
                    <MovieCard
                      id={movie.id}
                      title={movie.title}
                      overview={movie.overview}
                      posterPath={movie.poster_path}
                    />
                  ) : (
                    <MovieListCard
                      id={movie.id}
                      title={movie.title}
                      overview={movie.overview}
                      posterPath={movie.poster_path}
                    />
                  )}
                </motion.div>
              ))}
            </React.Fragment>
          ))}
        </div>

        {/* Fetch more data when the user scrolls */}
        {isFetchingNextPage && (
          <div className="text-center mt-4">
            <NewDataLoading />
          </div>
        )}
      </div>

      {/* Intersection observer trigger */}
      <div ref={ref} className="h-1"></div>
    </div>
  );
};

export default TrendingPage;
