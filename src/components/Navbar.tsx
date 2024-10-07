"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // For Hamburger and Close icons
import { motion } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("/"); // State untuk menyimpan menu aktif

  // Lock scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = ""; // Reset scrolling
    }
  }, [isOpen]);

  // Framer Motion Variants for the Mobile Menu
  const menuVariants = {
    open: {
      opacity: 1,
      x: 0,
      display: "block",
      transition: { duration: 0.5, ease: "easeOut" },
    },
    closed: {
      opacity: 0,
      x: "-100%",
      transition: { duration: 0.5, ease: "easeIn" },
      transitionEnd: { display: "none" }, // Hide the element after animation is complete
    },
  };

  return (
    <nav className="relative w-full bg-gray-800 text-white drop-shadow-sm z-50">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-8 py-4">
        <div className="text-lg font-bold uppercase">
          <Link href={"/"}>Flixie</Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/" passHref>
            <Button
              variant="ghost"
              className={`hover:bg-gray-700 ${
                activeMenu === "/" ? "bg-gray-700" : ""
              }`} // Active background
              onClick={() => setActiveMenu("/")} // Update active menu
            >
              Home
            </Button>
          </Link>
          <Link href="/tv" passHref>
            <Button
              variant="ghost"
              className={`hover:bg-gray-700 ${
                activeMenu === "/tv" ? "bg-gray-700" : ""
              }`} // Active background
              onClick={() => setActiveMenu("/tv")} // Update active menu
            >
              TV Series
            </Button>
          </Link>
          <Link href="/person" passHref>
            <Button
              variant="ghost"
              className={`hover:bg-gray-700 ${
                activeMenu === "/person" ? "bg-gray-700" : ""
              }`} // Active background
              onClick={() => setActiveMenu("/person")} // Update active menu
            >
              Peoples
            </Button>
          </Link>
          <Link href="/company" passHref>
            <Button
              variant="ghost"
              className={`hover:bg-gray-700 ${
                activeMenu === "/company" ? "bg-gray-700" : ""
              }`} // Active background
              onClick={() => setActiveMenu("/company")} // Update active menu
            >
              Companies
            </Button>
          </Link>
        </div>

        {/* Icons on the right */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/search">
            <Button
              variant="ghost"
              className={`hover:bg-gray-700 ${
                activeMenu === "/search" ? "bg-white" : ""
              }`}
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
          </Link>
          {/* Dropdown Menu for Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="hover:bg-gray-700">
                <img
                  src="/no_images.jpg"
                  alt="Profile"
                  className="rounded-full w-8 h-8"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

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
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)} // Close menu when clicked on the overlay
          ></div>

          <motion.div
            className="fixed top-0 left-0 w-full h-screen bg-gray-800 z-50 p-6"
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            variants={menuVariants}
            transition={{ duration: 0.5 }}
          >
            {/* Close Button */}
            <div className="flex justify-end mb-6">
              <Button
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="hover:bg-gray-700"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="flex flex-col items-start space-y-4">
              <Link href="/" passHref>
                <Button
                  variant="ghost"
                  className={`text-xl hover:bg-gray-700 ${
                    activeMenu === "/" ? "bg-gray-700" : ""
                  }`} // Active background
                  onClick={() => {
                    setActiveMenu("/");
                    setIsOpen(false); // Close menu when clicked
                  }}
                >
                  Home
                </Button>
              </Link>
              <Link href="/tv" passHref>
                <Button
                  variant="ghost"
                  className={`text-xl hover:bg-gray-700 ${
                    activeMenu === "/tv" ? "bg-gray-700" : ""
                  }`} // Active background
                  onClick={() => {
                    setActiveMenu("/tv");
                    setIsOpen(false); // Close menu when clicked
                  }}
                >
                  TV Series
                </Button>
              </Link>
              <Link href="/person" passHref>
                <Button
                  variant="ghost"
                  className={`text-xl hover:bg-gray-700 ${
                    activeMenu === "/person" ? "bg-gray-700" : ""
                  }`} // Active background
                  onClick={() => {
                    setActiveMenu("/person");
                    setIsOpen(false); // Close menu when clicked
                  }}
                >
                  Peoples
                </Button>
              </Link>
              <Link href="/company" passHref>
                <Button
                  variant="ghost"
                  className={`text-xl hover:bg-gray-700 ${
                    activeMenu === "/company" ? "bg-gray-700" : ""
                  }`} // Active background
                  onClick={() => {
                    setActiveMenu("/company");
                    setIsOpen(false); // Close menu when clicked
                  }}
                >
                  Companies
                </Button>
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </nav>
  );
}
