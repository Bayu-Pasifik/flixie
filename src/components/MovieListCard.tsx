"use client";
import * as React from "react";
import { motion } from "framer-motion"; // Import motion for animations
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link"; // Import Link from Next.js

interface MovieListCardProps {
  id?: number;
  title: string;
  overview: string;
  posterPath: string; // Bisa kosong atau null
  type?: string;
}

const MovieListCard: React.FC<MovieListCardProps> = ({
  id,
  title,
  overview,
  posterPath,
  type,
}) => {
  // Kondisi untuk menentukan apakah card clickable atau tidak
  const isClickable = type !== "reviews"; // Jika type === "reviews", onClick tidak diaktifkan

  // Buat link tujuan berdasarkan type (movie atau tv)
  const getLinkHref = () => {
    if (type === "tv") {
      return `/tv/${id}`;
    } else {
      return `/movie/${id}`;
    }
  }

  return (
    <motion.div
      className={`flex w-full bg-neutral-800 text-white shadow-lg rounded-lg overflow-hidden ${
        isClickable ? "cursor-pointer" : "cursor-default"
      } mb-4`} // Jika tidak clickable, hilangkan cursor pointer
      initial={{ opacity: 0, x: -50 }} // Initial state (before animation)
      animate={{ opacity: 1, x: 0 }} // Final state (after animation)
      whileHover={isClickable ? { scale: 1.02, x: -5 } : {}} // Hanya aktif jika isClickable true
      whileTap={isClickable ? { scale: 0.98 } : {}} // Hanya aktif jika isClickable true
      transition={{
        type: "spring", // Add spring-like movement
        stiffness: 400,
        damping: 50,
        duration: 0.5,
      }} // Smooth transition between states
    >
      {/* Jika clickable, bungkus card dengan Link, jika tidak, tampilkan card biasa */}
      {isClickable ? (
        <Link href={getLinkHref()!} passHref className="flex w-full">
            {/* Poster Image */}
            <div className="relative w-40 h-60">
              <Image
                src={
                  posterPath && posterPath !== "" // Cek apakah posterPath valid
                    ? `${process.env.NEXT_PUBLIC_IMAGE_URL + posterPath}`
                    : "/no_images.jpg" // Default gambar jika tidak ada poster
                }
                alt={title}
                layout="fill"
                objectFit="cover"
                className="rounded-l-lg"
              />
            </div>

            {/* Movie Info */}
            <div className="flex flex-col justify-between p-4 w-full">
              <CardHeader className="p-0">
                <CardTitle className="text-xl font-bold truncate">
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-grow">
                <p className="text-sm line-clamp-3">{overview}</p>
              </CardContent>
            </div>
        </Link>
      ) : (
        <div className="flex w-full">
          {/* Poster Image */}
          <div className="relative w-40 h-60">
            <Image
              src={
                posterPath && posterPath !== "" // Cek apakah posterPath valid
                  ? `${process.env.NEXT_PUBLIC_IMAGE_URL + posterPath}`
                  : "/no_images.jpg" // Default gambar jika tidak ada poster
              }
              alt={title}
              layout="fill"
              objectFit="cover"
              className="rounded-l-lg"
            />
          </div>

          {/* Movie Info */}
          <div className="flex flex-col justify-between p-4 w-full">
            <CardHeader className="p-0">
              <CardTitle className="text-xl font-bold truncate">
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-grow">
              <p className="text-sm line-clamp-3">{overview}</p>
            </CardContent>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MovieListCard;
