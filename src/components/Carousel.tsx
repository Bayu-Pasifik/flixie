"use client";
import React, { useState } from "react";
import { useTopMovies } from "@/hooks/useTopRate";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { IoMdArrowRoundForward } from "react-icons/io";
import Link from "next/link";

const HomeCarousel: React.FC = () => {
  const { data, isLoading, error } = useTopMovies();
  const [activeMovieIndex, setActiveMovieIndex] = useState(0);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleMovieChange = (index: number) => {
    setActiveMovieIndex(index);
  };

  return (
    <div className="relative w-full h-screen bg-[#0c111b] text-white rounded-xl">
      {/* Backdrop Section */}
      <div className="absolute inset-0 overflow-hidden rounded-xl">
        <img
          className="object-cover w-full h-full opacity-80"
          src={
            process.env.NEXT_PUBLIC_IMAGE_URL! +
            data?.[activeMovieIndex]?.backdrop_path
          }
          alt={data?.[activeMovieIndex]?.title || "Movie Backdrop"}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
      </div>

      {/* Content Over the Backdrop */}
      <div className="relative z-10 p-4 md:p-8 flex flex-col justify-between h-[60vh] w-full">
        {/* Movie Information */}
        <div className="max-w-4xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-2 md:mb-4">
            {data?.[activeMovieIndex]?.title}
          </h1>
          <div className="flex space-x-2 md:space-x-4 items-center mb-2 md:mb-4">
            <span className="bg-gray-700 px-2 py-1 rounded-md text-xs md:text-sm">
              {data?.[activeMovieIndex]?.vote_average} ★
            </span>
            <span className="text-white bg-gray-800 px-2 py-1 rounded-md text-xs md:text-sm">
              {data?.[activeMovieIndex]?.release_date.toString()}
            </span>
          </div>
          <p className="max-w-xl text-sm md:text-base mb-4 md:mb-6">
            {data?.[activeMovieIndex]?.overview}
          </p>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <button className="px-4 py-2 md:px-6 md:py-3 bg-teal-500 rounded-md text-black">
              Watch Now
            </button>
            <button className="px-4 py-2 md:px-6 md:py-3 bg-gray-800 rounded-md">
              + Add to List
            </button>
            <Link href={"/movie/" + data?.[activeMovieIndex]?.id}>
              <button className="px-4 py-2 md:px-6 md:py-3 bg-gray-800 rounded-md flex items-center space-x-2 md:space-x-4">
                See Details <IoMdArrowRoundForward className="ml-2" />
              </button>
            </Link>
          </div>
        </div>

        {/* Posters Carousel */}
        <div className="relative w-full mt-8 md:mt-20">
          <Carousel className="w-full">
            <CarouselContent className="flex space-x-4">
              {data?.map((movie, index) => (
                <CarouselItem
                  key={index}
                  className="flex-none w-[100px] md:w-[150px] transition-transform duration-300 hover:scale-105 cursor-pointer"
                  onClick={() => handleMovieChange(index)}
                >
                  <img
                    className={`w-full h-auto object-cover rounded-md ${
                      index === activeMovieIndex ? "opacity-100" : "opacity-70"
                    }`}
                    src={process.env.NEXT_PUBLIC_IMAGE_URL + movie?.poster_path}
                    alt={movie?.title}
                  />
                  <div className="text-center text-white text-xs md:text-sm mt-1 md:mt-2">
                    {movie?.title}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Previous and Next Buttons */}
            <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-600 p-2 rounded-full text-white hover:bg-gray-500" />
            <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-600 p-2 rounded-full text-white hover:bg-gray-500" />
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default HomeCarousel;
