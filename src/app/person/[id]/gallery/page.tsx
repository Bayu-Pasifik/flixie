"use client";

import { LayoutTemplate } from "@/components/LayoutTemplate";
import MovieListCard from "@/components/MovieListCard";
import SkeletonMovieCard from "@/components/SkeletonMovieCard";
import { useDetailPerson, usePersonImages } from "@/hooks/usePerson";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function PersonGalleryPage() {
  const { id } = useParams();
  const personId = typeof id === "string" ? parseInt(id, 10) : 0;
  const { data: person } = useDetailPerson(personId);
  const { data: images, isLoading: imagesLoading, error: imagesError } = usePersonImages(personId);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        {person?.name} - Gallery
      </h1>
      <LayoutTemplate layout="card">
        {imagesLoading
          ? Array.from({ length: 20 }).map((_, index) => (
              <SkeletonMovieCard key={`movie-skeleton-${index}`} />
            ))
          : imagesError
          ? `Error: ${imagesError.message}`
          : images?.map((image, index) => (
              <Image
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL_ORIGINAL}${image.file_path}`}
                alt={image.file_path}
                width={300}
                height={300}
                key={index}
                loading="lazy"
                className="rounded-lg"
              />
            ))}
        </LayoutTemplate>
    </div>
  );
}
