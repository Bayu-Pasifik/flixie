"use client";

import { LayoutTemplate } from "@/components/LayoutTemplate";
import MovieCard from "@/components/MovieCard";
import SkeletonMovieCard from "@/components/SkeletonMovieCard";
import { useCreditsTv } from "@/hooks/useCredits";
import { useDetailTV } from "@/hooks/useDetailMovie";
import { useParams } from "next/navigation";

export default function TvCastPage() {
  const { id } = useParams();
  const tvId = typeof id === "string" ? parseInt(id, 10) : 0;
  const { data } = useDetailTV(tvId);
  const { data: cast, isLoading, error } = useCreditsTv(tvId);
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 uppercase">
        <span className="text-teal-500">Cast</span> of {""}
        <span className="text-sky-500">{data?.name}</span>
      </h1>
      <LayoutTemplate layout="card">
        {isLoading
          ? Array.from({ length: 20 }).map((_, index) => (
              <SkeletonMovieCard key={`movie-skeleton-${index}`} />
            ))
          : cast?.cast.map((member) => (
              <MovieCard
                key={member.id}
                id={member.id}
                title={member.name}
                overview={`(${member.character || "Unknown"})`} // Format overview for cast members with parentheses
                posterPath={member.profile_path || ""}
                type="person"
              />
            ))}
      </LayoutTemplate>

      <h1 className="text-2xl font-bold mb-4 uppercase mt-6">
        <span className="text-teal-500">Crew</span> of {""}
        <span className="text-sky-500">{data?.name}</span>
      </h1>
      <LayoutTemplate layout="card">
        {isLoading
          ? Array.from({ length: 20 }).map((_, index) => (
              <SkeletonMovieCard key={`movie-skeleton-${index}`} />
            ))
          : cast?.crew.map((member) => (
              <MovieCard
                key={member.id}
                id={member.id}
                title={member.name}
                overview={`(${member.job || "Unknown"})`} // Format overview for crew members with parentheses
                posterPath={member.profile_path || ""}
                type="person"
              />
            ))}
      </LayoutTemplate>
    </div>
  );
}
