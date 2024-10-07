"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  useDetailPerson,
  usePersonImages,
  usePersonMovieCredits,
  usePersonTvCredits,
} from "@/hooks/usePerson";
import { motion } from "framer-motion";
import MovieCard from "@/components/MovieCard";
import { LayoutTemplate } from "@/components/LayoutTemplate";

const DetailPersonPage = () => {
  const params = useParams();
  const id = typeof params.id === "string" ? parseInt(params.id, 10) : 0;
  const [showFullBio, setShowFullBio] = useState(false);
  const initialDisplayCount = 8; // Jumlah item yang ditampilkan secara default

  // Hooks for data fetching
  const { data: person, isLoading: loadingPerson } = useDetailPerson(id);
  const { data: profiles, isLoading: loadingImages } = usePersonImages(id);
  const { data: movieCredits, isLoading: loadingMovies } =
    usePersonMovieCredits(id);
  const { data: tvCredits, isLoading: loadingTv } = usePersonTvCredits(id);

  if (loadingPerson || loadingImages || loadingMovies || loadingTv)
    return <div className="text-white">Loading...</div>;

  // Trim biography and add "See More" functionality
  const biography = person?.biography || "";
  const trimmedBio =
    biography.length > 300 ? biography.substring(0, 300) + "..." : biography;

  return (
    <div className="portfolio p-8 max-w-7xl mx-auto text-white">
      {/* Header Section */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="header text-center mb-8"
      >
        <img
          className="w-52 h-52 rounded-full mx-auto mb-4"
          src={`https://image.tmdb.org/t/p/w500${person?.profile_path}`}
          alt="profile"
        />
        <h1 className="text-4xl font-bold mb-2">{person?.name}</h1>
        <p className="text-lg text-gray-400">{person?.known_for_department}</p>
      </motion.header>

      {/* Biography Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="bio mb-8"
      >
        <h2 className="text-3xl font-semibold mb-4">Biography</h2>
        <p className="text-gray-300 md:text-justify">
          {showFullBio ? biography : trimmedBio}
          {biography.length > 300 && (
            <button
              onClick={() => setShowFullBio(!showFullBio)}
              className="text-blue-500 hover:underline ml-2"
            >
              {showFullBio ? "See Less" : "See More"}
            </button>
          )}
        </p>
      </motion.section>

      {/* Gallery Section */}
      <motion.section className="gallery mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-semibold mb-4">Gallery</h2>
          {/* {profiles && profiles.length > 10 && (
            <button
              className="text-blue-500 hover:underline mt-4"
              onClick={() => setShowFullBio(!showFullBio)}
            >
              {showFullBio ? "See Less" : "See More"}
            </button>
          )} */}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {profiles?.slice(0, 6).map((profile, index) => (
            <motion.img
              key={profile.file_path}
              src={`https://image.tmdb.org/t/p/w500${profile.file_path}`}
              alt="profile"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.2, duration: 1, ease: "easeOut" }}
              className="rounded-lg hover:scale-105 transition-transform duration-300"
            />
          ))}
        </div>
      </motion.section>

      {/* Movie Credits Section */}
      <section className="movie-credits mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-semibold">Movie Credits</h2>
          {movieCredits && movieCredits.cast.length > initialDisplayCount && (
            <Link
              href={`/person/${id}/movies`}
              className="text-blue-500 hover:underline text-base"
            >
              See More Movies
            </Link>
          )}
        </div>
        <LayoutTemplate layout="80rem">
          {movieCredits?.cast.slice(0, initialDisplayCount).map((cast) => (
            <MovieCard
              key={cast.id}
              id={cast.id}
              title={cast.title}
              overview={cast.overview || "No Reviews"}
              posterPath={cast.poster_path || ""}
            />
          ))}
        </LayoutTemplate>
      </section>

      {/* TV Credits Section */}
      <section className="tv-credits mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-semibold">TV Credits</h2>
          {tvCredits && tvCredits.cast.length > initialDisplayCount && (
            <Link
              href={`/person/${id}/tvshows`}
              className="text-blue-500 hover:underline text-base"
            >
              See More TV Shows
            </Link>
          )}
        </div>
        <LayoutTemplate layout="80rem">
          {tvCredits?.cast.slice(0, initialDisplayCount).map((cast) => (
            <MovieCard
              key={cast.id}
              id={cast.id}
              title={`${cast.name} (${cast.character})`}
              overview={cast.overview}
              posterPath={cast.poster_path || ""}
            />
          ))}
        </LayoutTemplate>
      </section>
    </div>
  );
};

export default DetailPersonPage;
