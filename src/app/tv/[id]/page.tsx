"use client";
import { useDetailTV } from "@/hooks/useDetailMovie";
import { useKeywordsTv } from "@/hooks/useKeywords";
import Image from "next/image";
import { useParams } from "next/navigation";
import MiniCard from "@/components/MiniCard";
import { LayoutTemplate } from "@/components/LayoutTemplate";
import { FaGlobe } from "react-icons/fa";
import Link from "next/link";
import { useImagesTv } from "@/hooks/useImages";
import SectionCarousel from "@/components/SectionCarousel";
import { motion } from "framer-motion";
import { useState } from "react";
import { ImageModal } from "@/components/ImageModal";
import LoadingIndicator from "@/components/LoadingIndicator";
import { useCreditsTv } from "@/hooks/useCredits";
import MovieCard from "@/components/MovieCard";

export default function DetailTV() {
  const { id } = useParams();
  const TvId = typeof id === "string" ? parseInt(id, 10) : 0;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const handleImageClick = (imagePath: string) => {
    setSelectedImage(
      `${process.env.NEXT_PUBLIC_IMAGE_URL_ORIGINAL}${imagePath}`
    );
  };
  const handleCloseModal = () => {
    setSelectedImage(null);
  };
  const {
    data: tv,
    isLoading: detailLoading,
    error: detailError,
  } = useDetailTV(TvId);
  const {
    data: keywords,
    isLoading: keywordsLoading,
    error: keywordsError,
  } = useKeywordsTv(TvId);

  const {
    data: images,
    isLoading: imagesLoading,
    error: imagesError,
  } = useImagesTv(TvId);

  const {
    data: casts,
    isLoading: castLoading,
    error: castError,
  } = useCreditsTv(TvId);

  if (detailLoading || keywordsLoading || imagesLoading || castLoading) return <LoadingIndicator/>;
  if (detailError || keywordsError || imagesError || castError)
    return <div>Error: {detailError?.message || keywordsError?.message || imagesError?.message || castError?.message}</div>;

  return (
    <div>
      <div className="flex flex-col lg:flex-row items-center lg:items-start lg:space-x-8 p-4">
        <Image
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL_ORIGINAL}${tv?.poster_path}`}
          alt={tv?.name!}
          width={300}
          height={450}
          className="rounded shadow-lg"
        />

        <div className="mt-6 lg:mt-0 w-full">
          <div className="flex flex-row flex-wrap">
            <h1 className="text-4xl font-bold mb-4">{tv?.name} / </h1>
            <h1 className="text-4xl font-bold mb-4 ml-4 italic">
              {tv?.original_name}
            </h1>
          </div>
          <p className="italic mb-6">{tv?.tagline || "No tagline available"}</p>

          <div className="mb-4">
            <strong>Rating:</strong> {tv?.vote_average}/10
          </div>
          <div className="mb-4">
            <strong>Total Episodes:</strong> {tv?.number_of_episodes}
          </div>
          <div className="mb-4">
            <strong>Total Seasons:</strong> {tv?.number_of_seasons}
          </div>
          <div className="mb-4">
            <strong>Status:</strong> {tv?.status}
          </div>

          <div className="mb-4">
            <strong>Genres:</strong>{" "}
            {tv?.genres.map((genre) => (
              <span
                key={genre.id}
                className="bg-blue-600 text-white rounded-lg px-3 py-1 mr-2 mb-2 text-sm"
              >
                {genre.name}
              </span>
            ))}
          </div>

          <div className="mb-6">
            <strong>Overview:</strong>
            <p>{tv?.overview}</p>
          </div>

          <div className="mb-4">
            <strong>Keywords:</strong>
            {keywords && keywords.length === 0 ? (
              <p>No keywords available.</p>
            ) : (
              <div className="flex flex-wrap mt-2">
                {keywords?.map((keyword) => (
                  <span
                    key={keyword.id}
                    className="bg-blue-600 text-white rounded-lg px-3 py-1 mr-2 mb-2 text-sm"
                  >
                    {keyword.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="mb-4 font-bold">Airing Company</p>
            <LayoutTemplate layout="mini">
              {tv?.networks.map((company) => (
                <MiniCard
                  key={company.id}
                  imagePath={
                    company.logo_path === null
                      ? "/no_images.jpg"
                      : `${process.env.NEXT_PUBLIC_IMAGE_URL}${company.logo_path}`
                  }
                  name={company.name}
                />
              ))}
            </LayoutTemplate>
          </div>
          <div className="mt-4">
            <p className="mb-4 font-bold">Production Company</p>
            <LayoutTemplate layout="mini">
              {tv?.production_companies.map((company) => (
                <MiniCard
                  key={company.id}
                  imagePath={
                    company.logo_path === null
                      ? "/no_images.jpg"
                      : `${process.env.NEXT_PUBLIC_IMAGE_URL}${company.logo_path}`
                  }
                  name={company.name}
                />
              ))}
            </LayoutTemplate>
          </div>
        </div>
        {tv?.homepage && tv.homepage !== "" ? (
          <Link href={tv.homepage} target="_blank">
            <div className="w-12 h-12 cursor-pointer">
              <FaGlobe className="w-full h-full" />
            </div>
          </Link>
        ) : (
          <div className="w-12 h-12">
            <FaGlobe className="w-full h-full" />
          </div>
        )}
      </div>
      {/* Movie Images */}
      {images?.backdrops.length === 0 &&
      images?.posters.length === 0 &&
      images?.logos.length === 0 ? (
        <div className="p-4 text-2xl font-semibold">
          <div className="flex justify-between">
            <p>Movie Images</p>
            <p>View More</p>
          </div>
          No Images
        </div>
      ) : (
        <>
          <SectionCarousel
            title="Backdrops"
            items={images!.backdrops.slice(0, 10)}
            viewMoreLink={`/movie/${TvId}/images`}
            renderItem={(image) => (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  duration: 0.3,
                }}
                onClick={() => handleImageClick(image.file_path)}
                className="cursor-pointer"
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${image.file_path}`}
                  alt="Movie image"
                  width={3840}
                  height={2160}
                  className="rounded-md"
                />
              </motion.div>
            )}
          />

          <SectionCarousel
            title="Posters"
            items={images!.posters.slice(0, 10)}
            viewMoreLink={`/movie/${TvId}/images`}
            renderItem={(image) => (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  duration: 0.3,
                }}
                onClick={() => handleImageClick(image.file_path)}
                className="cursor-pointer"
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${image.file_path}`}
                  alt="Movie image"
                  width={300}
                  height={200}
                  className="rounded-md"
                />
              </motion.div>
            )}
          />

          <SectionCarousel
            title="Logos"
            items={images!.logos.slice(0, 10)}
            viewMoreLink={`/movie/${TvId}/images`}
            renderItem={(image) => (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  duration: 0.3,
                }}
                onClick={() => handleImageClick(image.file_path)}
                className="cursor-pointer"
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${image.file_path}`}
                  alt="Movie logo"
                  width={500}
                  height={300}
                  className="rounded-md"
                />
              </motion.div>
            )}
          />
        </>
      )}
      {/* Casts */}
      {casts?.length === 0 ? (
        <div className="p-4 text-2xl font-semibold">
          <div className="flex justify-between">
            <p>Movie Cast</p>
            <p>View More</p>
          </div>
          No Cast
        </div>
      ) : (
        <SectionCarousel
          title="Cast"
          items={casts!.slice(0, 10)}
          viewMoreLink={`/movie/${TvId}/credits`}
          renderItem={(cast) => (
            <MovieCard
              id={cast.id}
              title={cast.name}
              overview={cast.character}
              posterPath={cast.profile_path}
            />
          )}
        />
      )}
      {/* Image Modal */}
      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          onClose={handleCloseModal}
          isOpen={!!selectedImage}
        />
      )}
    </div>
  );
}
