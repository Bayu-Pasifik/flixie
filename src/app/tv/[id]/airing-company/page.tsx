"use client";
import { LayoutTemplate } from "@/components/LayoutTemplate";
import MovieCard from "@/components/MovieCard";
import { useDetailNetwork } from "@/hooks/useDetailMovie";
import { useInfinityTvByAringCompany } from "@/hooks/useDiscover";
import { useParams } from "next/navigation";
export default function TvAiringCompanyPage() {
  const { id } = useParams();
  const tvId = typeof id === "string" ? parseInt(id, 10) : 0;
  const { data } = useDetailNetwork(tvId);
  const { data: tvShows } = useInfinityTvByAringCompany(tvId);
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 uppercase">
        {" "}
        Tv Show Aired By {data?.name}
      </h1>
      <LayoutTemplate layout="card">
        {tvShows?.pages.map((Tv) =>
          Tv.tvShows.map((tv, index) => (
            <div key={index}>
              <MovieCard
                id={tv.id}
                title={tv.name}
                overview={tv.overview}
                posterPath={tv.poster_path}
                key={index}
                type="tv"
              />
            </div>
          ))
        )}
      </LayoutTemplate>
    </div>
  );
}
