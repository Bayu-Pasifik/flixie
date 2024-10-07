"use client";
import HomeCarousel from "@/components/Carousel";
import MovieCarousel from "@/components/MovieCarousel";
import { useCurrentlyAiring } from "@/hooks/useCurrentlyAiring";
import { useUpcomingMovies } from "@/hooks/useUpcomingMovie";
import LoadingIndicator from "@/components/LoadingIndicator";
import { useTrendingMovie } from "@/hooks/useTrending";
import SkeletonMovieCard from "@/components/SkeletonMovieCard";

export default function HomePage() {
  const {
    data: currentlyAiringData,
    isLoading: isLoadingAiring,
    error: airingError,
  } = useCurrentlyAiring();
  const {
    data: upcomingData,
    isLoading: isLoadingUpcoming,
    error: upcomingError,
  } = useUpcomingMovies();

  const {
    data: trendingData,
    isLoading: isLoadingTrending,
    error: trendingError,
  } = useTrendingMovie("week");

  // if (isLoadingAiring || isLoadingUpcoming || isLoadingTrending)
  //   return (
  //     <div className="flex flex-row">
  //       {Array.from({ length: 5 }).map((_, index) => (
  //         <SkeletonMovieCard key={index} />
  //       ))}
  //     </div>
  //   );
  if (airingError || upcomingError || trendingError)
    return (
      <div>
        Error: {(airingError || upcomingError || trendingError)?.message}
      </div>
    );

  return (
    <div className="bg-slate-800 min-h-screen h-full">
      <div className="mb-8">
        <HomeCarousel />
      </div>
      <div className="flex flex-row gap-4">
        {isLoadingAiring &&
          Array.from({ length: 6 }).map((_, index) => (
            <SkeletonMovieCard key={index} />
          ))}
      </div>
      {/* Currently Airing Section */}
      <MovieCarousel
        title="Currently Airing"
        movies={currentlyAiringData!}
        viewMoreUrl="/movie/currently-airing" // Add viewMoreUrl for currently airing movies
      />
      <div className="flex flex-row gap-4">
        {isLoadingTrending &&
          Array.from({ length: 6 }).map((_, index) => (
            <SkeletonMovieCard key={index} />
          ))}
      </div>
      {/* Upcoming Movies Section */}
      <MovieCarousel
        title="Movie Trending This Weeks"
        movies={trendingData!}
        viewMoreUrl="/movie/trending" // Add viewMoreUrl for upcoming movies
      />

      <div className="flex flex-row gap-4">
        {isLoadingUpcoming &&
          Array.from({ length: 6 }).map((_, index) => (
            <SkeletonMovieCard key={index} />
          ))}
      </div>
      {/* Upcoming Movies Section */}
      <MovieCarousel
        title="Upcoming Movies"
        movies={upcomingData!}
        viewMoreUrl="/movie/upcoming" // Add viewMoreUrl for upcoming movies
      />
    </div>
  );
}
