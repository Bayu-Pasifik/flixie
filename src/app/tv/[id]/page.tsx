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
import { useVideosTv } from "@/hooks/useVideo";
import { useInfinityRecommendationsTv } from "@/hooks/useRecomendations";
import { useReviewsTv } from "@/hooks/useReviews";
import MovieListCard from "@/components/MovieListCard";
import Chips from "@/components/Chips";

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

  const {
    data: videos,
    isLoading: videosLoading,
    error: videosError,
  } = useVideosTv(TvId);

  const {
    data: recommendations,
    isLoading: recommendationLoading,
    error: recommendationError,
  } = useInfinityRecommendationsTv(TvId);

  const {
    data: reviews,
    isLoading: reviewLoading,
    error: reviewError,
  } = useReviewsTv(TvId);

  if (
    detailLoading ||
    keywordsLoading ||
    imagesLoading ||
    castLoading ||
    videosLoading ||
    recommendationLoading ||
    reviewLoading
  )
    return <LoadingIndicator />;
  if (
    detailError ||
    keywordsError ||
    imagesError ||
    castError ||
    videosError ||
    recommendationError ||
    reviewError
  )
    return (
      <div>
        Error:{" "}
        {detailError?.message ||
          keywordsError?.message ||
          imagesError?.message ||
          castError?.message ||
          videosError?.message ||
          recommendationError?.message ||
          reviewError?.message}
      </div>
    );
  const noBackdrops = images?.backdrops.length === 0;
  const noPosters = images?.posters.length === 0;
  const noLogos = images?.logos.length === 0;
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
          {/* Flex container untuk judul dan ikon FaGlobe */}
          <div className="flex flex-row items-center justify-between mb-4">
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center">
                <h1 className="text-4xl font-bold">{tv?.name}</h1>
                <h1 className="text-4xl font-bold ml-4 italic">
                  {tv?.original_name}
                </h1>
              </div>
              <p className="italic mb-6">
                {tv?.tagline || "No tagline available"}
              </p>
            </div>

            {/* Ikon FaGlobe di sebelah kanan judul */}
            {tv?.homepage && tv.homepage !== "" ? (
              <Link href={tv.homepage} target="_blank">
                <div className="w-10 h-10 lg:w-12 lg:h-12 cursor-pointer">
                  <FaGlobe className="w-full h-full text-blue-500" />
                </div>
              </Link>
            ) : (
              <div className="w-10 h-10 lg:w-12 lg:h-12">
                <FaGlobe className="w-full h-full text-gray-500" />
              </div>
            )}
          </div>

          {/* Detail lainnya */}
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

          {/* Genres */}
          <div className="mb-4">
            <strong>Genres:</strong>
            {tv?.genres.length === 0 ? (
              <p>No genres available.</p>
            ) : (
              <Chips to="genres" items={tv?.genres!} />
            )}
          </div>

          {/* Overview */}
          <div className="mb-6">
            <strong>Overview:</strong>
            <p>{tv?.overview}</p>
          </div>

          {/* Keywords */}
          <div className="mb-4">
            <strong>Keywords:</strong>
            {keywords && keywords.length === 0 ? (
              <p>No keywords available.</p>
            ) : (
              <Chips to="keywords" items={keywords!} />
            )}
          </div>
        </div>
      </div>
      {/* Airing Company */}
      <div className="p-4">
        <p className="mb-4 font-bold">Airing Company</p>
        {tv?.networks.length === 0 && (
          <p className="mb-4 text-2xl font-bold text-center">
            No networks available.
          </p>
        )}
        <LayoutTemplate layout="mini">
          {tv?.networks.map((company) => (
            <MiniCard
              to={`${company.id}/airing-company`}
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

      {/* Production Company */}
      <div className="mt-4 p-4">
        <p className="mb-4 font-bold">Production Company</p>
        {tv?.production_companies.length === 0 && (
          <p className="mb-4 text-2xl font-bold text-center">
            No production companies available.
          </p>
        )}
        <LayoutTemplate layout="mini">
          {tv?.production_companies.map((company) => (
            <MiniCard
              to={`${company.id}/production-company`}
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
      {/* Movie Images */}
      {noBackdrops && (
        <p className="mb-4 text-2xl font-bold text-center">
          No backdrops available.
        </p>
      )}
      {!noBackdrops && (
        <SectionCarousel
          title="Backdrops"
          items={images!.backdrops.slice(0, 10)}
          type="backdrops"
          viewMoreLink={
            images!.backdrops.length > 10 ? `/tv/${TvId}/images` : undefined
          }
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
      )}
      {noPosters && (
        <p className="mb-4 text-2xl font-bold text-center">
          No posters available.
        </p>
      )}
      {!noPosters && (
        <SectionCarousel
          title="Posters"
          items={images!.posters.slice(0, 10)}
          type="posters"
          viewMoreLink={
            images!.posters.length > 10 ? `/tv/${TvId}/images` : undefined
          }
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
      )}
      {noLogos && (
        <p className="mb-4 text-2xl font-bold text-center">
          No logos available.
        </p>
      )}
      {!noLogos && (
        <SectionCarousel
          title="Logos"
          items={images!.logos.slice(0, 10)}
          type="logos"
          viewMoreLink={
            images!.logos.length > 10 ? `/tv/${TvId}/images` : undefined
          }
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
      )}
      {/* Casts */}
      {casts?.cast.length === 0 ? (
        <div className="p-4 text-2xl font-semibold">
          <div className="flex justify-between">
            <p>Movie Cast</p>
          </div>
          <p className="text-center font-bold text-2xl">No Casts</p>
        </div>
      ) : (
        <SectionCarousel
          title="Cast"
          items={casts!.cast.slice(0, 10)} // Menampilkan maksimal 10 cast
          viewMoreLink={
            casts!.cast.length > 10 ? `/tv/${TvId}/credits` : undefined
          } // Tampilkan tautan View More hanya jika cast lebih dari 10
          renderItem={(cast) => (
            <MovieCard
              type="person"
              key={cast.id}
              id={cast.id}
              title={cast.name}
              overview={cast.character}
              posterPath={cast.profile_path}
            />
          )}
        />
      )}

      {/* Videos */}
      {videos?.length === 0 ? (
        <div className="p-4 text-2xl font-semibold">
          <div className="flex justify-between">
            <p>Movie Videos</p>
          </div>
          No Videos
        </div>
      ) : (
        <SectionCarousel
          title="Videos"
          items={videos!.slice(0, 10)}
          viewMoreLink={videos!.length > 10 ? `/tv/${TvId}/videos` : undefined}
          renderItem={(video) => (
            <iframe
              src={`https://www.youtube.com/embed/${video.key}`}
              title="YouTube video"
              width="100%"
              height="auto"
              allowFullScreen
              className="rounded-md"
            />
          )}
        />
      )}
      {/* Recommendations */}
      {recommendations?.pages[0].recommendations.length === 0 ? (
        <div className="p-4 text-2xl font-semibold text-center">
          <div className="flex justify-between">
            <p>Recommendations</p>
            <p>View More</p>
          </div>
          No Recommendations
        </div>
      ) : (
        <SectionCarousel
          title="Recommendations"
          items={recommendations!.pages[0].recommendations.slice(0, 10)}
          viewMoreLink={
            recommendations!.pages[0].recommendations.length > 10
              ? `/tv/${TvId}/recommendations`
              : undefined
          }
          renderItem={(recommendation) => (
            <MovieCard
              type="tv"
              id={recommendation.id}
              title={recommendation.name}
              overview={recommendation.overview}
              posterPath={recommendation.poster_path}
            />
          )}
        />
      )}

      {/* reviews */}
      {reviews?.length === 0 ? (
        <div className="p-4 text-2xl font-semibold text-center">
          <div className="flex justify-between">
            <p>Reviews</p>
          </div>
          No Reviews
        </div>
      ) : (
        <div className="mt-4 p-6">
          <div className="flex justify-between mb-4">
            <p className="text-2xl font-bold">Reviews</p>

            {/* Conditional rendering: Jika reviews lebih dari 1, tampilkan tautan. Jika tidak, tampilkan teks biasa */}
            {reviews!.length > 10 ? (
              <Link
                href={`/tv/${TvId}/reviews`}
                className="hover:text-blue-500 hover:underline text-2xl font-semibold mb-4"
              >
                View More
              </Link>
            ) : (
              <div></div>
            )}
          </div>

          <LayoutTemplate layout="list">
            {reviews!.slice(0, 10).map((review, index) => (
              <MovieListCard
                key={index}
                id={index}
                posterPath={review.author_details.avatar_path ?? ""} // Berikan path avatar atau "" jika null
                title={review.author}
                overview={review.content}
                type="reviews"
                releaseDate={new Date(review.created_at)} 
              />
            ))}
          </LayoutTemplate>
        </div>
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
