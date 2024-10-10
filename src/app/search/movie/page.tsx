"use client";
import { useState } from "react";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import { useRouter } from "next/navigation";
import { useMovieByAdvancedSearch } from "@/hooks/useAdvancedSearch";
import {
  useAdvancedSearchData,
  useCountries,
  useLanguages,
} from "@/hooks/useAdvancedSearch";
import { useMovieGenre } from "@/hooks/useGenres";
import MovieCard from "@/components/MovieCard";
import { LayoutTemplate } from "@/components/LayoutTemplate";

const generateRatingOptions = () => {
  const options = [];
  for (let i = 1; i <= 100; i++) {
    options.push({
      value: (i / 10).toFixed(1),
      label: (i / 10).toFixed(1),
    });
  }
  return options;
};

type OptionType = {
  value: string;
  label: string;
};

export default function SearchMoviePage() {
  const router = useRouter();
  const [runtimeMoreThan, setRuntimeMoreThan] = useState<number | 0>(0);
  const [runtimeLessThan, setRuntimeLessThan] = useState<number | 0>(0);
  const [ratingMoreThan, setRatingMoreThan] = useState<string | 0>(0);
  const [ratingLessThan, setRatingLessThan] = useState<string | 0>(0);
  const [year, setYear] = useState<number | 0>(0);
  const [companyId, setCompanyId] = useState<OptionType[]>([]);
  const [genresId, setGenresId] = useState<OptionType[]>([]);
  const [keywordsId, setKeywordsId] = useState<OptionType[]>([]);
  const [countryId, setCountryId] = useState<OptionType | null>(null); // Changed to allow single selection
  const [languagesId, setLanguagesId] = useState<OptionType[]>([]);

  const { companies, keywords } = useAdvancedSearchData();
  const { data: genres } = useMovieGenre();
  const { data: countries } = useCountries();
  const { data: languages } = useLanguages();

  // Cache untuk company
  const companyCache: Record<string, OptionType[]> = {};

  // Fungsi untuk filter Company
  const loadCompanyOptions = (inputValue: string) => {
    if (companyCache[inputValue]) {
      return Promise.resolve(companyCache[inputValue]);
    }
    const filteredCompanies = companies
      .filter((company) =>
        company.name.toLowerCase().includes(inputValue.toLowerCase())
      )
      .slice(0, 20)
      .map((company) => ({
        value: company.id.toString(),
        label: company.name,
      }));

    companyCache[inputValue] = filteredCompanies;
    return Promise.resolve(filteredCompanies);
  };

  // Fungsi untuk filter Keywords
  const loadKeywordOptions = (inputValue: string) => {
    const filteredKeywords = keywords
      .filter((keyword) =>
        keyword.name.toLowerCase().includes(inputValue.toLowerCase())
      )
      .slice(0, 20)
      .map((keyword) => ({
        value: keyword.id.toString(),
        label: keyword.name,
      }));

    return Promise.resolve(filteredKeywords);
  };

  // Fetch movies with advanced search filters
  const { data: movieData, fetchNextPage } = useMovieByAdvancedSearch({
    runTimeGreater: runtimeMoreThan,
    runTimeLess: runtimeLessThan,
    year,
    companyId: companyId.map((c) => (c.value)),
    keywordsId: keywordsId.map((k) => (k.value)),
    genresId: genresId.map((g) => (g.value)),
    countryId: countryId ? countryId.value : undefined, // Updated to pass single country value
    languagesId: languagesId.map((l) => l.value),
  });

  const handleSearch = () => {
    // Optionally, you can reset pages when applying new filters
    // resetPage();

    // To load more movies if the filters change
    fetchNextPage();
  };

  return (
    <div className="p-4">
      <h1>Search Movie</h1>

      {/* Advanced Search Filters */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Filters for Runtime, Rating, and Year */}
        <div>
          <label>Runtime More Than:</label>
          <input
            type="number"
            value={runtimeMoreThan}
            onChange={(e) => setRuntimeMoreThan(Number(e.target.value) || 0)}
            placeholder="e.g. 90"
            className="p-2 border rounded-md mb-2 text-black"
          />
        </div>
        <div>
          <label>Runtime Less Than:</label>
          <input
            type="number"
            value={runtimeLessThan}
            onChange={(e) => setRuntimeLessThan(Number(e.target.value) || 0)}
            placeholder="e.g. 150"
            className="p-2 border rounded-md mb-2 text-black"
          />
        </div>
        <div>
          <label>Rating More Than:</label>
          <Select
            options={generateRatingOptions()}
            value={
              ratingMoreThan
                ? { value: ratingMoreThan, label: ratingMoreThan }
                : null
            }
            onChange={(option) => setRatingMoreThan(option ? option.value : "")}
            placeholder="Select rating..."
            className="mb-2 text-black"
          />
        </div>
        <div>
          <label>Rating Less Than:</label>
          <Select
            options={generateRatingOptions()}
            value={
              ratingLessThan
                ? { value: ratingLessThan, label: ratingLessThan }
                : null
            }
            onChange={(option) => setRatingLessThan(option ? option.value : "")}
            placeholder="Select rating..."
            className="mb-2 text-black"
          />
        </div>
        <div>
          <label>Year:</label>
          <input
            type="text"
            value={year}
            onChange={(e) => setYear(Number(e.target.value) || 0)}
            placeholder="e.g. 2023"
            className="p-2 border rounded-md mb-2 text-black"
          />
        </div>

        {/* Select Companies */}
        <div>
          <label>Companies:</label>
          <AsyncSelect
            loadOptions={loadCompanyOptions}
            isClearable
            isMulti
            placeholder="Select company..."
            onChange={(value) => setCompanyId(value as OptionType[])}
            className="mb-2 text-black"
          />
        </div>

        {/* Select Genres */}
        <div>
          <label>Genres:</label>
          <Select
            options={genres?.map((genre) => ({
              value: genre.id.toString(),
              label: genre.name,
            }))}
            isClearable
            isMulti
            placeholder="Select genres..."
            onChange={(value) => setGenresId(value as OptionType[])}
            className="mb-2 text-black"
          />
        </div>

        {/* Select Keywords */}
        <div>
          <label>Keywords:</label>
          <AsyncSelect
            loadOptions={loadKeywordOptions}
            isClearable
            isMulti
            placeholder="Select keywords..."
            onChange={(value) => setKeywordsId(value as OptionType[])}
            className="mb-2 text-black"
          />
        </div>

        {/* Select Countries */}
        <div>
          <label>Countries:</label>
          <Select
            options={countries?.map((country) => ({
              value: country.iso_3166_1,
              label: country.english_name,
            }))}
            isClearable
            placeholder="Select country..." // Updated to singular
            onChange={(value) => setCountryId(value as OptionType | null)} // Allow single selection
            className="mb-2 text-black"
          />
        </div>

        {/* Select Languages */}
        <div>
          <label>Languages:</label>
          <Select
            options={languages?.map((language) => ({
              value: language.iso_639_1,
              label: language.english_name,
            }))}
            isClearable
            isMulti
            placeholder="Select languages..."
            onChange={(value) => setLanguagesId(value as OptionType[])}
            className="mb-2 text-black"
          />
        </div>
      </div>

      <button
        onClick={handleSearch}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
      >
        Apply Filters
      </button>

      {/* Movie Results */}
      <LayoutTemplate layout="card">
      {movieData?.pages.map((page) =>
        page.movies.map((movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            overview={movie.overview}
            posterPath={movie.poster_path}
          />
        ))
      )}
      </LayoutTemplate>
    </div>
  );
}
