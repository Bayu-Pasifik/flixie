"use client";
import React, { useEffect, useState } from "react";
import { Movie } from "@/types/movieType";
import { useInfinityAiring } from "@/hooks/useCurrentlyAiring";
import LoadingIndicator from "@/components/LoadingIndicator";
import { useInView } from "react-intersection-observer";
import MovieCard from "@/components/MovieCard";
import NewDataLoading from "@/components/NewDataLoading";
import { motion } from "framer-motion";
import { LayoutTemplate } from "@/components/LayoutTemplate";
import ViewToggle from "@/components/ToogleView";
import MovieListCard from "@/components/MovieListCard";

const CurrentlyAiringPage = () => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfinityAiring();

  const { ref, inView } = useInView();
  const [viewMode, setViewMode] = useState("card");

  const handleViewChange = (view: string) => {
    setViewMode(view);
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

  return (
    <div className="bg-slate-800 min-h-screen p-4">
      <div>
        <div className="flex justify-between p-1">
          <h1 className="text-3xl font-bold mb-4 p-3">Currently Airing</h1>
          <ViewToggle onViewChange={handleViewChange} selectedView={viewMode} />
        </div>
        {/* Render seluruh data film yang telah dimuat dengan animasi */}
        <LayoutTemplate layout={viewMode}>
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

export default CurrentlyAiringPage;
