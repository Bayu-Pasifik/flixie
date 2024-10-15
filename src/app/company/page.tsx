"use client";
import React, { useState, useEffect } from "react";
import useCompanyData from "@/util/useCompanyJson";
import { useInfinityCompany } from "@/hooks/useCompany";
import MovieCard from "@/components/MovieCard";
import { LayoutTemplate } from "@/components/LayoutTemplate";
import { Button } from "@/components/ui/button";
import LoadingIndicator from "@/components/LoadingIndicator";
import { useInView } from "react-intersection-observer";
import NewDataLoading from "@/components/NewDataLoading";

export default function CompanyPage() {
  const {
    companies,
    loading: companyLoading,
    error: companyError,
  } = useCompanyData();

  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: searchData,
    isLoading: searchLoading,
    isError: searchError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinityCompany(searchQuery);

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 1.0,
  });

  // Run only on the client
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedQuery = sessionStorage.getItem("searchQuery");
      if (storedQuery) {
        setQuery(storedQuery);
        setSearchQuery(storedQuery);
      }
    }
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim() === "") {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("searchQuery");
      }
      setSearchQuery("");
    } else {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("searchQuery", query);
      }
      setSearchQuery(query);
    }
  };

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

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
          placeholder="Search Company..."
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

      {/* Display Data */}
      <div>
        {searchQuery.trim() === "" ? (
          <div>
            {companyLoading && <LoadingIndicator />}
            {companyError && (
              <p>Error loading local company data: {companyError}</p>
            )}
            <LayoutTemplate layout="card">
              <React.Fragment>
                {companies.map((company) => (
                  <MovieCard
                    key={company.id}
                    id={company.id}
                    title={company.name}
                    posterPath={company.logo_path || ""}
                    overview=""
                    type="company"
                  />
                ))}
              </React.Fragment>
            </LayoutTemplate>
          </div>
        ) : (
          <div>
            {searchLoading && <LoadingIndicator />}
            {searchError && <p>Error fetching search results.</p>}
            {searchData && (
              <LayoutTemplate layout="card">
                {searchData.pages?.map((result, index) => (
                  <React.Fragment key={index}>
                    {result.company.map((company) => (
                      <MovieCard
                        key={company.id}
                        id={company.id}
                        title={company.name}
                        posterPath={company.logo_path || ""}
                        overview=""
                        type="company"
                      />
                    ))}
                  </React.Fragment>
                ))}
              </LayoutTemplate>
            )}
            {isFetchingNextPage && (
              <div className="text-center mt-4">
                <NewDataLoading />
              </div>
            )}
            {!hasNextPage && (
              <div className="text-center mt-4 font-bold text-2xl">
                <p>No more results.</p>
              </div>
            )}
            <div ref={loadMoreRef}></div>
          </div>
        )}
      </div>
    </div>
  );
}
