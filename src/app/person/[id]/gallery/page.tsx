"use client";

import { LayoutTemplate } from "@/components/LayoutTemplate";
import SkeletonMovieCard from "@/components/SkeletonMovieCard";
import { useDetailPerson, usePersonImages } from "@/hooks/usePerson";
import ZoomPicture from "@/components/ZoomPicture"; // Import ZoomPicture component
import { useParams } from "next/navigation";

export default function PersonGalleryPage() {
  const { id } = useParams();
  const personId = typeof id === "string" ? parseInt(id, 10) : 0;
  const { data: person } = useDetailPerson(personId);
  const {
    data: images,
    isLoading: imagesLoading,
    error: imagesError,
  } = usePersonImages(personId);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{person?.name} - Gallery</h1>
      <LayoutTemplate layout="card">
        {imagesLoading ? (
          Array.from({ length: 20 }).map((_, index) => (
            <SkeletonMovieCard key={`movie-skeleton-${index}`} />
          ))
        ) : imagesError ? (
          `Error: ${imagesError.message}`
        ) : (
          <ZoomPicture pictures={images!} />
        )}
      </LayoutTemplate>
    </div>
  );
}
