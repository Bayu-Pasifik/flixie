"use client";
import { LayoutTemplate } from "@/components/LayoutTemplate";
import MovieCard from "@/components/MovieCard";
import MovieListCard from "@/components/MovieListCard";
import NewDataLoading from "@/components/NewDataLoading";
import TimeToggle from "@/components/ToggleTime";
import ViewToggle from "@/components/ToogleView";
import { Button } from "@/components/ui/button";
import { useInfinityAiringTV } from "@/hooks/useCurrentlyAiring";
import { useInfinityTopRateTv } from "@/hooks/useTopRate";
import { useInfinityTrendingTv } from "@/hooks/useTrending";
import { Tv } from "@/types/movieType";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import SkeletonMovieCard from "@/components/SkeletonMovieCard";

export default function TvPage() {
  const chosenCategories = ["airing today", "trending", "top rated"];

  // Mengambil nilai dari sessionStorage atau menginisialisasi default jika tidak ada
  const [currentCategory, setCurrentCategory] = useState(
    sessionStorage.getItem("category") || "airing today"
  );
  const [viewMode, setViewMode] = useState(
    sessionStorage.getItem("viewMode") || "card"
  );
  const [timeMode, setTimeMode] = useState(
    sessionStorage.getItem("timeMode") || "day"
  );

  const handleTimeChange = (time: string) => {
    setTimeMode(time);
  };

  const handleViewChange = (view: string) => {
    setViewMode(view);
  };

  // Menyimpan setiap perubahan ke sessionStorage
  useEffect(() => {
    sessionStorage.setItem("category", currentCategory);
  }, [currentCategory]);

  useEffect(() => {
    sessionStorage.setItem("viewMode", viewMode);
  }, [viewMode]);

  useEffect(() => {
    sessionStorage.setItem("timeMode", timeMode);
  }, [timeMode]);

  // Define states and data for each category
  const { data, isLoading, error, fetchNextPage, isFetchingNextPage } =
    currentCategory === "airing today"
      ? useInfinityAiringTV()
      : currentCategory === "top rated"
      ? useInfinityTopRateTv()
      : useInfinityTrendingTv(timeMode);

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

  // if (isLoading) return <LoadingIndicator />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="bg-slate-800 w-full h-full min-h-screen p-4">
      <div className="flex flex-row justify-between mb-7">
        <div className="flex flex-row">
          {chosenCategories.map((category) => (
            <Button
              className={`bg-blue-600 text-white rounded-lg px-3 py-6 mr-2 mb-2 text-sm uppercase ${
                currentCategory === category
                  ? "bg-orange-700 border border-double"
                  : ""
              }`}
              key={category}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </Button>
          ))}
        </div>
        <ViewToggle selectedView={viewMode} onViewChange={handleViewChange} />
      </div>

      {currentCategory === "trending" && (
        <div className="flex justify-center p-1 mb-4">
          <TimeToggle selectedView={timeMode} onViewChange={handleTimeChange} />
        </div>
      )}

      {/* Apply LayoutTemplate here with the chosen viewMode */}
      <LayoutTemplate layout={viewMode}>
        {isLoading &&
          Array.from({ length: 20 }).map((_, index) => <SkeletonMovieCard />)}
        {data?.pages.map((page) =>
          page.tvShows.map((tv: Tv, index) => (
            <motion.div
              key={index}
              className="p-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div key={tv.id}>
                {viewMode === "card" ? (
                  <MovieCard
                  key={tv.id}
                    type="tv"
                    id={tv.id}
                    title={tv.name}
                    overview={tv.overview || "No overview"}
                    posterPath={tv.poster_path}
                  />
                ) : (
                  <MovieListCard
                    key={tv.id}
                    type="tv"
                    id={tv.id}
                    title={tv.name}
                    overview={tv.overview || "No overview"}
                    posterPath={tv.poster_path}
                  />
                )}
              </div>
            </motion.div>
          ))
        )}
      </LayoutTemplate>

      {isFetchingNextPage && (
        <div className="text-center mt-4">
          <NewDataLoading />
        </div>
      )}

      <div ref={ref}></div>
    </div>
  );
}
