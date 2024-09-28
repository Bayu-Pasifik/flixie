"use client";
import Image from "next/image";
import { useState } from "react";
import SectionCarousel from "@/components/SectionCarousel";
import { useDetailMovie } from "@/hooks/useDetailMovie";
import { useCredits } from "@/hooks/useCredits";
import { useImages } from "@/hooks/useImages";
import { useVideos } from "@/hooks/useVideo";
import { useParams } from "next/navigation";
import { useKeywords } from "@/hooks/useKeywords";
import { useRecommendations } from "@/hooks/useRecomendations";
import MovieCard from "@/components/MovieCard";
import { ImageModal } from "@/components/ImageModal";
import { motion } from "framer-motion";
import LoadingIndicator from "@/components/LoadingIndicator";
import { LayoutTemplate } from "@/components/LayoutTemplate";
import MiniCard from "@/components/MiniCard";
import { useReviews } from "@/hooks/useReviews";
import { Link } from "lucide-react";
import MovieListCard from "@/components/MovieListCard";
import Chips from "@/components/Chips";

export default function MovieDetailPage() {
  const { id } = useParams();
  const movieId = typeof id === "string" ? parseInt(id, 10) : 0;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const {
    data: movie,
    isLoading: movieLoading,
    error: movieError,
  } = useDetailMovie(movieId);
  const {
    data: casts,
    isLoading: castLoading,
    error: castError,
  } = useCredits(movieId);
  const {
    data: images,
    isLoading: imagesLoading,
    error: imagesError,
  } = useImages(movieId);
  const {
    data: videos,
    isLoading: videosLoading,
    error: videosError,
  } = useVideos(movieId);
  const {
    data: keywords,
    isLoading: keywordsLoading,
    error: keywordsError,
  } = useKeywords(movieId);
  const {
    data: recommendations,
    isLoading: recommendationLoading,
    error: recommendationError,
  } = useRecommendations(movieId);

  const {
    data: reviews,
    isLoading: reviewsLoading,
    error: reviewsError,
  } = useReviews(movieId);

  if (
    movieLoading ||
    castLoading ||
    imagesLoading ||
    videosLoading ||
    keywordsLoading ||
    recommendationLoading ||
    reviewsLoading
  )
    return <LoadingIndicator />;

  if (
    movieError ||
    castError ||
    imagesError ||
    videosError ||
    keywordsError ||
    recommendationError ||
    reviewsError
  )
    return <div>Error loading data</div>;

  const handleImageClick = (imagePath: string) => {
    setSelectedImage(
      `${process.env.NEXT_PUBLIC_IMAGE_URL_ORIGINAL}${imagePath}`
    );
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="bg-slate-800 w-full h-full min-h-screen p-4">
      {/* Movie Details */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start lg:space-x-8 p-4">
        <Image
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${movie?.poster_path}`}
          alt={movie?.title!}
          width={300}
          height={450}
          className="rounded shadow-lg"
        />

        <div className="mt-6 lg:mt-0 w-full">
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center">
              <h1 className="text-4xl font-bold">{movie?.title} / </h1>
              <h1 className="text-4xl font-bold ml-4 italic">
                {movie?.original_title}
              </h1>
            </div>
            <p className="italic mb-6">
              {movie?.tagline || "No tagline available"}
            </p>
          </div>

          <div className="mb-4">
            <strong>Rating:</strong> {movie?.vote_average}/10
          </div>
          <div className="mb-4">
            <strong>Run Time : </strong> {movie?.runtime} minutes
          </div>
          <div className="mb-4 flex flex-row">
            <strong>Language : </strong>
            <p className="ml-2 uppercase">{movie?.original_language}</p>
          </div>
          <div className="mb-4">
            <strong>Status : </strong> {movie?.status}
          </div>

          <div className="mb-4">
            <strong>Genres:</strong>{" "}
            {movie?.genres.length === 0 ? (
              <p>No genres available.</p>
            ) : (
              <Chips items={movie?.genres!} to="genres" />
            )}
          </div>

          <div className="mb-6">
            <strong>Overview:</strong>
            <p>{movie?.overview}</p>
          </div>

          <div className="mb-4">
            <strong>Keywords:</strong>
            {keywords && keywords.length === 0 ? (
              <p>No keywords available.</p>
            ) : (
              <Chips items={keywords!} to="keywords" />
            )}
          </div>

          <div className="flex space-x-4">
            <a
              href={movie?.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Official Website
            </a>
            <a
              href={`https://www.imdb.com/title/${movie?.imdb_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-500 hover:underline"
            >
              IMDb
            </a>
          </div>
        </div>
      </div>
      {/* End of movie details */}

      {/* Company production */}
      <div className="p-4 text-2xl font-semibold">
        <div className="flex justify-between">
          <p>Production Companies</p>
        </div>
        {movie?.production_companies.length === 0 ? (
          <p>No production companies available.</p>
        ) : (
          <LayoutTemplate layout="mini">
            {movie?.production_companies.map((company) => (
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
            viewMoreLink={
              images!.backdrops.length > 10
                ? `/movie/${movieId}/backdrops`
                : undefined
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
                  src={
                    image.file_path === null
                      ? "/no_images.jpg"
                      : `${process.env.NEXT_PUBLIC_IMAGE_URL}${image.file_path}`
                  }
                  alt="Movie image"
                  width={3840}
                  height={2160}
                  className="rounded-md"
                />
              </motion.div>
            )}
          />

          {/* posters */}

          <SectionCarousel
            title="Posters"
            items={images!.posters.slice(0, 10)}
            viewMoreLink={
              images!.posters.length > 10
                ? `/movie/${movieId}/posters`
                : undefined
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
                  src={
                    image.file_path === null
                      ? "/no_images.jpg"
                      : `${process.env.NEXT_PUBLIC_IMAGE_URL}${image.file_path}`
                  }
                  alt="Movie image"
                  width={300}
                  height={450}
                  className="rounded-md"
                />
              </motion.div>
            )}
          />

          {/* Logos */}

          <SectionCarousel
            title="Logos"
            items={images!.logos.slice(0, 10)}
            viewMoreLink={
              images!.logos.length > 10 ? `/movie/${movieId}/logos` : undefined
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
                  src={
                    image.file_path === null
                      ? "/no_images.jpg"
                      : `${process.env.NEXT_PUBLIC_IMAGE_URL}${image.file_path}`
                  }
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
          viewMoreLink={
            casts!.length > 10 ? `/movie/${movieId}/casts` : undefined
          }
          renderItem={(cast) => (
            <MovieCard
              id={cast.id}
              title={cast.name}
              overview={cast.character}
              posterPath={cast.profile_path === null ? "" : cast.profile_path}
            />
          )}
        />
      )}

      {/* Videos */}
      {videos?.length === 0 ? (
        <div className="p-4 text-2xl font-semibold">
          <div className="flex justify-between">
            <p>Movie Videos</p>
            <p>View More</p>
          </div>
          No Videos
        </div>
      ) : (
        <SectionCarousel
          title="Videos"
          items={videos!.slice(0, 10)}
          viewMoreLink={
            videos!.length > 10 ? `/movie/${movieId}/videos` : undefined
          }
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
      {recommendations?.length === 0 ? (
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
          items={recommendations!.slice(0, 10)}
          viewMoreLink={
            recommendations!.length > 10
              ? `/movie/${movieId}/recommendations`
              : undefined
          }
          renderItem={(recommendation) => (
            <MovieCard
              id={recommendation.id}
              title={recommendation.title}
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
            {reviews!.length > 1 && (
              <a
                href={`/movie/${movieId}/reviews`}
                className="hover:text-blue-500 hover:underline text-2xl font-semibold"
              >
                View More
              </a>
            )}
          </div>

          <LayoutTemplate layout="list">
            {reviews!.slice(0, 1).map((review, index) => (
              <MovieListCard
                key={index}
                id={index}
                posterPath={review.author_details.avatar_path ?? ""} // Berikan path avatar atau "" jika null
                title={review.author}
                overview={review.content}
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
