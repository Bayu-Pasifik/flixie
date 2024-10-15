"use client";

import { LayoutTemplate } from "@/components/LayoutTemplate";
import MovieCard from "@/components/MovieCard";
import NewDataLoading from "@/components/NewDataLoading";
import SkeletonMovieCard from "@/components/SkeletonMovieCard";
import { useDetailCompany, useInfinityTvByCompany } from "@/hooks/useCompany";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";

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

  const { ref, inView } = useInView({ threshold: 0.1 });
  useEffect(() => {
    if (inView) {
      fetchNextPageTv();
    }
  }, [inView, fetchNextPageTv]);
  const emptyData = tvshows?.pages.some((page) => page.tvShows.length === 0);
  return (
    <div className="p-4  text-white">
      <h1 className="text-2xl font-bold mb-4 uppercase">
        TV Shows produced by {company?.name}
      </h1>

      {emptyData && (
        <div className="flex items-center justify-center text-center font-bold text-2xl w-full h-screen">
          <p>No data found</p>
        </div>
      )}

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
      <div ref={ref} className="h1" />
      {isFetchingNextPageTv && <NewDataLoading />}
      {!hasNextPageTv && !emptyData && (
        <div className="text-center font-bold text-2xl my-3">
          {" "}
          Congrat's you reached the end of list
        </div>
      )}
    </div>
  );
}
