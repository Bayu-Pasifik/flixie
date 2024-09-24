'use client';
import HomeCarousel from "@/components/Carousel";
import MovieCarousel from "@/components/MovieCarousel";
import { useCurrentlyAiring } from "@/hooks/useCurrentlyAiring";
import { useUpcomingMovies } from "@/hooks/useUpcomingMovie";
import LoadingIndicator from "@/components/LoadingIndicator";
import { useTrendingMovie } from "@/hooks/useTrending";

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

  if (isLoadingAiring || isLoadingUpcoming || isLoadingTrending)
    return <div><LoadingIndicator/></div>;
  if (airingError || upcomingError || trendingError)
    return (
      <div>
        Error: {(airingError || upcomingError || trendingError)?.message}
      </div>
    );

  return (
    <div className="bg-slate-800 min-h-screen p-4">
      <div className="mb-8">
        <HomeCarousel />
      </div>

      {/* Currently Airing Section */}
      <MovieCarousel 
        title="Currently Airing" 
        movies={currentlyAiringData!} 
        viewMoreUrl="/movie/currently-airing" // Add viewMoreUrl for currently airing movies
      />

      {/* Upcoming Movies Section */}
      <MovieCarousel 
        title="Movie Trending This Weeks" 
        movies={trendingData!} 
        viewMoreUrl="/movie/trending" // Add viewMoreUrl for upcoming movies
      />
      {/* Upcoming Movies Section */}
      <MovieCarousel 
        title="Upcoming Movies" 
        movies={upcomingData!} 
        viewMoreUrl="/movie/upcoming" // Add viewMoreUrl for upcoming movies
      />


    </div>
  );
}
