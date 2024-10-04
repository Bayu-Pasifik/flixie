"use client";
import * as React from "react";
import { motion } from "framer-motion"; // Import motion for animations
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image"; // Import for optimized images in Next.js
import Link from "next/link"; // Import Next.js Link for navigation

// Define the types for the props
interface MovieCardProps {
  id: number; // Add movie ID to props
  title: string;
  overview: string;
  posterPath: string;
  type?: string; // Optional type for custom styles (e.g., "carousel")
}

const MovieCard: React.FC<MovieCardProps> = ({
  id,
  title,
  overview,
  posterPath,
  type,
}) => {
  // Determine the destination URL based on the type of content
  const getLinkHref = () => {
    if (type === "tv") {
      return `/tv/${id}`;
    } else if (type === "person") {
      return `/person/${id}`;
    } else if (type === "company") {
      return `/company/${id}`;
    } else {
      return `/movie/${id}`;
    }
  };

  return (
    <Link href={getLinkHref()} passHref>
      <motion.div
        className={`md:w-64 h-full lg:w-72 "2xl:w-72"
        bg-neutral-800 text-white shadow-lg rounded-lg overflow-hidden cursor-pointer`}
        initial={{ opacity: 0, y: 50 }} // Initial state (before animation)
        animate={{ opacity: 1, y: 0 }} // Final state (after animation)
        whileHover={{ scale: 1.05, y: -10 }} // Effect when hovering over the card
        whileTap={{ scale: 0.95 }} // Effect when tapping or clicking on the card
        transition={{
          type: "spring", // Add spring-like movement
          stiffness: 500,
          damping: 100,
          duration: 0.5,
        }} // Smooth transition between states
      >
        {/* Image section */}
        <div className="relative w-full h-60">
          <Image
            src={
              posterPath === ""
                ? "/no_images.jpg"
                : `${process.env.NEXT_PUBLIC_IMAGE_URL}${posterPath}`
            }
            alt={title}
            layout="fill"
            objectFit="cover" // Next.js optimized image
            className="object-cover w-full h-full"
          />
        </div>

        {/* Title section */}
        <CardHeader className="px-4 py-2">
          <CardTitle className="text-xl font-bold truncate">{title}</CardTitle>
        </CardHeader>

        {/* Overview section */}
        <CardContent className="px-4 py-2">
          <p className="text-sm line-clamp-3">{overview}</p>
        </CardContent>
      </motion.div>
    </Link>
  );
};

export default MovieCard;
