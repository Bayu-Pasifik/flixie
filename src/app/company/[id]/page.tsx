"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  useDetailCompany,
  useCompanyImages,
  useInfinityMovieByCompany,
  useInfinityTvByCompany,
} from "@/hooks/useCompany";
import { motion } from "framer-motion";
import MovieCard from "@/components/MovieCard";
import { FaGlobe } from "react-icons/fa";
import { LayoutTemplate } from "@/components/LayoutTemplate";
import SkeletonMovieCard from "@/components/SkeletonMovieCard";
import LoadingIndicator from "@/components/LoadingIndicator";
import { ImageModal } from "@/components/ImageModal"; // Import ImageModal

const DetailCompanyPage = () => {
  const params = useParams();
  const id = typeof params.id === "string" ? parseInt(params.id, 10) : 0;
  const [showAllLogos, setShowAllLogos] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Fetch data
  const { data: company, isLoading: loadingCompany } = useDetailCompany(id);
  const { data: companyImages, isLoading: loadingImages } = useCompanyImages(id);
  const { data: movieData, isLoading: loadingMovie } = useInfinityMovieByCompany(id);
  const { data: tvData, isLoading: loadingTv } = useInfinityTvByCompany(id);

  if (loadingCompany) return <LoadingIndicator />;

  // Determine how many logos to show
  const logosToShow = showAllLogos ? companyImages : companyImages?.slice(0, 8);

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="company-details p-8 max-w-7xl mx-auto text-white">
      {/* Header Section */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="header text-center mb-8"
      >
        <div className="mb-4 w-72 mx-auto bg-gray-500 rounded-lg">
          <img
            className="w-64 h-64 drop-shadow-2xl mx-auto"
            src={process.env.NEXT_PUBLIC_IMAGE_URL! + company?.logo_path}
            alt={company?.name}
          />
        </div>
        <h1 className="text-4xl font-bold mb-2">{company?.name}</h1>
        <p className="text-lg text-gray-400">{company?.headquarters}</p>
        <p className="text-md text-gray-300">{company?.origin_country}</p>
        <div className="mt-4 hover:text-blue-500 cursor-pointer item-center flex justify-center">
          <a href={company?.homepage} target="_blank" rel="noopener noreferrer">
            <FaGlobe className="w-8 h-8 mr-2" />
          </a>
        </div>
      </motion.header>

      {/* Logos Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="logos mb-8"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-semibold">Logos</h2>
          {companyImages && companyImages.length > 10 && (
            <button
              onClick={() => setShowAllLogos(!showAllLogos)}
              className="text-blue-500 hover:underline text-base"
            >
              {showAllLogos ? "View Less" : "View More"}
            </button>
          )}
        </div>
        <LayoutTemplate layout="card">
          {loadingImages ? (
            Array(8)
              .fill(0)
              .map((_, index) => (
                <SkeletonMovieCard key={`logo-skeleton-${index}`} />
              ))
          ) : (
            logosToShow?.map((logo) => (
              <img
                key={logo.file_path}
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${logo.file_path}`}
                alt="Logo"
                className="rounded-lg cursor-pointer"
                onClick={() => openImageModal(`${process.env.NEXT_PUBLIC_IMAGE_URL}${logo.file_path}`)}
              />
            ))
          )}
        </LayoutTemplate>
      </motion.section>

      {/* Movie Section */}
      <section className="movies mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-semibold">Movies</h2>
          {movieData && movieData.pages[0].movies.length > 8 && !loadingMovie && (
            <Link href={`/company/${id}/movies`} className="text-blue-500 hover:underline text-base">
              See More Movies
            </Link>
          )}
        </div>
        {movieData && movieData.pages[0].movies.length === 0 && !loadingMovie && (
          <p className="text-center text-3xl">No movies found</p>
        )}
        <LayoutTemplate layout="80rem">
          {loadingMovie
            ? Array(8)
                .fill(0)
                .map((_, index) => (
                  <SkeletonMovieCard key={`movie-skeleton-${index}`} />
                ))
            : movieData?.pages[0].movies.slice(0, 8).map((movie) => (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  overview={movie.overview || "No overview"}
                  posterPath={movie.poster_path || ""}
                />
              ))}
        </LayoutTemplate>
      </section>

      {/* TV Shows Section */}
      <section className="tv-shows mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-semibold">TV Shows</h2>
          {tvData && tvData.pages[0].tvShows.length > 8 && !loadingTv && (
            <Link href={`/company/${id}/tvshows`} className="text-blue-500 hover:underline text-base">
              See More TV Shows
            </Link>
          )}
        </div>
        {tvData && tvData.pages[0].tvShows.length === 0 && !loadingTv && (
          <p className="text-2xl text-center">No Tv shows found</p>
        )}
        <LayoutTemplate layout="80rem">
          {loadingTv
            ? Array(8)
                .fill(0)
                .map((_, index) => (
                  <SkeletonMovieCard key={`tv-skeleton-${index}`} />
                ))
            : tvData?.pages[0].tvShows.slice(0, 8).map((tvShow) => (
                <MovieCard
                  key={tvShow.id}
                  id={tvShow.id}
                  title={tvShow.name}
                  overview={tvShow.overview || "No overview"}
                  posterPath={tvShow.poster_path || ""}
                  type="tv"
                />
              ))}
        </LayoutTemplate>
      </section>

      {/* ImageModal */}
      <ImageModal
        isOpen={!!selectedImage}
        onClose={closeImageModal}
        imageUrl={selectedImage || ""}
      />
    </div>
  );
};

export default DetailCompanyPage;
