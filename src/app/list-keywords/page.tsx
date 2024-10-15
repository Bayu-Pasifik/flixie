"use client";
import { Suspense, useState } from "react";
import { useAdvancedSearchData } from "@/hooks/useAdvancedSearch";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import LoadingIndicator from "@/components/LoadingIndicator";

function KeywordsList() {
  const { keywords, loading } = useAdvancedSearchData();
  const [selectedLetter, setSelectedLetter] = useState("A");
  const params = useSearchParams();
  const type = params.get("type");

  // Jika loading masih true
  if (loading) {
    return <LoadingIndicator />;
  }

  // Filter keywords berdasarkan huruf yang dipilih (menggunakan huruf kecil)
  const filteredKeywords = keywords.filter(
    (keyword) =>
      keyword.name &&
      keyword.name.toLowerCase().startsWith(selectedLetter.toLowerCase())
  );


  // Generate alphabet buttons
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">List of Keywords</h1>

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

      {/* Display Filtered Keywords */}
      <h2 className="text-xl font-bold mb-2">
        Keywords starting with {selectedLetter}
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-2 list-disc list-inside">
        {filteredKeywords.map((keyword) => {
          if (type === "movie" || type === "tv") {
            return (
              <Link
                href={
                  type === "movie"
                    ? `/movie/${keyword.id}/keywords`
                    : `/tv/${keyword.id}/keywords`
                }
                key={keyword.id}
              >
                <li className="text-white hover:underline hover:text-blue-500">
                  {keyword.name}
                </li>
              </Link>
            );
          } else {
            return (
              <li key={keyword.id} className="text-white">
                {keyword.name}
              </li>
            );
          }
        })}
      </ul>

      {/* Jika tidak ada keywords yang ditemukan */}
      {filteredKeywords.length === 0 && (
        <p className="text-gray-500">No Keywords found for {selectedLetter}</p>
      )}
    </div>
  );
}

export default function KeywordsListPage() {
  <Suspense fallback={<LoadingIndicator />}>
    return <KeywordsList />;
  </Suspense>;
}
