"use client";

import { LayoutTemplate } from "@/components/LayoutTemplate";
import MovieCard from "@/components/MovieCard";
import MovieListCard from "@/components/MovieListCard";
import SkeletonMovieCard from "@/components/SkeletonMovieCard";
import { useDetailCompany, useInfinityTvByCompany } from "@/hooks/useCompany";
import { useParams } from "next/navigation";
import React from "react";

export default function DetailCompanyTvShowPage() {
  const { id } = useParams();
  const companyId = typeof id === "string" ? parseInt(id, 10) : 0;
  const { data: company } = useDetailCompany(companyId);
  const {
    data: tvshows,
    isLoading: isLoadingTv,
    error: errorTv,
    fetchNextPage: fetchNextPageTv,
    hasNextPage: hasNextPageTv,
    isFetchingNextPage: isFetchingNextPageTv,
  } = useInfinityTvByCompany(companyId);
  return (
    <div className="p-4  text-white">
      <h1 className="text-2xl font-bold mb-4">
        TV Shows that {company?.name} produced
      </h1>
      <LayoutTemplate layout="card">
        {isLoadingTv
          ? Array.from({ length: 20 }).map((_, index) => (
              <SkeletonMovieCard key={`movie-skeleton-${index}`} />
            ))
          : errorTv
          ? errorTv && <div>Error: {errorTv.message}</div>
          : tvshows?.pages.map((page, index) => (
              <React.Fragment key={index}>
                {page.tvShows.map((tvShow, idx) => (
                  <MovieCard
                    id={tvShow.id}
                    key={idx}
                    title={tvShow.name}
                    overview={tvShow.overview}
                    posterPath={tvShow.poster_path}
                    type="tv"
                  />
                ))}
              </React.Fragment>
            ))}
      </LayoutTemplate>
    </div>
  );
}
