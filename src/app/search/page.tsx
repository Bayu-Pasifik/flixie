"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input"; // Assuming you have a UI component for Input
import { Button } from "@/components/ui/button";
import { Collapse } from "@kunukn/react-collapse"; // Install with 'react-collapse'
// import { Switch } from "@/components/ui/switch"; // Assuming you have a UI switch or toggle component
// import { Label } from "@/components/ui/label";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState(""); // Store the search term
  const [advancedOpen, setAdvancedOpen] = useState(false); // Control the collapse of Advanced Search
  const [isMovie, setIsMovie] = useState(true); // Toggle between Movie and TV search

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle search logic here (e.g., fetching search results based on searchQuery and isMovie)
    console.log(
      `Searching for ${searchQuery} in ${isMovie ? "Movies" : "TV Series"}`
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-white mb-4">
        Search {isMovie ? "Movies" : "TV Series"}
      </h1>

      {/* Search Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="mb-4 flex flex-col sm:flex-row items-end"
      >
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search ${isMovie ? "Movies" : "TV Series"}...`}
          className="p-2 border border-gray-300 rounded w-full sm:w-2/3 text-black"
        />
        <Button
          variant="secondary"
          type="submit"
          className="mt-2 sm:mt-0 sm:ml-2 px-4 py-2 rounded-md"
        >
          Search
        </Button>
      </form>

      {/* Toggle for Movie and TV */}
      <div className="mb-4 flex items-center space-x-4">
        {/* <Label htmlFor="toggle" className="text-white">
          {isMovie ? "Movie Search" : "TV Search"}
        </Label>
        <Switch
          id="toggle"
          checked={!isMovie}
          onCheckedChange={(checked) => setIsMovie(!checked)} // Switch between Movie and TV
          className="border-white"
        /> */}
      </div>

      {/* Collapse for Advanced Search */}
      <div>
        <Button
          variant="outline"
          onClick={() => setAdvancedOpen(!advancedOpen)}
          className="mb-4 px-4 py-2"
        >
          {advancedOpen ? "Hide Advanced Search" : "Show Advanced Search"}
        </Button>
        <Collapse isOpen={advancedOpen}>
          <div className="bg-gray-700 p-4 rounded-md text-white mb-4">
            {/* Advanced Search Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="releaseDate" className="block mb-2">
                  Release Date (From)
                </label>
                <Input
                  id="releaseDate"
                  type="date"
                  className="p-2 border border-gray-300 rounded text-black w-full"
                />
              </div>

              <div>
                <label htmlFor="releaseDateTo" className="block mb-2">
                  Release Date (To)
                </label>
                <Input
                  id="releaseDateTo"
                  type="date"
                  className="p-2 border border-gray-300 rounded text-black w-full"
                />
              </div>

              <div>
                <label htmlFor="genre" className="block mb-2">
                  Genre
                </label>
                <select
                  id="genre"
                  className="p-2 border border-gray-300 rounded text-black w-full"
                >
                  <option value="">All Genres</option>
                  <option value="action">Action</option>
                  <option value="comedy">Comedy</option>
                  <option value="drama">Drama</option>
                  <option value="horror">Horror</option>
                  {/* Add more genres as needed */}
                </select>
              </div>

              <div>
                <label htmlFor="rating" className="block mb-2">
                  Minimum Rating
                </label>
                <Input
                  id="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  placeholder="0.0 - 10.0"
                  className="p-2 border border-gray-300 rounded text-black w-full"
                />
              </div>
            </div>
          </div>
        </Collapse>
      </div>

      {/* Search Results will be rendered below */}
      <div className="text-white">
        {/* You can map over search results and display them here */}
        {/* Example: 
            {searchResults.map(result => (
              <MovieCard key={result.id} {...result} />
            ))}
        */}
      </div>
    </div>
  );
}
