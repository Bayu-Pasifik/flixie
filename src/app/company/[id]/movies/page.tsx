"use client";
import { LayoutTemplate } from "@/components/LayoutTemplate";
import MovieCard from "@/components/MovieCard";
import SkeletonMovieCard from "@/components/SkeletonMovieCard";
import {
  useDetailCompany,
  useInfinityMovieByCompany,
} from "@/hooks/useCompany";
import { useParams } from "next/navigation";
import React from "react";

export default function DetailCompanyMoviesPage() {
  const { id } = useParams();
  const companyId = typeof id === "string" ? parseInt(id, 10) : 0;
  const { data: company } = useDetailCompany(companyId);
  const {
    data: movies,
    isLoading: isLoadingMovie,
    error: errorMovie,
  } = useInfinityMovieByCompany(companyId);
  return (
    <div className="p-4  text-white">
      <h1 className="text-2xl font-bold mb-4">
        {" "}
        Movies that {company?.name} produced
      </h1>
      <LayoutTemplate layout="card">
        {isLoadingMovie ? (
          Array.from({ length: 20 }).map((_, index) => <SkeletonMovieCard key={`movie-skeleton-${index}`}/>)
        ) : errorMovie ? (
          <div>Error: {errorMovie.message}</div>
        ) : (
          movies?.pages?.map((data, index) => (
              <React.Fragment key={index}>
                {data.movies.map((movie,idx) => (
                  <MovieCard
                    key={`movie-card-${idx}`}
                    id={movie.id}
                    title={movie.title}
                    overview={movie.overview}
                    posterPath={movie.poster_path}
                    type="movie"
                  />
                ))}
              </React.Fragment>
          ))
        )}
      </LayoutTemplate>
    </div>
  );
}
