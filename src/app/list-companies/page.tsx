"use client";
import { useState } from "react";
import { useAdvancedSearchData } from "@/hooks/useAdvancedSearch";

export default function CompaniesListPage() {
  const { companies, loading } = useAdvancedSearchData();
  const [selectedLetter, setSelectedLetter] = useState("A");

  if (loading) {
    return <p>Loading...</p>;
  }

  // Filter companies based on selected letter
  const filteredCompanies = companies.filter(
    (company) => company.name && company.name.startsWith(selectedLetter)
  );

  // Generate alphabet buttons
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">List of Companies</h1>

      {/* Alphabet Filter */}
      <div className="flex flex-wrap mb-4 justify-start gap-2 sm:gap-3">
        {alphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => setSelectedLetter(letter)}
            className={`w-10 h-10 flex items-center justify-center font-semibold rounded-full 
            transition duration-300 ease-in-out transform ${
              selectedLetter === letter 
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white scale-110" 
                : "bg-gray-200 text-gray-700 hover:bg-blue-300 hover:text-white hover:scale-105"
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Display Filtered Companies */}
      <h2 className="text-xl font-bold mb-2">Companies starting with {selectedLetter}</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-2 list-disc list-inside">
        {filteredCompanies.map((company) => (
          <li key={company.id} className="text-white">{company.name}</li>
        ))}
      </ul>

      {/* If no companies found */}
      {filteredCompanies.length === 0 && (
        <p className="text-gray-500">No companies found for {selectedLetter}</p>
      )}
    </div>
  );
}
