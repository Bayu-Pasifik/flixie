'use client'
import { useDetailTV } from "@/hooks/useDetailMovie";
import { useKeywordsTv } from "@/hooks/useKeywords";
import Image from "next/image";
import { useParams } from "next/navigation";
import MiniCard from "@/components/MiniCard";

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
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${tv?.poster_path}`}
          alt={tv?.name!}
          width={300}
          height={450}
          className="rounded shadow-lg"
        />

        <div className="mt-6 lg:mt-0 w-full">
          <h1 className="text-4xl font-bold mb-4">{tv?.name}</h1>
          <p className="italic mb-6">{tv?.tagline}</p>

          <div className="mb-4">
            <strong>Rating:</strong> {tv?.vote_average}/10
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
            <strong>Airing Company</strong>
            <div className="my-2 flex flex-wrap gap-4">
              {tv?.networks.map((company) => (
                <MiniCard
                  key={company.id}
                  imagePath={`${process.env.NEXT_PUBLIC_IMAGE_URL}${company.logo_path}`}
                  name={company.name}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
