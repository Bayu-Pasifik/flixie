"use client";
import * as React from "react";
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
    <Card
      onClick={handleClick}
      className="md:w-80 h-full lg:w-96 bg-neutral-800 text-white shadow-lg rounded-lg overflow-hidden cursor-pointer"
    >
      <div className="relative w-full h-60">
        <Image
          src={process.env.NEXT_PUBLIC_IMAGE_URL + posterPath}
          alt={title}
          fill
          loading="lazy"
          className="object-cover w-full h-full"
        />
      </div>
      <CardHeader className="px-4 py-2">
        <CardTitle className="text-xl font-bold truncate">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-2">
        <p className="text-sm line-clamp-3">{overview}</p>
      </CardContent>
    </Card>
  );
};

export default MovieCard;
