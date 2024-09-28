"use client";
import { LayoutTemplate } from "@/components/LayoutTemplate";
import LoadingIndicator from "@/components/LoadingIndicator";
import MovieListCard from "@/components/MovieListCard";
import { useReviews } from "@/hooks/useReviews";
import { useParams } from "next/navigation";

export default function ReviewsPage() {
  const { id } = useParams();
  const movieId = typeof id === "string" ? parseInt(id, 10) : 0;
  const { data: reviews, isLoading, error } = useReviews(movieId);

  if (isLoading) return <LoadingIndicator />;
  if (error) return <div>Error: {error.message}</div>;

  if (!reviews) return <div>No reviews found</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Reviews</h1>
      <LayoutTemplate layout="list">
        {reviews?.map((review, index) => (
          <div key={index}>
            <MovieListCard
              title={review.author}
              overview={review.content}
              posterPath={review.author_details.avatar_path || ""}
              type="reviews"
            />
          </div>
        ))}
      </LayoutTemplate>
    </div>
  );
}
