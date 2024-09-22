"use client";
import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useTopMovies } from "@/hooks/useTopRate";

const HomeCarousel: React.FC = () => {
  const { data, isLoading, error } = useTopMovies();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="relative w-full h-4/5 p-2 rounded-lg">
      <Carousel className="w-full h-full rounded-lg">
        <CarouselContent className="w-full h-full opacity-60 rounded-lg">
          {data?.map((movie, index) => (
            <CarouselItem key={index} className="w-full h-full relative rounded-lg">
              <img
                className="object-cover w-full h-[80vh] rounded-lg" // Adjusted height to 80
                src={process.env.NEXT_PUBLIC_IMAGE_URL + movie?.poster_path}
                alt={movie?.title || "Movie Poster"}
              />
              <div className="absolute inset-0 flex flex-col justify-center px-8">
                <h2 className="text-4xl text-white font-bold">
                  {movie?.title}
                </h2>
                <p className="text-lg text-white mt-2 w-3/4">
                  {movie?.overview || "No description available"}
                </p>
                <div className="mt-4 flex space-x-4">
                  <button className="px-6 py-3 bg-white text-black rounded-md hover:bg-gray-200">
                    Watch Trailer
                  </button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Previous Button */}
        <CarouselPrevious className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-600 text-white p-2 rounded-full hover:bg-gray-500" />
        {/* Next Button */}
        <CarouselNext className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-600 text-white p-2 rounded-full hover:bg-gray-500" />
      </Carousel>
    </div>
  );
};

export default HomeCarousel;
