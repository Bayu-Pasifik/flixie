"use client";

import { useDetailMovie } from "@/hooks/useDetailMovie";
import Image from "next/image";
import { useParams } from "next/navigation"; // Mengambil parameter dari URL
import { FaStar } from "react-icons/fa"; // Untuk rating bintang

export default function MovieDetailPage() {
  const { id } = useParams(); // Mendapatkan nilai ID dari URL
  const movieId = typeof id === "string" ? parseInt(id, 10) : 0;

  if (!id) {
    return <div>Movie ID not found</div>;
  }

  const { data: movie, isLoading, error } = useDetailMovie(movieId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="relative bg-slate-900 text-white w-full min-h-screen">
      {/* Backdrop as background */}
      <div className="absolute inset-0 z-0">
        <Image
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${movie?.backdrop_path}`}
          alt={movie?.title!}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          className="opacity-30"
        />
      </div>

      {/* Content container */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:space-x-8 p-8 lg:p-16">
        {/* Poster Image */}
        <div className="flex-shrink-0 mb-8 lg:mb-0 lg:w-1/3">
          <Image
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${movie?.poster_path}`}
            alt={movie?.title!}
            width={400}
            height={600}
            className="rounded-lg shadow-lg"
          />
        </div>

        {/* Movie Details */}
        <div className="lg:w-2/3 space-y-6">
          {/* Title */}
          <h1 className="text-5xl lg:text-6xl font-bold text-white">
            {movie?.title}
          </h1>
          {/* Tagline */}
          {movie?.tagline && (
            <p className="text-lg italic text-gray-400">{movie?.tagline}</p>
          )}
          {/* Overview */}
          <p className="text-lg leading-relaxed">{movie?.overview}</p>

          {/* Genres */}
          <p className="font-semibold text-lg">
            Genres:{" "}
            <span className="text-gray-300">
              {movie?.genres.map((genre) => genre.name).join(", ")}
            </span>
          </p>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <FaStar className="text-yellow-400 text-2xl" />
            <span className="text-2xl font-bold">{movie?.vote_average}</span>
            <span className="text-2xl font-bold">/ 10</span>
          </div>

          {/* Additional Info */}
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Release Date: </span>
              {new Date(movie?.release_date!).toLocaleDateString()}
            </p>
            <p>
              <span className="font-semibold">Runtime: </span>
              {movie?.runtime} minutes
            </p>
            <p>
              <span className="font-semibold">Production Companies: </span>
              {movie?.production_companies
                .map((company) => company.name)
                .join(", ")}
            </p>
          </div>

          {/* Movie Homepage Button */}
          {movie?.homepage && (
            <a
              href={movie?.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg shadow hover:bg-yellow-600 transition duration-300"
            >
              Visit Official Website
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
