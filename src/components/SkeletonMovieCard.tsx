"use client";
import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const SkeletonMovieCard: React.FC = () => {
  return (
    <div
      className={`md:w-64 h-full lg:w-72 "2xl:w-72"
      bg-neutral-800 text-white shadow-lg rounded-lg overflow-hidden cursor-pointer animate-pulse`}
    >
      {/* Skeleton for Image section */}
      <div className="relative w-full h-60 bg-neutral-700" />

      {/* Skeleton for Title section */}
      <CardHeader className="px-4 py-2">
        <CardTitle>
          <div className="w-3/4 h-6 bg-neutral-700 rounded-md mb-2"></div>
        </CardTitle>
      </CardHeader>

      {/* Skeleton for Overview section */}
      <CardContent className="px-4 py-2 space-y-2">
        <div className="w-full h-4 bg-neutral-700 rounded-md"></div>
        <div className="w-5/6 h-4 bg-neutral-700 rounded-md"></div>
        <div className="w-2/3 h-4 bg-neutral-700 rounded-md"></div>
      </CardContent>
    </div>
  );
};

export default SkeletonMovieCard;
