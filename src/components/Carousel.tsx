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
    <div className="relative w-full h-[90vh] p-2 rounded-lg">
      <Carousel className="w-full h-full relative rounded-lg overflow-hidden">
        <CarouselContent className="w-full h-full rounded-lg">
          {data?.map((movie, index) => (
            <CarouselItem
              key={index}
              className="w-full h-full relative rounded-lg"
            >
              <img
                className="object-cover w-full h-[90vh] rounded-lg" // Menyesuaikan tinggi gambar
                src={process.env.NEXT_PUBLIC_IMAGE_URL + movie?.backdrop_path}
                alt={movie?.title || "Movie Poster"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-center px-8">
                <h2 className="text-5xl font-bold text-white">
                  {movie?.title}
                </h2>
                <p className="text-lg text-white mt-4 max-w-2xl">
                  {movie?.overview || "No description available"}
                </p>
                <div className="mt-6 flex space-x-4">
                  <button className="px-6 py-3 bg-white text-black rounded-md hover:bg-gray-200">
                    Watch Trailer
                  </button>
                  <button className="px-6 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700">
                    + Add to List
                  </button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Previous Button */}
        <CarouselPrevious className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-gray-800/60 text-white p-3 rounded-full hover:bg-gray-800/80 transition duration-300" />
        {/* Next Button */}
        <CarouselNext className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-gray-800/60 text-white p-3 rounded-full hover:bg-gray-800/80 transition duration-300" />
      </Carousel>
    </div>
  );
};

export default HomeCarousel;
