"use client";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useQueryClient } from "@tanstack/react-query"; // Untuk query cache
import LoadingIndicator from "@/components/LoadingIndicator";
import NewDataLoading from "@/components/NewDataLoading";
import {
  useInfinityPopularPerson,
  useInfinitySearchPerson,
} from "@/hooks/useCredits";
import MovieCard from "@/components/MovieCard";
import { LayoutTemplate } from "@/components/LayoutTemplate";
import { Button } from "@/components/ui/button";

export default function PersonPage() {
  const [query, setQuery] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [searchTriggered, setSearchTriggered] = useState(false); // State untuk melacak apakah tombol search sudah diklik
  const queryClient = useQueryClient();

  // Tentukan apakah search active
  const isSearchActive = query.trim() !== "" && searchActive;

  // Hook untuk mendapatkan data popular persons
  const {
    data: personsData,
    fetchNextPage: fetchNextPagePopular,
    hasNextPage: hasNextPagePopular,
    isFetchingNextPage: isFetchingNextPagePopular,
    isLoading: isLoadingPopular,
    error: errorPopular,
  } = useInfinityPopularPerson();

  // Hook untuk mendapatkan data search persons
  const {
    data: searchData,
    fetchNextPage: fetchNextPageSearch,
    hasNextPage: hasNextPageSearch,
    isFetchingNextPage: isFetchingNextPageSearch,
    isLoading: isLoadingSearch,
    error: errorSearch,
    refetch: refetchSearch, // Untuk memaksa pencarian ulang
  } = useInfinitySearchPerson(query);

  const { ref, inView } = useInView();

  // Effect untuk infinite scroll
  useEffect(() => {
    if (inView) {
      if (isSearchActive && hasNextPageSearch) {
        fetchNextPageSearch();
      } else if (!isSearchActive && hasNextPagePopular) {
        fetchNextPagePopular();
      }
    }
  }, [
    inView,
    fetchNextPagePopular,
    fetchNextPageSearch,
    hasNextPagePopular,
    hasNextPageSearch,
    isSearchActive,
  ]);

  // Handler untuk pencarian
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim() !== "") {
      // Reset pencarian sebelumnya
      setSearchActive(true); // Aktifkan pencarian baru
      setSearchTriggered(true); // Tandai bahwa tombol search sudah diklik
      queryClient.resetQueries({ queryKey: ["person/search"] }); // Reset query popular cache
      refetchSearch(); // Lakukan pencarian ulang saat query baru dimasukkan
    } else {
      setSearchActive(false); // Jika query kosong, kembali ke mode popular
      setSearchTriggered(false); // Reset pencarian, artinya belum ada tombol search yang diklik
    }
  };

  // Loading dan error handling
  if (isLoadingPopular || isLoadingSearch) return <LoadingIndicator />;
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

      <LayoutTemplate layout="card">
        {/* Tampilkan hasil pencarian jika searchActive dan searchTriggered, jika tidak tampilkan popular */}
        {isSearchActive && searchTriggered
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

      {/* Infinite Scroll Loading Trigger */}
      <div ref={ref} className="h-1" />

      {/* Show loading spinner while fetching next page */}
      {isSearchActive && isFetchingNextPageSearch && (
        <div className="text-center mt-4">
          <NewDataLoading />
        </div>
      )}
      {!isSearchActive && isFetchingNextPagePopular && (
        <div className="text-center mt-4">
          <NewDataLoading />
        </div>
      )}

      {/* End message */}
      {!isSearchActive && !hasNextPagePopular && (
        <div className="text-center text-2xl font-bold my-4">
          You've reached the end of popular persons!
        </div>
      )}
      {isSearchActive && !hasNextPageSearch && (
        <div className="text-center text-2xl font-bold my-4">
          No more results found for "{query}"!
        </div>
      )}
    </div>
  );
}
