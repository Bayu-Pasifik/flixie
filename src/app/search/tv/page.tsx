"use client";
import { useState, useEffect, Suspense } from "react";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useTvByAdvancedSearch,
} from "@/hooks/useAdvancedSearch";
import {useInfinitySearchTV } from "@/hooks/useSearch";
import {
  useAdvancedSearchData,
  useCountries,
  useLanguages,
} from "@/hooks/useAdvancedSearch";
import { useMovieGenre } from "@/hooks/useGenres";
import MovieCard from "@/components/MovieCard";
import { LayoutTemplate } from "@/components/LayoutTemplate";
import SkeletonMovieCard from "@/components/SkeletonMovieCard";
import { useInView } from "react-intersection-observer";
import NewDataLoading from "@/components/NewDataLoading";
import LoadingIndicator from "@/components/LoadingIndicator";

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

type OptionType = {
  value: string;
  label: string;
};

type OptionTypeNum = {
  value: number;
  label: string;
};

function SearchTVPage() {
  const router = useRouter();
  const params = useSearchParams();
  const initialQuery = params.get("query");
  const [query, setQuery] = useState<string>(initialQuery || "");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  // State for filtering
  const [runtimeMoreThan, setRuntimeMoreThan] = useState<number>(0);
  const [runtimeLessThan, setRuntimeLessThan] = useState<number>(0);
  const [ratingMoreThan, setRatingMoreThan] = useState<number>(0);
  const [ratingLessThan, setRatingLessThan] = useState<number>(0);
  const [year, setYear] = useState<number>(0);
  const [companyId, setCompanyId] = useState<OptionType[]>([]);
  const [genresId, setGenresId] = useState<OptionType[]>([]);
  const [keywordsId, setKeywordsId] = useState<OptionType[]>([]);
  const [countryId, setCountryId] = useState<OptionType | null>(null);
  const [languagesId, setLanguagesId] = useState<OptionType | null>(null);
  const [airingCompanyId, setAiringCompanyId] = useState<OptionTypeNum | null>(
    null
  );

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
    languagesId: null as OptionType | null,
    airingCompanyId: null as OptionTypeNum | null,
  });

  const { companies, keywords, airingCompany } = useAdvancedSearchData();
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

  const {
    data: searchData,
    fetchNextPage: fetchNextSearchPage,
    isLoading: isLoadingSearch,
    isFetching: isFetchingSearch,
    isFetchingNextPage: isFetchingSearchNextPage,
    hasNextPage: hasNextSearchPage,
  } = useInfinitySearchTV(query);

  const {
    data: TvData,
    fetchNextPage,
    isLoading: isLoadingMovie,
    isFetching: isFetchingTv,
    isFetchingNextPage: isFetchingTvNextPage,
    hasNextPage: hasNextMoviePage,
  } = useTvByAdvancedSearch({
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
    languagesId: activeFilters.languagesId
      ? activeFilters.languagesId.value
      : undefined,
    airingCompanyId: activeFilters.airingCompanyId
      ? activeFilters.airingCompanyId.value
      : undefined,
  });

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query) {
        // Add the query parameter to the URL
        router.replace(`/search/tv?query=${query}`);
      } else {
        setUseAdvancedSearch(true);
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [query, router]);

  const handleShowAdvancedSearch = () => {
    setShowAdvancedSearch((prev) => !prev);
  };

  const handleApplyFilters = () => {
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
      airingCompanyId,
    });
    router.replace("/search/tv");
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setUseAdvancedSearch(false);
  };

  // Intersection Observer for infinite scrolling
  const { ref: loadMoreRef, inView } = useInView();

  // Fetch next page when inView is true
  useEffect(() => {
    if (inView && (useAdvancedSearch ? TvData : searchData)) {
      if (useAdvancedSearch && !isLoadingMovie) {
        fetchNextPage();
      } else if (!useAdvancedSearch && !isLoadingSearch) {
        fetchNextSearchPage();
      }
    }
  }, [
    inView,
    fetchNextPage,
    fetchNextSearchPage,
    useAdvancedSearch,
    isLoadingMovie,
    isLoadingSearch,
    TvData,
    searchData,
  ]);

  return (
    <div className="p-4">
      <h1>Search Tv Shows</h1>
      <input
        type="text"
        value={query}
        onChange={handleSearchInputChange}
        placeholder="Search for movies..."
        className="p-2 border rounded-md mb-4 text-black w-full"
      />
      {/* Show Advanced Search Button */}
      <button
        onClick={handleShowAdvancedSearch}
        className="bg-gray-500 text-white p-2 rounded-md mb-4"
      >
        {showAdvancedSearch ? "Hide Advanced Search" : "Show Advanced Search"}
      </button>
      {/* Advanced Search Filters */}
      {showAdvancedSearch && (
        <>
          {/* Filters and Apply Filters button */}
          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Filters for Runtime, Rating, and Year */}
            <div>
              <label>Runtime More Than:</label>
              <input
                type="text"
                value={runtimeMoreThan}
                onChange={(e) =>
                  setRuntimeMoreThan(Number(e.target.value) || 0)
                }
                placeholder="e.g. 90"
                className="p-2 border rounded-md mb-2 text-black ml-3"
              />
            </div>
            <div>
              <label>Runtime Less Than:</label>
              <input
                type="text"
                value={runtimeLessThan}
                onChange={(e) =>
                  setRuntimeLessThan(Number(e.target.value) || 0)
                }
                placeholder="e.g. 150"
                className="p-2 border rounded-md mb-2 text-black ml-3"
              />
            </div>
            <div>
              <label>Rating More Than:</label>
              <Select
                options={generateRatingOptions()}
                value={
                  ratingMoreThan > 0 // Ensure the value is only set if greater than 0
                    ? {
                        value: ratingMoreThan,
                        label: ratingMoreThan.toString(),
                      }
                    : null
                }
                onChange={(option) =>
                  setRatingMoreThan(option ? option.value : 0)
                }
                placeholder="Select rating..."
                className="mb-2 text-black mt-2"
              />
            </div>
            <div>
              <label>Rating Less Than:</label>
              <Select
                options={generateRatingOptions()}
                value={
                  ratingLessThan > 0 // Ensure the value is only set if greater than 0
                    ? {
                        value: ratingLessThan,
                        label: ratingLessThan.toString(),
                      }
                    : null
                }
                onChange={(option) =>
                  setRatingLessThan(option ? option.value : 0)
                }
                placeholder="Select rating..."
                className="mb-2 text-black mt-2"
              />
            </div>
            <div>
              <label>Year:</label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(Number(e.target.value) || 0)}
                placeholder="e.g. 2023"
                className="p-2 border rounded-md mb-2 text-black ml-4"
              />
            </div>
            {/* Select Companies */}
            <div>
              <label>Company:</label>
              <AsyncSelect
                loadOptions={loadCompanyOptions}
                isClearable
                isMulti
                placeholder="Select company..."
                onChange={(value) => setCompanyId(value as OptionType[])}
                className="mb-2 text-black mt-2"
                noOptionsMessage={() => (
                  <a
                    href="/list-company?type=tv"
                    className="text-black hover:text-blue-700"
                  >
                    See List Of Company Here !
                  </a>
                )}
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
                className="mb-2 text-black mt-2"
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
                className="mb-2 text-black mt-2"
                noOptionsMessage={() => (
                  <a
                    href="/list-keywords?type=movie"
                    className="text-black hover:text-blue-700"
                  >
                    See List Of Keywords Here !
                  </a>
                )}
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
                placeholder="Select languages..."
                onChange={(value) => setLanguagesId(value as OptionType | null)}
                className="mb-2 text-black mt-2"
              />
            </div>
            {/* Select Countries */}
            <div>
              <label>Country:</label>
              <Select
                options={countries?.map((country) => ({
                  value: country.iso_3166_1,
                  label: country.english_name,
                }))}
                isClearable
                placeholder="Select country..." // Updated to singular
                onChange={(value) => setCountryId(value as OptionType | null)} // Allow single selection
                className="mb-2 text-black mt-2"
              />
            </div>
            <div>
              <label>Airing Company : </label>
              <Select
                options={airingCompany?.map((airing) => ({
                  value: airing.id,
                  label: airing.name,
                }))}
                isClearable
                placeholder="Select Airing Company..." // Updated to singular
                onChange={(value) =>
                  setAiringCompanyId(value as OptionTypeNum | null)
                }
                // Allow single selection
                className="mb-2 text-black mt-2"
              />
            </div>
          </div>
          <button
            onClick={handleApplyFilters}
            className="bg-blue-500 text-white p-2 rounded-md mb-4"
          >
            Apply Filters
          </button>
        </>
      )}
      {/* Movie Cards */}

      {/* Movie Cards */}
      <LayoutTemplate layout="card">
        {(isFetchingSearch || isFetchingTv) &&
          Array.from({ length: 20 }, (_, index) => (
            <SkeletonMovieCard key={`skeleton-${index}`} />
          ))}
        {(useAdvancedSearch ? TvData : searchData)?.pages.map(
          (page) =>
            page.tvShows.map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.name}
                posterPath={movie.poster_path || ""}
                overview={movie.overview || "No overview available"}
                type="tv"
              />
            ))
        )}
      </LayoutTemplate>

      {(isFetchingTvNextPage || isFetchingSearchNextPage) && (
        <div className="text-center mt-4">
          <NewDataLoading />
        </div>
      )}

      {/* Display "No more results" message only if pages contain tvShows */}
      {!hasNextSearchPage &&
        searchData?.pages.some((page) => page.tvShows.length !== 0) && (
          <div>
            <p className="text-center mt-5 text-2xl font-bold">
              No more results for {query}
            </p>
          </div>
        )}

      {!hasNextMoviePage &&
        TvData?.pages.some((page) => page.tvShows.length !== 0) && (
          <div>
            <p className="text-center mt-5 text-2xl font-bold">
              No more results
            </p>
          </div>
        )}
      {!useAdvancedSearch &&
        searchData?.pages.some((page) => page.tvShows.length === 0) && (
          <p className="text-center mt-5 text-2xl font-bold h-screen">
            No results found for {query}
          </p>
        )}
      {useAdvancedSearch &&
        TvData?.pages.some((page) => page.tvShows.length === 0) && (
          <p className="text-center mt-5 text-2xl font-bold h-screen">
            No results found
          </p>
        )}
      {/* Load More Trigger */}
      <div ref={loadMoreRef} className="h-1" />
    </div>
  );
}


export default function SearchTvPages() {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <SearchTVPage />
    </Suspense>
  );
}