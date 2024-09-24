// src/components/Navbar.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-gray-800 text-white drop-shadow-sm">
      <div className="text-lg font-bold">
        <Link href={"/"}>Flixie</Link>
      </div>
      <div className="flex items-center space-x-4">
        <Link href="/">
          <Button variant="ghost" className="hover:bg-gray-700">
            Home
          </Button>
        </Link>
        <Link href="/tv">
          <Button variant="ghost" className="hover:bg-gray-700">
            Tv Shows
          </Button>
        </Link>
        <Link href={"/people"}>
          <Button variant="ghost" className="hover:bg-gray-700">
            People
          </Button>
        </Link>
        <Link href={"/search"}>
          <Button variant="ghost" className="hover:bg-gray-700">
            Search
          </Button>
        </Link>

        {/* Dropdown Menu for Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="hover:bg-gray-700">
              About Us
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
