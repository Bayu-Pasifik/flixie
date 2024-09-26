"use client";
import * as React from "react";
import { motion } from "framer-motion"; // Import motion for animations
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import Image from "next/image";

interface MovieListCardProps {
  id: number;
  title: string;
  overview: string;
  posterPath: string;  // Bisa kosong atau null
  type?: string;
}

const MovieListCard: React.FC<MovieListCardProps> = ({
  id,
  title,
  overview,
  posterPath,
  type,
}) => {
  const router = useRouter(); // Initialize useRouter

  const handleClick = () => {
    // Navigate to the movie detail page when the card is clicked
    router.push(`/movie/${id}`);
  };

  return (
    <motion.div
      onClick={handleClick}
      className="flex w-full bg-neutral-800 text-white shadow-lg rounded-lg overflow-hidden cursor-pointer"
      initial={{ opacity: 0, x: -50 }} // Initial state (before animation)
      animate={{ opacity: 1, x: 0 }} // Final state (after animation)
      whileHover={{ scale: 1.02, x: -5 }} // Effect when hovering over the card
      whileTap={{ scale: 0.98 }} // Effect when tapping or clicking on the card
      transition={{
        type: "spring", // Add spring-like movement
        stiffness: 400,
        damping: 50,
        duration: 0.5,
      }} // Smooth transition between states
    >
      {/* Poster Image */}
      <div className="relative w-40 h-60">
        <Image
          src={
            posterPath && posterPath !== "" // Cek apakah posterPath valid
              ? `${process.env.NEXT_PUBLIC_IMAGE_URL + posterPath}`
              : "/no_images.jpg"  // Default gambar jika tidak ada poster
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
          <CardTitle className="text-xl font-bold truncate">{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-grow">
          <p className="text-sm line-clamp-3">{overview}</p>
        </CardContent>
      </div>
    </motion.div>
  );
};

export default MovieListCard;
