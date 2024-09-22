'use client';
import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface MovieCardProps {
  title: string;
  overview: string;
  posterPath: string;
  rating: number;
}

const MovieCard: React.FC<MovieCardProps> = ({ title, overview, posterPath, rating }) => {
  return (
    <Card className="md:w-80 h-full lg:w-96 bg-neutral-800 text-white shadow-lg rounded-lg overflow-hidden">
      <div className="relative w-full h-60">
        <img
          src={process.env.NEXT_PUBLIC_IMAGE_URL + posterPath}
          alt={title}
        //   fill
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

