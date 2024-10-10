"use client";
import { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";
import { LayoutTemplate } from "@/components/LayoutTemplate";
import MovieCard from "@/components/MovieCard";
import { useInfinitySearchMovie } from "@/hooks/useSearch";
import { useSearchParams, useRouter } from "next/navigation";
import SkeletonMovieCard from "@/components/SkeletonMovieCard";
import { useInView } from "react-intersection-observer";
import NewDataLoading from "@/components/NewDataLoading";
import { useAdvancedSearchData } from "@/hooks/useAdvancedSearch";
import { useMovieGenre } from "@/hooks/useGenres";

type OptionType = {
  value: number;
  label: string;
};

export default function SearchMoviePage() {
  const params = useSearchParams();
  const query = params.get("query");
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfinitySearchMovie(query || "");
  const { companies, keywords, loading } = useAdvancedSearchData();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(query || "");
  const [debouncedQuery, setDebouncedQuery] = useState(query || "");
  const { data: genres, isLoading: isGenresLoading } = useMovieGenre();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      router.push(`/search/movie?query=${debouncedQuery}`);
    }
  }, [debouncedQuery, router]);

  const { ref: loadMoreRef, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  // Caching for search results
  const companyCache: { [key: string]: OptionType[] } = {};
  const keywordCache: { [key: string]: OptionType[] } = {};

  // Fungsi untuk memuat data perusahaan secara dinamis
  const loadCompanyOptions = (inputValue: string): Promise<OptionType[]> => {
    if (companyCache[inputValue]) {
      return Promise.resolve(companyCache[inputValue]);
    }

    const filteredCompanies = companies
      .filter((company) =>
        company.name.toLowerCase().includes(inputValue.toLowerCase())
      )
      .slice(0, 20) // Limit the results to 20 companies
      .map((company) => ({
        value: company.id,
        label: company.name,
      }));

    companyCache[inputValue] = filteredCompanies;
    return Promise.resolve(filteredCompanies);
  };

  // Fungsi untuk memuat data genre secara dinamis
  const loadGenreOptions = (inputValue: string): Promise<OptionType[]> => {
    if (isGenresLoading || !genres) {
      return Promise.resolve([]); // Return an empty array if genres are loading or not available
    }

    // Filter genres based on user input
    const filteredGenres = genres
      .filter((genre) =>
        genre.name.toLowerCase().includes(inputValue.toLowerCase())
      )
      .map((genre) => ({
        value: genre.id,
        label: genre.name,
      }));

    return Promise.resolve(filteredGenres); // Return the filtered genres
  };

  // Fungsi untuk memuat data keyword secara dinamis
  const loadKeywordOptions = (inputValue: string): Promise<OptionType[]> => {
    if (keywordCache[inputValue]) {
      return Promise.resolve(keywordCache[inputValue]);
    }

    const filteredKeywords = keywords
      .filter((keyword) =>
        keyword.name.toLowerCase().includes(inputValue.toLowerCase())
      )
      .slice(0, 20) // Limit the results to 20 keywords
      .map((keyword) => ({
        value: keyword.id,
        label: keyword.name,
      }));

    keywordCache[inputValue] = filteredKeywords;
    return Promise.resolve(filteredKeywords);
  };

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

      <div className="mb-4 flex flex-row w-full">
        <h2>Advanced Search</h2>
        <AsyncSelect
          cacheOptions
          loadOptions={loadCompanyOptions}
          placeholder="Select a company..."
          defaultOptions
          isClearable
          className="mb-2 text-black"
        />
        <AsyncSelect
          cacheOptions
          loadOptions={loadKeywordOptions}
          placeholder="Select a keyword..."
          defaultOptions
          isClearable
          className="mb-2 text-black"
        />
        <AsyncSelect
          cacheOptions
          loadOptions={loadGenreOptions}
          placeholder="Select a genre..."
          defaultOptions={
            genres?.map((genre) => ({
              value: genre.id,
              label: genre.name,
            })) || []
          } // Preload all genres if available
          isClearable
          className="mb-2 text-black"
        />
      </div>

      <LayoutTemplate layout="card">
        {isLoading
          ? Array.from({ length: 20 }).map((_, index) => (
              <SkeletonMovieCard key={`movie-skeleton-${index}`} />
            ))
          : error
          ? `Error: ${error.message}`
          : data?.pages.map((page) =>
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
      {!hasNextPage && (
        <p className="text-center mt-6 text-2xl font-bold">
          No more movies to load
        </p>
      )}

      {isFetchingNextPage && <NewDataLoading />}
      <div ref={loadMoreRef} />
    </div>
  );
}
