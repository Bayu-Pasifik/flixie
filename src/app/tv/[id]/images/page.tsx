"use client";
import { LayoutTemplate } from "@/components/LayoutTemplate";
import SkeletonMovieCard from "@/components/SkeletonMovieCard";
import { useDetailTV } from "@/hooks/useDetailMovie";
import { useImagesTv } from "@/hooks/useImages";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import { ImageModal } from "@/components/ImageModal";

export default function ImagesTvPage() {
  const { id } = useParams();
  const TvId = typeof id === "string" ? parseInt(id, 10) : 0;
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const {
    data: images,
    isLoading: imagesLoading,
    error: imagesError,
  } = useImagesTv(TvId);
  const { data: Tv } = useDetailTV(TvId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handleImageClick = (url: string) => {
    setImageUrl(url);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (imagesError) return <div>Error: {imagesError.message}</div>;

  const renderImages = () => {
    const imageType =
      type === "backdrops"
        ? images?.backdrops
        : type === "posters"
        ? images?.posters
        : type === "logos"
        ? images?.logos
        : [];

    return imageType?.map((image) => (
      <motion.div
        key={image.file_path}
        onClick={() =>
          handleImageClick(
            `https://image.tmdb.org/t/p/original${image.file_path}`
          )
        }
        className="cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Image
          src={`https://image.tmdb.org/t/p/w500${image.file_path}`}
          width={500}
          height={500}
          alt="TV Show Image"
          className="rounded-md"
        />
      </motion.div>
    ));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 uppercase">
        <span className="text-teal-500">{type}</span> images{" "}
        <span className="text-sky-500">{Tv?.name}</span>
      </h1>
      {images?.backdrops.length === 0 &&
        images?.posters.length === 0 &&
        images?.logos.length === 0 && <p>No images found.</p>}
      <LayoutTemplate layout="card">
        {imagesLoading
          ? Array.from({ length: 20 }).map((_, index) => (
              <SkeletonMovieCard key={`movie-skeleton-${index}`} />
            ))
          : renderImages()}
      </LayoutTemplate>
      <ImageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        imageUrl={imageUrl}
      />
    </div>
  );
}
