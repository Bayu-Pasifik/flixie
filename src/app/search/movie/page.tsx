"use client";
import { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";
import Select from "react-select"; // Import react-select for the rating
import { LayoutTemplate } from "@/components/LayoutTemplate";
import MovieCard from "@/components/MovieCard";
import { useInfinitySearchMovie } from "@/hooks/useSearch";
import { useSearchParams, useRouter } from "next/navigation";
import SkeletonMovieCard from "@/components/SkeletonMovieCard";
import { useInView } from "react-intersection-observer";
import NewDataLoading from "@/components/NewDataLoading";
import {
  useAdvancedSearchData,
  useCountries,
  useLanguages,
} from "@/hooks/useAdvancedSearch";
import { useMovieGenre } from "@/hooks/useGenres";

type OptionType = {
  value: string;
  label: string;
};

// Generate rating options from 0.1 to 10 with increments of 0.1
const generateRatingOptions = () => {
  const options = [];
  for (let i = 1; i <= 100; i++) {
    options.push({
      value: (i / 10).toFixed(1), // Format to 1 decimal place
      label: (i / 10).toFixed(1),
    });
  }
  return options;
};

export default function SearchMoviePage() {
  const params = useSearchParams();
  const query = params.get("query");
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfinitySearchMovie(query || "");
  const { companies, keywords, loading } = useAdvancedSearchData();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(query || "");
  const [debouncedQuery, setDebouncedQuery] = useState(query || "");
  const [runtimeMoreThan, setRuntimeMoreThan] = useState<number | "">("");
  const [runtimeLessThan, setRuntimeLessThan] = useState<number | "">("");
  const [ratingMoreThan, setRatingMoreThan] = useState<string | "">("");
  const [ratingLessThan, setRatingLessThan] = useState<string | "">("");
  const [year, setYear] = useState<number | "">("");
  const { data: genres, isLoading: isGenresLoading } = useMovieGenre();
  const { data: countries, isLoading: isCountriesLoading } = useCountries();
  const { data: languages, isLoading: isLanguagesLoading } = useLanguages();
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      router.push(`/search/movie?query=${debouncedQuery}`);
    }
  }, [debouncedQuery, router]);

  const { ref: loadMoreRef, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  const companyCache: { [key: string]: OptionType[] } = {};
  const keywordCache: { [key: string]: OptionType[] } = {};

  const loadCompanyOptions = (inputValue: string): Promise<OptionType[]> => {
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

  const loadGenreOptions = (inputValue: string): Promise<OptionType[]> => {
    if (isGenresLoading || !genres) {
      return Promise.resolve([]);
    }

    const filteredGenres = genres
      .filter((genre) =>
        genre.name.toLowerCase().includes(inputValue.toLowerCase())
      )
      .map((genre) => ({
        value: genre.id.toString(),
        label: genre.name,
      }));

    return Promise.resolve(filteredGenres);
  };

  const loadKeywordOptions = (inputValue: string): Promise<OptionType[]> => {
    if (keywordCache[inputValue]) {
      return Promise.resolve(keywordCache[inputValue]);
    }

    const filteredKeywords = keywords
      .filter((keyword) =>
        keyword.name.toLowerCase().includes(inputValue.toLowerCase())
      )
      .slice(0, 20)
      .map((keyword) => ({
        value: keyword.id.toString(),
        label: keyword.name,
      }));

    keywordCache[inputValue] = filteredKeywords;
    return Promise.resolve(filteredKeywords);
  };

  const loadCountryOptions = (inputValue: string): Promise<OptionType[]> => {
    if (isCountriesLoading || !countries) {
      return Promise.resolve([]);
    }

    const filteredCountries = countries
      .filter((country) =>
        country.english_name.toLowerCase().includes(inputValue.toLowerCase())
      )
      .map((country) => ({
        value: country.iso_3166_1,
        label: country.english_name,
      }));

    return Promise.resolve(filteredCountries);
  };

  const loadLanguageOptions = (inputValue: string): Promise<OptionType[]> => {
    if (isLanguagesLoading || !languages) {
      return Promise.resolve([]);
    }

    const filteredLanguages = languages
      .filter((language) =>
        language.english_name.toLowerCase().includes(inputValue.toLowerCase())
      )
      .map((language) => ({
        value: language.iso_639_1,
        label: language.english_name,
      }));

    return Promise.resolve(filteredLanguages);
  };

  const handleSearch = () => {
    // Build the query string based on the filters
    const filters = [];
    if (runtimeMoreThan) filters.push(`runtime_more_than=${runtimeMoreThan}`);
    if (runtimeLessThan) filters.push(`runtime_less_than=${runtimeLessThan}`);
    if (ratingMoreThan) filters.push(`rating_more_than=${ratingMoreThan}`);
    if (ratingLessThan) filters.push(`rating_less_than=${ratingLessThan}`);
    if (year) filters.push(`year=${year}`);

    const filterQuery = filters.length > 0 ? `&${filters.join("&")}` : "";
    router.push(`/search/movie?query=${debouncedQuery}${filterQuery}`);
  };

  return (
    <div className="p-4">
      <h1>Search Movie - {query}</h1>

      {/* Search Bar */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for movies..."
        className="w-full p-2 border rounded-md mb-4 text-black"
      />

      {/* Button to Show Advanced Search */}
      <button
        onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
      >
        Toggle Advanced Search
      </button>

      {/* Advanced Search Filters */}
      {showAdvancedSearch && (
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="mt-2">Runtime More Than:</label>
            <input
              type="number"
              value={runtimeMoreThan}
              onChange={(e) => setRuntimeMoreThan(Number(e.target.value) || "")}
              placeholder="e.g. 90"
              className="p-2 border rounded-md mb-2 text-black mt-4 ml-3"
            />
          </div>

          <div>
            <label className="mt-2">Runtime Less Than:</label>
            <input
              type="number"
              value={runtimeLessThan}
              onChange={(e) => setRuntimeLessThan(Number(e.target.value) || "")}
              placeholder="e.g. 150"
              className="p-2 border rounded-md mb-2 text-black ml-5"
            />
          </div>

          <div>
            <label className="mt-2">Rating More Than:</label>
            <Select
              options={generateRatingOptions()}
              value={
                ratingMoreThan
                  ? { value: ratingMoreThan, label: ratingMoreThan }
                  : null
              }
              onChange={(option) =>
                setRatingMoreThan(option ? option.value : "")
              }
              placeholder="Select rating..."
              className="mb-2 text-black"
            />
          </div>

          <div>
            <label className="mt-2">Rating Less Than:</label>
            <Select
              options={generateRatingOptions()}
              value={
                ratingLessThan
                  ? { value: ratingLessThan, label: ratingLessThan }
                  : null
              }
              onChange={(option) =>
                setRatingLessThan(option ? option.value : "")
              }
              placeholder="Select rating..."
              className="mb-2 text-black"
            />
          </div>

          <div>
            <label className="mt-2">Year:</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value) || "")}
              placeholder="e.g. 2023"
              className="p-2 border rounded-md mb-2 text-black ml-4"
            />
          </div>

          <div>
            <label className="mt-2">Companies:</label>
            <AsyncSelect
              loadOptions={loadCompanyOptions}
              isClearable
              placeholder="Select company..."
              className="mb-2"
            />
          </div>

          <div>
            <label className="mt-2">Genres:</label>
            <AsyncSelect
              loadOptions={loadGenreOptions}
              isClearable
              placeholder="Select genres..."
              className="mb-2"
            />
          </div>

          <div>
            <label className="mt-2">Keywords:</label>
            <AsyncSelect
              loadOptions={loadKeywordOptions}
              isClearable
              placeholder="Select keywords..."
              className="mb-2"
            />
          </div>

          <div>
            <label className="mt-2">Countries:</label>
            <AsyncSelect
              loadOptions={loadCountryOptions}
              isClearable
              placeholder="Select countries..."
              className="mb-2"
            />
          </div>

          <div>
            <label className="mt-2">Languages:</label>
            <AsyncSelect
              loadOptions={loadLanguageOptions}
              isClearable
              placeholder="Select languages..."
              className="mb-2"
            />
          </div>

          <button
            onClick={handleSearch}
            className="col-span-1 md:col-span-2 mt-4 bg-blue-500 text-white py-2 px-4 rounded"
          >
            Apply Filters
          </button>
        </div>
      )}

      {/* Movie Results */}
      <div className="mt-4">
        <LayoutTemplate layout="card">
          {isLoading ? (
            Array.from({ length: 20 }).map((_, index) => (
              <SkeletonMovieCard key={`movie-skeleton-${index}`} />
            ))
          ) : error ? (
            <div>Error: {error.message}</div>
          ) : (
            data?.pages.map((page) =>
              page.movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  posterPath={movie.poster_path}
                  overview={movie.overview}
                />
              ))
            )
          )}
        </LayoutTemplate>
        {isFetchingNextPage && <NewDataLoading />}
        <div ref={loadMoreRef} />
      </div>
    </div>
  );
}
