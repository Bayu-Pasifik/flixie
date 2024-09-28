"use client";
import { useParams } from "next/navigation";
import { LayoutTemplate } from "@/components/LayoutTemplate";
import LoadingIndicator from "@/components/LoadingIndicator";
import MovieCard from "@/components/MovieCard";
import { motion } from "framer-motion";
import { useRecommendations } from "@/hooks/useRecomendations";

export default function RecommendationPage() {
  const { id } = useParams();
  const movieId = typeof id === "string" ? parseInt(id, 10) : 0;
  const {
    data: recommendation,
    isLoading: recommendationLoading,
    error: recommendationError,
  } = useRecommendations(movieId);

  // Handle loading states and errors
  if (recommendationLoading) return <LoadingIndicator />;
  if (recommendationError)
    return <div>Error: {recommendationError.message}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Recommedations</h1>

      <LayoutTemplate layout="card">
        {recommendation?.map((image, index) => {
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.8 }} // Awal dengan opacity 0, y 50, dan scale 0.8
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                rotate: 0, // Tambahkan efek rotasi
              }}
              exit={{
                opacity: 0,
                y: -50,
                scale: 0.8,
                rotate: 20, // Tambahkan efek rotasi keluar
              }}
              transition={{
                duration: 0.5,
                delay: index * 0.1, // Delay animasi untuk setiap gambar
                type: "spring", // Tipe animasi yang lebih halus
                stiffness: 100, // Kekakuan pegas
              }}
            >
              <MovieCard
                id={index}
                title={image.title}
                posterPath={image.poster_path}
                overview={image.overview}
                key={index}
              />
            </motion.div>
          );
        })}
      </LayoutTemplate>
    </div>
  );
}
