"use client";
import * as React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface MovieListCardProps {
  id?: number;
  title: string;
  overview: string;
  posterPath: string;
  type?: string;
  releaseDate?: Date;
}

const MovieListCard: React.FC<MovieListCardProps> = ({
  id,
  title,
  overview,
  posterPath,
  type,
  releaseDate,
}) => {
  const isClickable = type !== "reviews";

  const getLinkHref = () => {
    if (type === "tv") {
      return `/tv/${id}`;
    } else {
      return `/movie/${id}`;
    }
  };

  // Pastikan releaseDate adalah objek Date yang valid
  const validDate =
    releaseDate instanceof Date && !isNaN(releaseDate.getTime());

  const formattedDate = validDate
    ? releaseDate!.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    : "Unknown date";

  const formattedTime = validDate
    ? releaseDate!.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Unknown time";

  return (
    <motion.div
      className={`flex w-full bg-neutral-800 text-white shadow-lg rounded-lg overflow-hidden ${
        isClickable ? "cursor-pointer" : "cursor-default"
      } mb-4`}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={isClickable ? { scale: 1.02, x: -5 } : {}}
      whileTap={isClickable ? { scale: 0.98 } : {}}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 50,
        duration: 0.5,
      }}
    >
      {isClickable ? (
        <Link href={getLinkHref()!} passHref className="flex w-full">
          <div className="relative w-40 h-60">
            <Image
              src={
                posterPath && posterPath !== ""
                  ? `${process.env.NEXT_PUBLIC_IMAGE_URL + posterPath}`
                  : "/no_images.jpg"
              }
              alt={title}
              layout="fill"
              objectFit="cover"
              className="rounded-l-lg"
            />
          </div>

          <div className="flex flex-col justify-between p-4 w-full">
            <CardHeader className="p-0">
              <CardTitle className="text-xl font-bold truncate">
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-grow">
              <p
                className={`text-sm ${
                  type === "reviews" ? "overflow-y-auto" : "line-clamp-3"
                }`}
              >
                {overview}
              </p>
            </CardContent>
          </div>
        </Link>
      ) : (
        <div className="flex w-full">
          <div className="relative w-40 h-auto">
            <Image
              src={
                posterPath && posterPath !== ""
                  ? `${process.env.NEXT_PUBLIC_IMAGE_URL + posterPath}`
                  : "/no_images.jpg"
              }
              alt={title}
              layout="fill"
              objectFit="cover"
              className="rounded-l-lg"
            />
          </div>

          <div className="flex flex-col justify-between p-4 w-full">
            <CardHeader className="p-0">
              <CardTitle className="text-xl font-bold truncate">
                {title}
              </CardTitle>
              <CardDescription className="text-md text-white">
                {formattedDate} {formattedTime}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-grow">
              <p
                className={`text-md ${
                  type === "reviews" ? "overflow-y-auto" : "line-clamp-3"
                }`}
              >
                {overview}
              </p>
            </CardContent>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MovieListCard;
