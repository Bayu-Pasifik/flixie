"use client";
import { useDetailTV } from "@/hooks/useDetailMovie";
import { useKeywordsTv } from "@/hooks/useKeywords";
import Image from "next/image";
import { useParams } from "next/navigation";
import MiniCard from "@/components/MiniCard";
import { LayoutTemplate } from "@/components/LayoutTemplate";

export default function DetailTV() {
  const { id } = useParams();
  const TvId = typeof id === "string" ? parseInt(id, 10) : 0;
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

  if (detailLoading || keywordsLoading) return <div>Loading...</div>;
  if (detailError || keywordsError)
    return <div>Error: {detailError?.message || keywordsError?.message}</div>;

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
      </div>
    </div>
  );
}
