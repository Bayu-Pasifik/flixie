'use client';
import HomeCarousel from "@/components/Carousel";
import MovieCarousel from "@/components/MovieCarousel";
import { useCurrentlyAiring } from "@/hooks/useCurrentlyAiring";
import { useUpcomingMovies } from "@/hooks/useUpcomingMovie";
import { usePopularMovies } from "@/hooks/usePopularMovie";
import LoadingIndicator from "@/components/LoadingIndicator";

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
    data: popularData,
    isLoading: isLoadingPopular,
    error: popularError,
  } = usePopularMovies();

  if (isLoadingAiring || isLoadingUpcoming || isLoadingPopular)
    return <div><LoadingIndicator/></div>;
  if (airingError || upcomingError || popularError)
    return (
      <div>
        Error: {(airingError || upcomingError || popularError)?.message}
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
        title="Upcoming Movies" 
        movies={upcomingData!} 
        viewMoreUrl="/movie/upcoming" // Add viewMoreUrl for upcoming movies
      />

      {/* Popular Movies Section */}
      <MovieCarousel 
        title="Popular Movies" 
        movies={popularData!} 
        viewMoreUrl="/movie/popular" // Add viewMoreUrl for popular movies
      />
    </div>
  );
}
