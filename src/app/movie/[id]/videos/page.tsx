"use client";
import { useParams } from "next/navigation";
import { LayoutTemplate } from "@/components/LayoutTemplate";
import LoadingIndicator from "@/components/LoadingIndicator";
import { useVideos } from "@/hooks/useVideo";
import { motion } from "framer-motion";

export default function VideosPage() {
  const { id } = useParams();
  const movieId = typeof id === "string" ? parseInt(id, 10) : 0;

  const {
    data: videos,
    isLoading: videosLoading,
    error: videosError,
  } = useVideos(movieId);

  if (videosLoading) return <LoadingIndicator />;
  if (videosError) return <div>Error: {videosError.message}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Videos</h1>

      <LayoutTemplate layout="card">
        {videos?.map((video, index) => (
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
            <iframe
              key={index}
              src={`https://www.youtube.com/embed/${video.key}`}
              title="YouTube video"
              width="100%"
              height="auto"
              allowFullScreen
              className="rounded-md"
            />
          </motion.div>
        ))}
      </LayoutTemplate>
    </div>
  );
}
