"use client";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import NewDataLoading from "@/components/NewDataLoading";
import SkeletonMovieCard from "@/components/SkeletonMovieCard"; // Import SkeletonMovieCard
import {
  useInfinityPopularPerson,
  useInfinitySearchPerson,
} from "@/hooks/useCredits";
import MovieCard from "@/components/MovieCard";
import { LayoutTemplate } from "@/components/LayoutTemplate";
import { Button } from "@/components/ui/button";

export default function PersonPage() {
  // Ambil query dari sessionStorage atau kosong jika tidak ada
  const [query, setQuery] = useState(() => {
    return sessionStorage.getItem("searchPersonQuery") || "";
  });

  const [isSearching, setIsSearching] = useState(false); // State untuk mengendalikan skeleton loading saat search
  const { ref, inView } = useInView();

  // Tentukan apakah akan menampilkan hasil pencarian atau data populer
  const showSearchResults = query.trim() !== "";

  // Hook untuk mendapatkan data populer
  const {
    data: personsData,
    fetchNextPage: fetchNextPagePopular,
    hasNextPage: hasNextPagePopular,
    isFetchingNextPage: isFetchingNextPagePopular,
    isLoading: isLoadingPopular,
    error: errorPopular,
  } = useInfinityPopularPerson();

  // Hook untuk mendapatkan data pencarian
  const {
    data: searchData,
    fetchNextPage: fetchNextPageSearch,
    hasNextPage: hasNextPageSearch,
    isFetchingNextPage: isFetchingNextPageSearch,
    isLoading: isLoadingSearch,
    error: errorSearch,
    refetch: refetchSearch,
  } = useInfinitySearchPerson(query);

  // Efek untuk infinite scroll
  useEffect(() => {
    if (inView) {
      if (showSearchResults && hasNextPageSearch) {
        fetchNextPageSearch();
      } else if (!showSearchResults && hasNextPagePopular) {
        fetchNextPagePopular();
      }
    }
  }, [inView, fetchNextPagePopular, fetchNextPageSearch, hasNextPagePopular, hasNextPageSearch, showSearchResults]);

  // Handler untuk pencarian
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sessionStorage.setItem("searchPersonQuery", query);
    setIsSearching(true); // Aktifkan loading skeleton ketika search button ditekan
    refetchSearch().finally(() => setIsSearching(false)); // Hentikan skeleton ketika pencarian selesai
  };

  // Loading dan error handling
  if (errorPopular || errorSearch)
    return <div>Error: {errorPopular?.message || errorSearch?.message}</div>;

  return (
    <div className="p-4">
      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="mb-4 flex flex-col sm:flex-row items-end"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search persons..."
          className="p-2 border border-gray-300 rounded w-full sm:w-1/3 text-black"
        />
        <Button
          variant="secondary"
          type="submit"
          size={"lg"}
          className="mt-2 sm:mt-0 sm:ml-2 px-4 py-2 rounded-md"
        >
          Search
        </Button>
      </form>

      {/* Tampilkan Skeleton saat search sedang dalam proses */}
      {isSearching && (
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 20 }).map((_, index) => (
            <SkeletonMovieCard key={index} />
          ))}
        </div>
      )}

      {!isSearching && (
        <LayoutTemplate layout="card">
          {/* Tampilkan hasil pencarian atau data populer */}
          {showSearchResults
            ? searchData?.pages.map((page, index) => (
                <React.Fragment key={index}>
                  {page.persons.map((person) => (
                    <MovieCard
                      key={person.id}
                      id={person.id}
                      title={person.name}
                      overview={person.known_for_department}
                      posterPath={person.profile_path || ""}
                      type="person"
                    />
                  ))}
                </React.Fragment>
              ))
            : personsData?.pages.map((page, index) => (
                <React.Fragment key={index}>
                  {page.persons.map((person) => (
                    <MovieCard
                      key={person.id}
                      id={person.id}
                      title={person.name}
                      overview={person.known_for_department}
                      posterPath={person.profile_path || ""}
                      type="person"
                    />
                  ))}
                </React.Fragment>
              ))}
        </LayoutTemplate>
      )}

      {/* Infinite Scroll Loading Trigger */}
      <div ref={ref} className="h-1" />

      {/* Show loading spinner while fetching next page */}
      {showSearchResults && isFetchingNextPageSearch && (
        <div className="text-center mt-4">
          <NewDataLoading />
        </div>
      )}
      {!showSearchResults && isFetchingNextPagePopular && (
        <div className="text-center mt-4">
          <NewDataLoading />
        </div>
      )}

      {/* End message */}
      {!showSearchResults && !hasNextPagePopular && (
        <div className="text-center text-2xl font-bold my-4">
          You've reached the end of popular persons!
        </div>
      )}
      {showSearchResults && !hasNextPageSearch && (
        <div className="text-center text-2xl font-bold my-4">
          No more results found for "{query}"!
        </div>
      )}
    </div>
  );
}
