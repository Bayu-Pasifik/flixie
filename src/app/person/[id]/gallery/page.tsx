"use client";

import { useState } from "react";
import { LayoutTemplate } from "@/components/LayoutTemplate";
import SkeletonMovieCard from "@/components/SkeletonMovieCard";
import { useDetailPerson, usePersonImages } from "@/hooks/usePerson";
import { ImageModal } from "@/components/ImageModal"; // Import ImageModal component
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

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

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
          images?.map((picture) => (
            <img
              key={picture.file_path}
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${picture.file_path}`}
              alt="Gallery"
              className="rounded-lg cursor-pointer"
              onClick={() => openImageModal(`${process.env.NEXT_PUBLIC_IMAGE_URL_ORIGINAL}${picture.file_path}`)}
            />
          ))
        )}
      </LayoutTemplate>

      {/* ImageModal */}
      <ImageModal
        isOpen={!!selectedImage}
        onClose={closeImageModal}
        imageUrl={selectedImage || ""}
      />
    </div>
  );
}
