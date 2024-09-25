"use client";

import LoadingIndicator from "@/components/LoadingIndicator";
import MovieCard from "@/components/MovieCard";
import NewDataLoading from "@/components/NewDataLoading";
import { Button } from "@/components/ui/button";
import {
  useInfinityAiring,
  useInfinityAiringTV,
  useInfinityOnAir,
} from "@/hooks/useCurrentlyAiring";
import { useTopMovies } from "@/hooks/useTopRate";
import { useInfinityPopular } from "@/hooks/useTrending";
import { Tv } from "@/types/movieType";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer"; // Import Intersection Observer

export default function TvPage() {
  const chosenCategories = [
    "airing today",
    "popular",
    "top rated",
  ];
  const [currentCategory, setCurrentCategory] = useState("airing today");

  // Define states and data for each category
  const { data, isLoading, error, fetchNextPage, isFetchingNextPage } =
    currentCategory === "airing today"
      ? useInfinityAiringTV()
      : useInfinityPopular();

  const { ref, inView } = useInView({});

  // Fetch next page when element is in view
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  const handleCategoryChange = (category: string) => {
    setCurrentCategory(category);
  };

  if (isLoading) return <LoadingIndicator />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="bg-slate-800 w-full h-full min-h-screen p-4">
      <div className="flex flex-row mb-4">
        {chosenCategories.map((category) => (
          <Button
            className={`bg-blue-600 text-white rounded-lg px-3 py-6 mr-2 mb-2 text-sm uppercase ${
              currentCategory === category ? "bg-orange-700 border border-double" : ""
            }`}
            key={category}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
        {data?.pages.map((page) =>
          page.tvShows.map((tv: Tv) => (
            <MovieCard
              type="tv"
              key={tv.id}
              id={tv.id}
              title={tv.name}
              overview={tv.overview || "No overview"}
              posterPath={tv.poster_path}
            />
          ))
        )}
      </div>
      {isFetchingNextPage && (
        <div className="text-center mt-4">
          <NewDataLoading />
        </div>
      )}
      <div ref={ref}></div>
    </div>
  );
}
