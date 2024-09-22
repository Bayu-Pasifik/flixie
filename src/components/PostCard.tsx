// src/components/PostCard.tsx
"use client"; // Pastikan komponen menggunakan client-side rendering

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useTopMovies } from "@/hooks/useTopRate";

const PostCard: React.FC = () => {
  const { data, isLoading, error } = useTopMovies();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return data?.map((movie) => (
    <Card className=" mb-4 shadow-md w-52 mx-auto" key={movie.id}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{movie.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <img
          className="object-cover"
          src={process.env.NEXT_PUBLIC_IMAGE_URL + movie.poster_path}
          alt="Movie Poster"
        />
      </CardContent>
    </Card>
  ));
};

export default PostCard;
