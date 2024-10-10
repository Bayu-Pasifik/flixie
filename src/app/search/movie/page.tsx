"use client";
import { useState, useEffect } from "react";
import { LayoutTemplate } from "@/components/LayoutTemplate";
import MovieCard from "@/components/MovieCard";
import { useInfinitySearchMovie } from "@/hooks/useSearch";
import { useSearchParams, useRouter } from "next/navigation";

export default function SearchMoviePage() {
  const params = useSearchParams();
  const query = params.get("query");
  const { data, isLoading, error } = useInfinitySearchMovie(query || "");

  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(query || "");

  useEffect(() => {
    setSearchQuery(query || "");
  }, [query]);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (searchQuery.trim()) {
        router.push(`/search/movie?query=${searchQuery}`);
      }
    }, 1000);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, router]);

  return (
    <div className="p-4">
      <h1>Search Movie - {query}</h1>

      {/* Search Bar */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for movies..."
        className="w-full p-2 border rounded-md mb-4 text-black"
      />

      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      
      <LayoutTemplate layout="card">
        {data?.pages.map((page) =>
          page.movies.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              overview={movie.overview || "No overview available"}
              posterPath={movie.poster_path || ""}
            />
          ))
        )}
      </LayoutTemplate>
    </div>
  );
}
