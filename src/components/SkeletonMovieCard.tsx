"use client";
import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface SkeletonMovieCardProps {
  size?: "default" | "large";
}

const SkeletonMovieCard: React.FC<SkeletonMovieCardProps> = ({ size = "default" }) => {
  // Tentukan ukuran berdasarkan ukuran yang diberikan
  const widthClass = size === "large" ? "w-full h-[100vh]" : "md:w-64 lg:w-72 2xl:w-72";
  const heightClass = size === "large" ? "h-full" : "h-60";

  return (
    <div className={`${widthClass} bg-neutral-800 text-white shadow-lg rounded-lg overflow-hidden cursor-pointer animate-pulse`}>
      {/* Skeleton untuk gambar */}
      <div className={`relative w-full ${heightClass} bg-neutral-700`} />

      {/* Skeleton untuk judul */}
      <CardHeader className="px-4 py-2">
        <CardTitle>
          <div className="w-3/4 h-6 bg-neutral-700 rounded-md mb-2"></div>
        </CardTitle>
      </CardHeader>

      {/* Skeleton untuk overview (hanya muncul jika ukuran default) */}
      {size === "default" && (
        <CardContent className="px-4 py-2 space-y-2">
          <div className="w-full h-4 bg-neutral-700 rounded-md"></div>
          <div className="w-5/6 h-4 bg-neutral-700 rounded-md"></div>
          <div className="w-2/3 h-4 bg-neutral-700 rounded-md"></div>
        </CardContent>
      )}
    </div>
  );
};

export default SkeletonMovieCard;
