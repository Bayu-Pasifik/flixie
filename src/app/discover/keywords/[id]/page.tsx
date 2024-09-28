"use client";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import LoadingIndicator from "@/components/LoadingIndicator";
import MovieCard from "@/components/MovieCard";
import ToggleType from "@/components/ToggleType";
import ViewToggle from "@/components/ToogleView";
import { useInfiniteMovieByKeywords } from "@/hooks/useSearch";
import { useParams, useSearchParams } from "next/navigation";
import { useInView } from "react-intersection-observer"; // Import the Intersection Observer hook
import { LayoutTemplate } from "@/components/LayoutTemplate";
import { Movie } from "@/types/movieType";
import NewDataLoading from "@/components/NewDataLoading";

export default function KeywordsPage() {
  const params = useParams(); // Mengambil id dari URL dinamis
  const searchParams = useSearchParams(); // Mengambil query string

  const keywordId = params.id; // Ambil id dari params
  const keywordName = searchParams.get("name"); // Ambil nama dari query string
  const movieId = typeof keywordId === "string" ? parseInt(keywordId, 10) : 0;

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteMovieByKeywords(movieId);

  // Hook untuk intersection observer
  const { ref, inView } = useInView();

  // Fetch more data when the last element is in view
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  if (isLoading) return <LoadingIndicator />;
  if (error) return <div>{error.message}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Result Keyword: {keywordId} - {keywordName}
      </h1>

      {/* Flex container to align the elements */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
        <div className="w-full sm:w-auto">
          <ToggleType selectedView="Tv" onViewChange={() => {}} />
        </div>
        <div className="flex flex-row justify-end">
          <ViewToggle selectedView="card" onViewChange={() => {}} />
        </div>
      </div>

      {/* Layout for displaying Movie Cards */}
      <LayoutTemplate layout="card">
        {data?.pages?.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.movies.map((movie: Movie, index) => (
              <motion.div
                key={movie.id} // Use movie.id instead of index for better key usage
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <MovieCard
                  id={movie.id}
                  title={movie.title}
                  overview={movie.overview}
                  posterPath={movie.poster_path || ""}
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

      {/* Intersection observer trigger */}
      <div ref={ref} className="h-1"></div>
      <div className="text-center text-2xl font-bold">
        {!hasNextPage && "Congrats, you've reached the end!"}
      </div>
    </div>
  );
}
