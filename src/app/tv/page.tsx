"use client";
// eslint-disable-next-line react-hooks/exhaustive-deps
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
import { Suspense, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import SkeletonMovieCard from "@/components/SkeletonMovieCard";
import LoadingIndicator from "@/components/LoadingIndicator";

function TvPage() {
  const chosenCategories = ["airing today", "trending", "top rated"];

  const [currentCategory, setCurrentCategory] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("category") || "airing today";
    }
    return "airing today";
  });
  const [viewMode, setViewMode] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("viewMode") || "card";
    }
    return "card";
  });
  const [timeMode, setTimeMode] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("timeMode") || "day";
    }
    return "day";
  });

  const handleTimeChange = (time: string) => {
    setTimeMode(time);
  };

  const handleViewChange = (view: string) => {
    setViewMode(view);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("category", currentCategory);
    }
  }, [currentCategory]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("viewMode", viewMode);
    }
  }, [viewMode]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("timeMode", timeMode);
    }
  }, [timeMode]);

  const airingData = useInfinityAiringTV();
  const topRatedData = useInfinityTopRateTv();
  const trendingData = useInfinityTrendingTv(timeMode);

  const { data, isLoading, error, fetchNextPage, isFetchingNextPage } =
    currentCategory === "airing today"
      ? airingData
      : currentCategory === "top rated"
      ? topRatedData
      : trendingData;

  const { ref, inView } = useInView({});

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  const handleCategoryChange = (category: string) => {
    setCurrentCategory(category);
  };

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

      <LayoutTemplate layout={viewMode}>
        {isLoading &&
          Array.from({ length: 20 }).map((_, index) => (
            <SkeletonMovieCard key={index} />
          ))}
        {data?.pages.map((page) =>
          page.tvShows.map((tv: Tv) => (
            <motion.div
              key={tv.id}
              className="p-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {viewMode === "card" ? (
                <MovieCard
                  key={tv.id}
                  type="tv"
                  id={tv.id}
                  title={tv.name}
                  overview={tv.overview || "No overview"}
                  posterPath={tv.poster_path || ""}
                />
              ) : (
                <MovieListCard
                  key={tv.id}
                  type="tv"
                  id={tv.id}
                  title={tv.name}
                  overview={tv.overview || "No overview"}
                  posterPath={tv.poster_path || ""}
                />
              )}
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

export default function TvPages() {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <TvPage />
    </Suspense>
  );
}
