'use client';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import MovieCard from "@/components/MovieCard";
import { Movie } from "@/types/movieType";

interface MovieCarouselProps {
  title: string;
  movies?: Movie[]; // Adjust this type according to your movie data structure
  viewMoreUrl: string; // Add a prop to pass the URL for "View More"
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({ title, movies, viewMoreUrl }) => {
  return (
    <div className="w-full max-w-full px-4 mb-8">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        {/* Link to the view more page */}
        <Link href={viewMoreUrl}>
          <p className="text-2xl font-semibold  mb-4">View More</p>
        </Link>
      </div>
      <Carousel opts={{ align: "start" }} className="w-full">
        <CarouselContent className="flex space-x-4">
          {movies?.map((movie) => (
            <CarouselItem
              key={movie.id}
              className="basis-full md:basis-1/2 lg:basis-1/3 2xl:basis-1/4"
            >
              <div className="p-1">
                <MovieCard
                  id={movie.id} // Pass the movie ID to MovieCard
                  title={movie.title}
                  overview={movie.overview}
                  posterPath={movie.poster_path}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-600 text-white p-2 rounded-full hover:bg-gray-500" />
        <CarouselNext className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-600 text-white p-2 rounded-full hover:bg-gray-500" />
      </Carousel>
    </div>
  );
};

export default MovieCarousel;
