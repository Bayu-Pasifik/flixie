"use client";
import { useImages } from "@/hooks/useImages";
import { useParams } from "next/navigation";
import { LayoutTemplate } from "@/components/LayoutTemplate";
import LoadingIndicator from "@/components/LoadingIndicator";
import { useState } from "react";
import { ImageModal } from "@/components/ImageModal";
import { MotionCard } from "@/components/MotionCard";

export default function ImagesPage() {
  const { id } = useParams();
  const movieId = typeof id === "string" ? parseInt(id, 10) : 0;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (imagePath: string) => {
    setSelectedImage(
      `${process.env.NEXT_PUBLIC_IMAGE_URL_ORIGINAL}${imagePath}`
    );
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const {
    data: images,
    isLoading: imagesLoading,
    error: imagesError,
  } = useImages(movieId);

  if (imagesLoading) return <LoadingIndicator />;
  if (imagesError) return <div>Error: {imagesError.message}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Backdrops Images</h1>

      <LayoutTemplate layout="card">
        {images?.backdrops.map((image, index) => (
          <MotionCard
            key={image.file_path}
            imageSrc={process.env.NEXT_PUBLIC_IMAGE_URL + image.file_path}
            index={index}
            onClick={() => handleImageClick(image.file_path)} // Menambahkan onClick ke MotionCard
          />
        ))}
      </LayoutTemplate>

      {/* Image Modal */}
      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          onClose={handleCloseModal}
          isOpen={!!selectedImage}
        />
      )}
    </div>
  );
}
