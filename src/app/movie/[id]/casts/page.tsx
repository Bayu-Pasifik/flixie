"use client";
import { useImages } from "@/hooks/useImages";
import { useParams } from "next/navigation";
import { LayoutTemplate } from "@/components/LayoutTemplate";
import LoadingIndicator from "@/components/LoadingIndicator";
import { useState } from "react";
import { useCredits } from "@/hooks/useCredits";
import MovieCard from "@/components/MovieCard";
import { motion } from "framer-motion";

export default function ImagesPage() {
  const { id } = useParams();
  const movieId = typeof id === "string" ? parseInt(id, 10) : 0;
  const {
    data: casts,
    isLoading: castsLoading,
    error: castsError,
  } = useCredits(movieId);

  // Handle loading states and errors
  if (castsLoading) return <LoadingIndicator />;
  if (castsError) return <div>Error: {castsError.message}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Casting</h1>

      <LayoutTemplate layout="card">
        {casts?.map((image, index) => {
          return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.8 }} // Awal dengan opacity 0, y 50, dan scale 0.8
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  rotate: 0, // Tambahkan efek rotasi
                }}
                exit={{
                  opacity: 0,
                  y: -50,
                  scale: 0.8,
                  rotate: 20, // Tambahkan efek rotasi keluar
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1, // Delay animasi untuk setiap gambar
                  type: "spring", // Tipe animasi yang lebih halus
                  stiffness: 100, // Kekakuan pegas
                }}
              >
                  <MovieCard
                    id={index}
                    title={image.name}
                    posterPath={image.profile_path}
                    type="person"
                    overview={image.character}
                    key={index}
                  />
              </motion.div>
          );
        })}
      </LayoutTemplate>
    </div>
  );
}
