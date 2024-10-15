"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "./ui/input";
import { useSimpleSearchMovie, useSimpleSearchTv } from "@/hooks/useSearch";

// Define menu variants for animation
const menuVariants = {
  open: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
  closed: {
    opacity: 0,
    x: "-100%",
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("/");
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const { data: movies, isLoading: movieLoading } =
    useSimpleSearchMovie(debouncedQuery);
  const { data: tvShows, isLoading: tvLoading } =
    useSimpleSearchTv(debouncedQuery);

  // Debounce logic for search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 700); // Adjust debounce delay as needed

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  return (
    <nav className="relative w-full bg-gray-800 text-white drop-shadow-sm z-50">
      {/* Top Bar */}
      <div className="flex justify-between md:justify-start items-center px-8 py-4">
        {/* Logo */}
        <div className="text-lg font-bold uppercase mr-8">
          <Link href={"/"}>Flixie</Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4 mr-auto">
          <Link href="/" passHref>
            <Button
              variant="ghost"
              className={`hover:bg-gray-700 ${
                activeMenu === "/" ? "bg-gray-700" : ""
              }`}
              onClick={() => setActiveMenu("/")}
            >
              Home
            </Button>
          </Link>
          <Link href="/tv" passHref>
            <Button
              variant="ghost"
              className={`hover:bg-gray-700 ${
                activeMenu === "/tv" ? "bg-gray-700" : ""
              }`}
              onClick={() => setActiveMenu("/tv")}
            >
              TV Series
            </Button>
          </Link>
          <Link href="/person" passHref>
            <Button
              variant="ghost"
              className={`hover:bg-gray-700 ${
                activeMenu === "/person" ? "bg-gray-700" : ""
              }`}
              onClick={() => setActiveMenu("/person")}
            >
              Peoples
            </Button>
          </Link>
          <Link href="/company" passHref>
            <Button
              variant="ghost"
              className={`hover:bg-gray-700 ${
                activeMenu === "/company" ? "bg-gray-700" : ""
              }`}
              onClick={() => setActiveMenu("/company")}
            >
              Companies
            </Button>
          </Link>
        </div>

        {/* Search Button */}
        <Button
          variant="ghost"
          onClick={() => setShowSearchBar(!showSearchBar)}
          className="hover:bg-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m2.83-5.65a8 8 0 11-16 0 8 8 0 0116 0z"
            />
          </svg>
        </Button>

        {/* Search Bar */}
        {showSearchBar && (
          <div className="absolute right-0 top-full w-full md:w-[40rem] p-4 bg-gray-900 z-40">
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full mb-4"
            />

            <div className="flex flex-col space-y-6">
              <div>
                <h3 className="text-white mb-2">Movies</h3>
                {movies?.slice(0, 3).map((movie) => (
                  <Link
                    href={`/movie/${movie.id}`}
                    key={movie.id}
                    className="flex items-center mb-2"
                  >
                    <img
                      src={
                        process.env.NEXT_PUBLIC_IMAGE_URL! + movie.poster_path
                      }
                      alt={movie.title}
                      className="w-12 h-12 object-cover mr-4"
                    />
                    <p className="text-gray-300 hover:text-white">
                      {movie.title}
                    </p>
                  </Link>
                ))}
                {movies?.length != 0 && (
                  <Link href={`/search/movie?query=${searchQuery}`} passHref>
                    <Button variant="outline" className="text-sm mt-2">
                      View more movies
                    </Button>
                  </Link>
                )}
              </div>

              <div>
                <h3 className="text-white mb-2">TV Shows</h3>
                {tvShows?.slice(0, 3).map((tvShow) => (
                  <Link
                    href={`/tv/${tvShow.id}`}
                    key={tvShow.id}
                    className="flex items-center mb-2"
                  >
                    <img
                      src={
                        process.env.NEXT_PUBLIC_IMAGE_URL! + tvShow.poster_path
                      }
                      alt={tvShow.name}
                      className="w-12 h-12 object-cover mr-4"
                    />
                    <p className="text-gray-300 hover:text-white">
                      {tvShow.name}
                    </p>
                  </Link>
                ))}
                {tvShows?.length != 0 && (
                  <Link href={`/search/tv?query=${searchQuery}`} passHref>
                    <Button variant="outline" className="text-sm mt-2">
                      View more TV shows
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Hamburger Icon for Mobile */}
        <div className="md:hidden flex items-center">
          <Button
            variant="ghost"
            onClick={() => setIsOpen(!isOpen)}
            className="hover:bg-gray-700"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          ></div>
          <motion.div
            className="fixed top-0 left-0 w-full h-screen bg-gray-800 z-50 p-6"
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            variants={menuVariants}
          >
            {/* Menu Links */}
          </motion.div>
        </>
      )}
    </nav>
  );
}
