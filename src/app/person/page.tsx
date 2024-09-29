"use client";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import LoadingIndicator from "@/components/LoadingIndicator";
import NewDataLoading from "@/components/NewDataLoading"; // Animasi loading tambahan jika dibutuhkan
import { useInfinityPopularPerson } from "@/hooks/useCredits";
import MovieCard from "@/components/MovieCard";
import { Layout } from "lucide-react";
import { LayoutTemplate } from "@/components/LayoutTemplate";

export default function PersonPage() {
  const {
    data: personsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfinityPopularPerson();

  const { ref, inView } = useInView();

  // Effect to load next page when user scrolls to the bottom
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  if (isLoading) return <LoadingIndicator />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-4">
      <LayoutTemplate layout="card">
        {personsData?.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.persons.map((person) => (
              <MovieCard
                type="person"
                id={person.id}
                key={person.id}
                overview={person.known_for_department}
                title={person.name}
                posterPath={person.profile_path}
              />
            ))}
          </React.Fragment>
        ))}
      </LayoutTemplate>

      {/* Infinite Scroll Loading Trigger */}
      <div ref={ref} className="h-1" />

      {/* Show loading spinner while fetching next page */}
      {isFetchingNextPage && (
        <div className="text-center mt-4">
          <NewDataLoading />
        </div>
      )}

      {/* End message */}
      {!hasNextPage && (
        <div className="text-center text-2xl font-bold my-4">
          You've reached the end!
        </div>
      )}
    </div>
  );
}
