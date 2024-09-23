"use client";
import Image from "next/image";
import Link from "next/link"; // Import Link for navigation
import SectionCarousel from "@/components/SectionCarousel";
import { useDetailMovie } from "@/hooks/useDetailMovie";
import { useCredits } from "@/hooks/useCredits";
import { useImages } from "@/hooks/useImages";
import { useVideos } from "@/hooks/useVideo";
import { useParams } from "next/navigation";
import { useKeywords } from "@/hooks/useKeywords";
import { useRecommendations } from "@/hooks/useRecomendations";
import MovieCard from "@/components/MovieCard"; // Import MovieCard component

export default function MovieDetailPage() {
  const { id } = useParams();
  const movieId = typeof id === "string" ? parseInt(id, 10) : 0;

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

  if (
    movieLoading ||
    castLoading ||
    imagesLoading ||
    videosLoading ||
    keywordsLoading
  )
    return <div>Loading...</div>;
  if (movieError || castError || imagesError || videosError || keywordsError)
    return <div>Error loading data</div>;

  // Limit items to 10 for display in the carousel
  const limitedImages = images?.slice(0, 10);
  const limitedCasts = casts?.slice(0, 10);
  const limitedVideos = videos?.slice(0, 10);
  const limitedRecommendations = recommendations?.slice(0, 10);

  return (
    <div className="bg-slate-800 w-full h-full min-h-screen p-4">
      <div className="flex flex-col lg:flex-row items-center lg:items-start lg:space-x-8 p-4">
        {/* Movie Poster and Info */}
        <Image
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${movie?.poster_path}`}
          alt={movie?.title!}
          width={300}
          height={450}
          className="rounded shadow-lg"
        />

        {/* Movie Information */}
        <div className="mt-6 lg:mt-0 w-full">
          <h1 className="text-4xl font-bold mb-4">{movie?.title}</h1>
          <p className="italic mb-6">{movie?.tagline}</p>

          <div className="mb-4">
            <strong>Rating:</strong> {movie?.vote_average}/10
          </div>

          <div className="mb-4">
            <strong>Genres:</strong>{" "}
            {movie?.genres.map((genre) => (
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
            <p>{movie?.overview}</p>
          </div>

          {/* Keywords Chips */}
          <div className="mb-4">
            <strong>Keywords:</strong>
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

      {/* Images Carousel */}
      <SectionCarousel
        title="Movie Images"
        items={limitedImages!}
        viewMoreLink={`/movie/${movieId}/images`} // Link to full list
        renderItem={(image) => (
          <Image
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${image.file_path}`}
            alt="movie-image"
            width={3840}
            height={2160}
            className="rounded-md"
          />
        )}
      />

      {/* Cast Carousel with MovieCard */}
      <SectionCarousel
        title="Cast"
        items={limitedCasts!}
        viewMoreLink={`/movie/${movieId}/cast`}
        renderItem={(cast) => (
          <MovieCard
            id={cast.id} // Assuming `cast.id` is the ID for the cast's character or person
            title={cast.name}
            overview={cast.character} // We can show the character they play in place of overview
            posterPath={cast.profile_path}
          />
        )}
      />

      {/* Videos Carousel */}
      <SectionCarousel
        title="Videos"
        items={limitedVideos!}
        viewMoreLink={`/movie/${movieId}/videos`} // Link to full list
        renderItem={(video) => (
          <iframe
            src={`https://www.youtube.com/embed/${video.key}`}
            title={video.name}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg w-full h-72 object-cover"
          />
        )}
      />

      {/* Recommendations Carousel with MovieCard */}
      <SectionCarousel
        title="Recommendations"
        items={limitedRecommendations!}
        viewMoreLink={`/movie/${movieId}/recommendations`} // Link to full list
        renderItem={(recommendation) => (
          <MovieCard
            id={recommendation.id}
            title={recommendation.title}
            overview={recommendation.overview}
            posterPath={recommendation.poster_path}
          />
        )}
      />
    </div>
  );
}
