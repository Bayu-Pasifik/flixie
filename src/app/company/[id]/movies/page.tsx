"use client";
import { LayoutTemplate } from "@/components/LayoutTemplate";
import MovieCard from "@/components/MovieCard";
import NewDataLoading from "@/components/NewDataLoading";
import SkeletonMovieCard from "@/components/SkeletonMovieCard";
import {
  useDetailCompany,
  useInfinityMovieByCompany,
} from "@/hooks/useCompany";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export default function DetailCompanyMoviesPage() {
  const { id } = useParams();
  const companyId = typeof id === "string" ? parseInt(id, 10) : 0;
  const { data: company } = useDetailCompany(companyId);
  const {
    data: movies,
    isLoading: isLoadingMovie,
    error: errorMovie,
    fetchNextPage: fetchNextPageMovie,
    hasNextPage: hasNextPageMovie,
    isFetchingNextPage: isFetchingNextPageMovie,
  } = useInfinityMovieByCompany(companyId);

  const { ref, inView } = useInView({ threshold: 0.1 });
  useEffect(() => {
    if (inView) {
      fetchNextPageMovie();
    }
  }, [inView, fetchNextPageMovie]);
  return (
    <div className="p-4  text-white">
      <h1 className="text-2xl font-bold mb-4">
        {" "}
        Movies that {company?.name} produced
      </h1>
      <LayoutTemplate layout="card">
        {isLoadingMovie ? (
          Array.from({ length: 20 }).map((_, index) => (
            <SkeletonMovieCard key={`movie-skeleton-${index}`} />
          ))
        ) : errorMovie ? (
          <div>Error: {errorMovie.message}</div>
        ) : (
          movies?.pages?.map((data, index) => (
            <React.Fragment key={index}>
              {data.movies.map((movie, idx) => (
                <MovieCard
                  key={`movie-card-${idx}`}
                  id={movie.id}
                  title={movie.title}
                  overview={movie.overview || "No overview"}
                  posterPath={movie.poster_path || ""}
                  type="movie"
                />
              ))}
            </React.Fragment>
          ))
        )}
      </LayoutTemplate>

      {isFetchingNextPageMovie && <NewDataLoading />}

      <div ref={ref} className="h-20"></div>
      {!hasNextPageMovie && <div className="text-center flex justify-center text-2xl font-bold">Congrat's you have reached the end list</div>}
    </div>
  );
}
