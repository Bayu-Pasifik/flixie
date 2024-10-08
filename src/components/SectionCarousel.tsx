"use client";
import Link from "next/link";
import { LayoutTemplate } from "./LayoutTemplate";
import React from "react";

interface SectionCarouselProps<T> {
  title: string;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  viewMoreLink?: string;
  type?: string;
}

export default function SectionCarousel<T>({
  title,
  items,
  renderItem,
  viewMoreLink,
  type,
}: SectionCarouselProps<T>) {
  return (
    <div className="w-full max-w-full px-4 mb-8">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        {viewMoreLink && (
          <Link
            href={{
              pathname: viewMoreLink,
              query: type ? { type } : undefined, // Include type only if it exists
            }}
            className="hover:text-blue-500 hover:underline text-2xl font-semibold mb-4"
          >
            View More
          </Link>
        )}
      </div>
      <LayoutTemplate layout="card">
        {items.map((item, index) => (
          <React.Fragment key={index}>{renderItem(item)}</React.Fragment>
        ))}
      </LayoutTemplate>
    </div>
  );
}
