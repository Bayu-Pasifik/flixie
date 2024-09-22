// src/app/HomePage.tsx
import HomeCarousel from "@/components/Carousel";
import PostCard from "@/components/PostCard";

export default function HomePage() {
  return (
    <div className="bg-slate-800 min-h-screen">
      <HomeCarousel />
      {/* <PostCard /> */}
    </div>
  );
}
