"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Collapse } from "@kunukn/react-collapse";
import ToggleType from "@/components/ToggleType";
import { useInfinitySearchMovie } from "@/hooks/useSearch";
import { LayoutTemplate } from "@/components/LayoutTemplate";
import MovieCard from "@/components/MovieCard";
import { useInView } from "react-intersection-observer";
import NewDataLoading from "@/components/NewDataLoading";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState(""); // Store the search term
  const [query, setQuery] = useState("");
  const [advancedOpen, setAdvancedOpen] = useState(false); // Control the collapse of Advanced Search
  const [category, setCategory] = useState("Movie"); // Toggle between Movie and TV search

  const { ref, inView } = useInView();

  // Using the custom hook to fetch search movies
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitySearchMovie(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle search logic
    if (query.trim() === "") {
      console.log("Search bar is empty, displaying local companies.");
      setSearchQuery(""); // Reset searchQuery jika kosong
    } else {
      console.log(`Searching for companies with name: ${query}`);
      setSearchQuery(query); // Set searchQuery ke query yang dimasukkan
    }
  };

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-white mb-4">Search {category}</h1>

      {/* Search Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="mb-4 flex flex-col sm:flex-row items-end text-white"
      >
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${category}...`}
          className="p-2 border border-gray-300 rounded w-full sm:w-2/3 text-white"
        />
        <Button
          size={"lg"}
          variant="secondary"
          type="submit"
          className="mt-2 sm:mt-0 sm:ml-2 px-4 py-2 rounded-md"
        >
          Search
        </Button>
      </form>

      {/* Toggle between Movie and TV */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
        <div className="w-full sm:w-auto">
          <ToggleType selectedView={category} onViewChange={setCategory} />
        </div>
      </div>

      {/* Show loading indicator when fetching data */}
      {isLoading && <p className="text-white">Loading...</p>}
      {isError && <p className="text-red-500">Error: {error?.message}</p>}

      {/* Show search results */}
      <div className="mt-6">
        <LayoutTemplate layout="card">
          {data?.pages.map((page, pageIndex) => (
            <React.Fragment key={pageIndex}>
              {page.movies.map((movie, index) => (
                <MovieCard
                  key={index}
                  id={movie.id}
                  title={movie.title}
                  overview={movie.overview || "No Overview"}
                  posterPath={movie.poster_path || ""}
                  type={category}
                />
              ))}
            </React.Fragment>
          ))}
        </LayoutTemplate>
      </div>
      {isFetchingNextPage && <NewDataLoading />}
      {isFetchingNextPage && !hasNextPage && (
        <p className="text-white">No more {category} to load</p>
      )}
      <div ref={ref} className="h-1"></div>
    </div>
  );
}
