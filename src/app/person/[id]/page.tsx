"use client";
import { useState, useEffect } from "react";
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
import SkeletonMovieCard from "@/components/SkeletonMovieCard";
import LoadingIndicator from "@/components/LoadingIndicator";
import { ImageModal } from "@/components/ImageModal"; // Import ImageModal

const DetailPersonPage = () => {
  const params = useParams();
  const id = typeof params.id === "string" ? parseInt(params.id, 10) : 0;
  const [showFullBio, setShowFullBio] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // State for selected image
  const initialDisplayCount = 8;

  // Hooks for data fetching
  const { data: person, isLoading: loadingPerson } = useDetailPerson(id);
  const { data: profiles, isLoading: loadingImages } = usePersonImages(id);
  const {
    data: movieCredits,
    isLoading: loadingMovies,
    error: movieError,
  } = usePersonMovieCredits(id);
  const {
    data: tvCredits,
    isLoading: loadingTv,
    error: tvError,
  } = usePersonTvCredits(id);

  if (loadingPerson || loadingImages) return <LoadingIndicator />;

  const biography = person?.biography || "";
  const trimmedBio =
    biography.length > 300 ? biography.substring(0, 300) + "..." : biography;

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="portfolio p-8 max-w-7xl mx-auto text-white">
      {/* Header Section */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="header text-center mb-8"
      >
        {person?.profile_path == null && (
          <img
            className="w-52 h-52 rounded-full mx-auto mb-4"
            src="/no_images.jpg"
            alt="profile"
          />
        )}
        {person?.profile_path != null && (
          <img
            className="w-52 h-52 rounded-full mx-auto mb-4"
            src={process.env.NEXT_PUBLIC_IMAGE_URL! + `${person?.profile_path}`}
            alt="profile"
          />
        )}
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
          {biography == "" && (
            <p className="text-center text-2xl font-bold">No biography available.</p>
          )}
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
          {profiles && profiles.length > initialDisplayCount && (
            <Link
              href={`/person/${id}/gallery`}
              className="text-blue-500 hover:underline text-base"
            >
              See More Images
            </Link>
          )}
        </div>
        {profiles && profiles.length == 0 ? (
          <p className="text-center text-2xl font-bold">No images available.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {profiles!.slice(0, 6).map((picture) => (
              <img
                key={picture.file_path}
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${picture.file_path}`}
                alt="Gallery"
                className="rounded-lg cursor-pointer"
                onClick={() => openImageModal(`${process.env.NEXT_PUBLIC_IMAGE_URL_ORIGINAL}${picture.file_path}`)}
              />
            ))}
          </div>
        )}
      </motion.section>

      {/* ImageModal */}
      <ImageModal
        isOpen={!!selectedImage}
        onClose={closeImageModal}
        imageUrl={selectedImage || ""}
      />

      {/* Movie and TV Credits Sections */}
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
        {movieCredits && movieCredits.cast.length == 0 && (
          <p className="text-center text-2xl font-bold">No movies available.</p>
        )}
        <LayoutTemplate layout="80rem">
          {loadingMovies ? (
            Array.from({ length: initialDisplayCount }).map((_, index) => (
              <SkeletonMovieCard key={index} />
            ))
          ) : movieError ? (
            <div className="text-red-500">Error: {movieError.message}</div>
          ) : (
            movieCredits?.cast
              .slice(0, initialDisplayCount)
              .map((cast) => (
                <MovieCard
                  key={cast.id}
                  id={cast.id}
                  title={`${cast.title} (${cast.character})`}
                  overview={cast.overview || "No overview available"}
                  posterPath={cast.poster_path || ""}
                />
              ))
          )}
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
        {tvCredits && tvCredits.cast.length == 0 && (
          <p className="text-center text-2xl font-bold">No TV shows available.</p>
        )}
        <LayoutTemplate layout="80rem">
          {loadingTv ? (
            Array.from({ length: initialDisplayCount }).map((_, index) => (
              <SkeletonMovieCard key={index} />
            ))
          ) : tvError ? (
            <div className="text-red-500">Error: {tvError.message}</div>
          ) : (
            tvCredits?.cast
              .slice(0, initialDisplayCount)
              .map((cast) => (
                <MovieCard
                  key={cast.id}
                  id={cast.id}
                  title={`${cast.name} (${cast.character})`}
                  overview={cast.overview || "No overview available"}
                  posterPath={cast.poster_path || ""}
                />
              ))
          )}
        </LayoutTemplate>
      </section>
    </div>
  );
};

export default DetailPersonPage;
