// src/components/PostCard.tsx
"use client"; // Pastikan komponen menggunakan client-side rendering

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Post } from "../types/apiTypes";
import { usePosts } from "@/hooks/usePost";



const PostCard: React.FC = () => {
  const { data, isLoading, error } = usePosts();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return data?.map((post) => (
    <Card className=" mb-4 shadow-md w-1/2 mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{post.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{post.body}</p>
      </CardContent>
    </Card>
  ));
};

export default PostCard;
