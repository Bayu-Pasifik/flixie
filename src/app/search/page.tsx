"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Collapse } from "@kunukn/react-collapse";
import ToggleType from "@/components/ToggleType";
import { useInfinitySearchMovie } from "@/hooks/useSearch";
import { LayoutTemplate } from "@/components/LayoutTemplate";
import MovieCard from "@/components/MovieCard";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState(""); // Store the search term
  const [advancedOpen, setAdvancedOpen] = useState(false); // Control the collapse of Advanced Search
  const [category, setCategory] = useState("Movie"); // Toggle between Movie and TV search

  // Using the custom hook to fetch search movies
  const { data, isLoading, isError, error } =
    useInfinitySearchMovie(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle search logic
  };

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
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
    </div>
  );
}
