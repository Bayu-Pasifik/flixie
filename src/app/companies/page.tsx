"use client";
import React, { useState } from "react";
import useCompanyData from "@/util/useCompanyJson";
import { useInfinityCompany } from "@/hooks/useCompany";
import MovieCard from "@/components/MovieCard";
import { LayoutTemplate } from "@/components/LayoutTemplate";
import { Button } from "@/components/ui/button";

export default function CompanyPage() {
  const {
    companies,
    loading: companyLoading,
    error: companyError,
  } = useCompanyData();

  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // State untuk menyimpan query pencarian yang sebenarnya

  // Hook untuk mengambil hasil pencarian berdasarkan query di search bar
  const {
    data: searchData,
    isLoading: searchLoading,
    isError: searchError,
  } = useInfinityCompany(searchQuery); // Menggunakan searchQuery untuk mengambil data

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Jika search bar kosong, tidak melakukan pencarian
    if (query.trim() === "") {
      console.log("Search bar is empty, displaying local companies.");
      setSearchQuery(""); // Reset searchQuery jika kosong
    } else {
      console.log(`Searching for companies with name: ${query}`);
      setSearchQuery(query); // Set searchQuery ke query yang dimasukkan
    }
  };

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
        {/* Jika search bar kosong, tampilkan data dari company.json */}
        {searchQuery.trim() === "" ? (
          <div>
            {companyLoading && <p>Loading local company data...</p>}
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
                    posterPath={""}
                    overview=""
                    type="company"
                  />
                ))}
              </React.Fragment>
            </LayoutTemplate>
          </div>
        ) : (
          <div>
            {searchLoading && <p>Loading search results...</p>}
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
          </div>
        )}
      </div>
    </div>
  );
}
