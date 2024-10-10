"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ToggleType from "@/components/ToggleType";
import { useInfinitySearchMovie, useInfinitySearchTV } from "@/hooks/useSearch";
import { LayoutTemplate } from "@/components/LayoutTemplate";
import MovieCard from "@/components/MovieCard";
import MovieListCard from "@/components/MovieListCard";
import { useInView } from "react-intersection-observer";
import NewDataLoading from "@/components/NewDataLoading";
import ViewToggle from "@/components/ToogleView";
import LoadingIndicator from "@/components/LoadingIndicator";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState(""); // Store the search term
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Movie");
  const [view, setView] = useState("card");
  const { ref, inView } = useInView();

  // Get query and category from session storage when the component mounts
  useEffect(() => {
    const storedQuery = sessionStorage.getItem("searchQuery");
    const storedCategory = sessionStorage.getItem("category");
    const storedView = sessionStorage.getItem("view");

    if (storedQuery) {
      setQuery(storedQuery);
      setSearchQuery(storedQuery);
    }

    if (storedCategory) {
      setCategory(storedCategory);
    }

    if (storedView) {
      setView(storedView);
    }
  }, []);

  const {
    data: movieData,
    isLoading: isMovieLoading,
    isError: isMovieError,
    error: movieError,
    fetchNextPage: fetchMovieNextPage,
    hasNextPage: hasMovieNextPage,
    isFetchingNextPage: isFetchingMovieNextPage,
  } = useInfinitySearchMovie(searchQuery);

  const {
    data: tvData,
    isLoading: isTVLoading,
    isError: isTVError,
    error: tvError,
    fetchNextPage: fetchTVNextPage,
    hasNextPage: hasTVNextPage,
    isFetchingNextPage: isFetchingTVNextPage,
  } = useInfinitySearchTV(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchQuery(query);

    // Update session storage and URL
    sessionStorage.setItem("searchQuery", query);

    // Update URL with the new query
    const newUrl = `?query=${encodeURIComponent(query)}`;
    window.history.pushState(null, "", newUrl);
  };

  useEffect(() => {
    if (inView) {
      if (category === "Movie") {
        fetchMovieNextPage();
      } else {
        fetchTVNextPage();
      }
    }
  }, [inView, category]);

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    sessionStorage.setItem("category", newCategory); // Save selected category in sessionStorage
  };

  if (isMovieLoading || isTVLoading) return <LoadingIndicator />;

  const handleViewChange = (newView: string) => {
    setView(newView);
    sessionStorage.setItem("view", newView);
  };

  const IsEmptyTv = tvData?.pages?.[0]?.tvShows?.length === 0;
  const IsEmptyMovie = movieData?.pages?.[0]?.movies?.length === 0;

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
          <ToggleType
            selectedView={category}
            onViewChange={handleCategoryChange}
          />
        </div>
        <div className="flex flex-row justify-end">
          <ViewToggle selectedView={view} onViewChange={handleViewChange} />
        </div>
      </div>

      {/* Show loading indicator when fetching data */}
      {isMovieLoading || isTVLoading ? (
        <p className="text-white">Loading...</p>
      ) : null}
      {isMovieError ? (
        <p className="text-red-500">Error: {movieError?.message}</p>
      ) : null}
      {isTVError ? (
        <p className="text-red-500">Error: {tvError?.message}</p>
      ) : null}

      {/* Show search results based on category */}
      {category === "Movie" ? (
        <div className="mt-6">
          {IsEmptyMovie && searchQuery !== "" ? (
            <div className="flex justify-center items-center h-screen">
              <p className="text-white text-center text-2xl font-bold">
                No results found for "{searchQuery}"
              </p>
            </div>
          ) : (
            <LayoutTemplate layout={view}>
              {movieData?.pages.map((page, pageIndex) => (
                <React.Fragment key={pageIndex}>
                  {page.movies.map((movie, index) =>
                    view === "card" ? (
                      <MovieCard
                        key={index}
                        id={movie.id}
                        title={movie.title}
                        overview={movie.overview || "No Overview"}
                        posterPath={movie.poster_path || ""}
                        type="movie"
                      />
                    ) : (
                      <MovieListCard
                        key={index}
                        id={movie.id}
                        title={movie.title}
                        overview={movie.overview || "No Overview"}
                        posterPath={movie.poster_path || ""}
                        type="movie"
                      />
                    )
                  )}
                </React.Fragment>
              ))}
            </LayoutTemplate>
          )}
        </div>
      ) : (
        <div className="mt-6">
          {IsEmptyTv && searchQuery !== "" ? (
            <div className="flex justify-center items-center h-screen">
              <p className="text-white text-center text-2xl font-bold">
                No results found for "{searchQuery}"
              </p>
            </div>
          ) : (
            <LayoutTemplate layout={view}>
              {tvData?.pages.map((page, pageIndex) => (
                <React.Fragment key={pageIndex}>
                  {page.tvShows.map((tv, index) =>
                    view === "card" ? (
                      <MovieCard
                        key={index}
                        id={tv.id}
                        title={tv.name}
                        overview={tv.overview || "No Overview"}
                        posterPath={tv.poster_path || ""}
                        type="tv"
                      />
                    ) : (
                      <MovieListCard
                        key={index}
                        id={tv.id}
                        title={tv.name}
                        overview={tv.overview || "No Overview"}
                        posterPath={tv.poster_path || ""}
                        type="tv"
                      />
                    )
                  )}
                </React.Fragment>
              ))}
            </LayoutTemplate>
          )}
        </div>
      )}

      {query === "" && !isMovieLoading && !isTVLoading && (
        <div className="flex justify-center items-center h-screen">
          <p className="text-white text-center text-2xl font-bold">
            Enter a search query
          </p>
        </div>
      )}

      {/* Infinite Scroll Loading Indicator */}
      {(isFetchingMovieNextPage || isFetchingTVNextPage) && <NewDataLoading />}
      {!hasMovieNextPage &&
        category === "Movie" &&
        query !== "" &&
        !IsEmptyMovie &&
        !isMovieLoading && (
          <p className="text-white text-center">No more Movies to load</p>
        )}
      {!hasTVNextPage &&
        category === "TV" &&
        query !== "" &&
        !IsEmptyTv &&
        !isTVLoading && (
          <p className="text-white text-center">No more TV shows to load</p>
        )}

      {/* Infinite Scroll Trigger Element */}
      <div ref={ref} className="h-1"></div>
    </div>
  );
}
