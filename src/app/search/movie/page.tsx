"use client";
import { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import { useRouter, useSearchParams } from "next/navigation";
import { useMovieByAdvancedSearch } from "@/hooks/useAdvancedSearch";
import { useInfinitySearchMovie } from "@/hooks/useSearch";
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
    const ratingValue = (i / 10).toFixed(1);
    options.push({
      value: Number(ratingValue),
      label: ratingValue,
    });
  }
  return options;
};

// Define the type for OptionType explicitly
type OptionType = {
  value: string;
  label: string;
};

export default function SearchMoviePage() {
  const router = useRouter();
  const params = useSearchParams();
  const initialQuery = params.get("query");
  const [query, setQuery] = useState<string>(initialQuery || "");

  // State for filtering
  const [runtimeMoreThan, setRuntimeMoreThan] = useState<number>(0);
  const [runtimeLessThan, setRuntimeLessThan] = useState<number>(0);
  const [ratingMoreThan, setRatingMoreThan] = useState<number>(0);
  const [ratingLessThan, setRatingLessThan] = useState<number>(0);
  const [year, setYear] = useState<number>(0);

  // Add types to all filter states
  const [companyId, setCompanyId] = useState<OptionType[]>([]);
  const [genresId, setGenresId] = useState<OptionType[]>([]);
  const [keywordsId, setKeywordsId] = useState<OptionType[]>([]);
  const [countryId, setCountryId] = useState<OptionType | null>(null);
  const [languagesId, setLanguagesId] = useState<OptionType[]>([]);

  // Active filters state
  const [activeFilters, setActiveFilters] = useState({
    runtimeMoreThan: 0,
    runtimeLessThan: 0,
    ratingMoreThan: 0,
    ratingLessThan: 0,
    year: 0,
    companyId: [] as OptionType[],
    genresId: [] as OptionType[],
    keywordsId: [] as OptionType[],
    countryId: null as OptionType | null,
    languagesId: [] as OptionType[],
  });

  // Fetch data for dropdowns
  const { companies, keywords } = useAdvancedSearchData();
  const { data: genres } = useMovieGenre();
  const { data: countries } = useCountries();
  const { data: languages } = useLanguages();

  const companyCache: Record<string, OptionType[]> = {};
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

  const [useAdvancedSearch, setUseAdvancedSearch] = useState<boolean>(false);

  const { data: searchData, fetchNextPage: fetchNextSearchPage } =
    useInfinitySearchMovie(query);
  const { data: movieData, fetchNextPage } = useMovieByAdvancedSearch({
    runTimeGreater: activeFilters.runtimeMoreThan,
    runTimeLess: activeFilters.runtimeLessThan,
    vote_averageMoreThan: activeFilters.ratingMoreThan,
    vote_averageLessThan: activeFilters.ratingLessThan,
    year: activeFilters.year,
    companyId: activeFilters.companyId.map((c) => c.value),
    keywordsId: activeFilters.keywordsId.map((k) => k.value),
    genresId: activeFilters.genresId.map((g) => g.value),
    countryId: activeFilters.countryId
      ? activeFilters.countryId.value
      : undefined,
    languagesId: activeFilters.languagesId.map((l) => l.value),
  });

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setUseAdvancedSearch(query === "");
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSearch = () => {
    setUseAdvancedSearch(true);
    setQuery("");
    setActiveFilters({
      runtimeMoreThan,
      runtimeLessThan,
      ratingMoreThan,
      ratingLessThan,
      year,
      companyId,
      genresId,
      keywordsId,
      countryId,
      languagesId,
    });
  };

  return (
    <div className="p-4">
      <h1>Search Movie</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for movies..."
        className="p-2 border rounded-md mb-4 text-black w-full"
      />
      {/* Advanced Search Filters */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Example filter component */}
        <div>
          <label>Runtime More Than:</label>
          <input
            type="text"
            value={runtimeMoreThan}
            onChange={(e) => setRuntimeMoreThan(Number(e.target.value) || 0)}
            placeholder="e.g. 90"
            className="p-2 border rounded-md mb-2 text-black"
          />
        </div>
        {/* Add other filter inputs here */}

        {/* Filters for Runtime, Rating, and Year */}
        <div>
          <label>Runtime More Than:</label>
          <input
            type="text"
            value={runtimeMoreThan}
            onChange={(e) => setRuntimeMoreThan(Number(e.target.value) || 0)}
            placeholder="e.g. 90"
            className="p-2 border rounded-md mb-2 text-black"
          />
        </div>
        <div>
          <label>Runtime Less Than:</label>
          <input
            type="text"
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
              ratingMoreThan > 0 // Ensure the value is only set if greater than 0
                ? { value: ratingMoreThan, label: ratingMoreThan.toString() }
                : null
            }
            onChange={(option) => setRatingMoreThan(option ? option.value : 0)}
            placeholder="Select rating..."
            className="mb-2 text-black"
          />
        </div>
        <div>
          <label>Rating Less Than:</label>
          <Select
            options={generateRatingOptions()}
            value={
              ratingLessThan > 0 // Ensure the value is only set if greater than 0
                ? { value: ratingLessThan, label: ratingLessThan.toString() }
                : null
            }
            onChange={(option) => setRatingLessThan(option ? option.value : 0)}
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
        className="bg-blue-500 text-white p-2 rounded-md mb-4"
      >
        Apply Filters
      </button>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {(useAdvancedSearch ? movieData : searchData)?.pages.flatMap((page) =>
          page.movies.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              posterPath={movie.poster_path}
              overview={movie.overview}
            />
          ))
        )}
      </div>
    </div>
  );
}
