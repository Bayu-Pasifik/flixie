"use client";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface SectionCarouselProps<T> {
  title: string;
  items: T[];
  renderItem: (item: T) => JSX.Element;
  viewMoreLink?: string; 
  type? : string
}

export default function SectionCarousel<T>({
  title,
  items,
  renderItem,
  viewMoreLink,
  type
}: SectionCarouselProps<T>) {
  return (
    <div className="w-full max-w-full px-4 mb-8">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <Link
          href={`${viewMoreLink}`}
          className="hover:text-blue-500 hover:underline text-2xl font-semibold mb-4"
        >
          View More
        </Link>
      </div>
      <Carousel opts={{ align: "start" }} className="w-full">
        <CarouselContent className="flex space-x-4">
          {items.map((item, index) => (
            <CarouselItem
              key={index}
              className= {type === "cast" ? "basis-1/2 md:basis-1/3 lg:basis-1/5 2xl:basis-1/6" :"basis-full md:basis-1/2 lg:basis-1/3 2xl:basis-1/4"}
            >
              {renderItem(item)}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-600 text-white p-2 rounded-full hover:bg-gray-500" />
        <CarouselNext className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-600 text-white p-2 rounded-full hover:bg-gray-500" />
      </Carousel>
    </div>
  );
}
