"use client";
import * as React from "react";
import { motion } from "framer-motion"; // Import motion for animations
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import Image from "next/image";

interface MovieCardProps {
  id: number; // Add movie ID to props
  title: string;
  overview: string;
  posterPath: string;
  type?: string;
}

const MovieCard: React.FC<MovieCardProps> = ({
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
      className="md:w-80 h-full lg:w-96 bg-neutral-800 text-white shadow-lg rounded-lg overflow-hidden cursor-pointer"
      initial={{ opacity: 0, y: 50 }} // Initial state (before animation)
      animate={{ opacity: 1, y: 0 }} // Final state (after animation)
      whileHover={{ scale: 1.05, y: -10 }} // Effect when hovering over the card
      whileTap={{ scale: 0.95 }} // Effect when tapping or clicking on the card
      transition={{
        type: "Spring", // Add spring-like movement
        stiffness: 500,
        damping: 100,
        duration: 0.5,
      }} // Smooth transition between states
    >
      <div className="relative w-full h-60">
        <img
          src={process.env.NEXT_PUBLIC_IMAGE_URL + posterPath}
          alt={title}
          className="object-cover w-full h-full"
        />
      </div>
      <CardHeader className="px-4 py-2">
        <CardTitle className="text-xl font-bold truncate">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-2">
        <p className="text-sm line-clamp-3">{overview}</p>
      </CardContent>
    </motion.div>
  );
};

export default MovieCard;
