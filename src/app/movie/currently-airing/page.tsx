"use client";
import React, { useEffect } from "react";
import { Movie } from "@/types/movieType";
import { useInfinityAiring } from "@/hooks/useCurrentlyAiring";
import LoadingIndicator from "@/components/LoadingIndicator";
import { useInView } from "react-intersection-observer";
import MovieCard from "@/components/MovieCard";
import NewDataLoading from "@/components/NewDataLoading";
import { motion } from "framer-motion";
import { LayoutTemplate } from "@/components/LayoutTemplate";

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
        <h1 className="text-3xl font-bold mb-4 p-3">Currently Airing</h1>

        {/* Render seluruh data film yang telah dimuat dengan animasi */}
        <LayoutTemplate layout="card">
          
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
                  <MovieCard
                    id={movie.id}
                    title={movie.title}
                    overview={movie.overview}
                    posterPath={movie.poster_path}
                  />
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
