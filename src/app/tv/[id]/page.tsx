'use client';
import { useDetailTV } from "@/hooks/useDetailMovie";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function DetailTV() {
    const { id } = useParams();
    const TvId = typeof id === "string" ? parseInt(id, 10) : 0;
    const { data: tv } = useDetailTV(TvId);

  return (
    <div>
      {/* tv Details */}
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

          {/* <div className="mb-4">
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
          </div> */}

          {/* <div className="flex space-x-4">
            <a
              href={tv?.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Official Website
            </a>
            <a
              href={`https://www.imdb.com/title/${tv?.imdb_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-500 hover:underline"
            >
              IMDb
            </a>
          </div> */}
        </div>
      </div>
    </div>
  );
}
