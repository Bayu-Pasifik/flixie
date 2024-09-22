// src/components/Navbar.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-gray-800 text-white drop-shadow-sm">
      <div className="text-lg font-bold">Flixie</div>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" className="hover:bg-gray-700">
          Home
        </Button>
        <Button variant="ghost" className="hover:bg-gray-700">
          Tv Shows
        </Button>
        <Button variant="ghost" className="hover:bg-gray-700">
          People
        </Button>
        <Button variant="ghost" className="hover:bg-gray-700">
          Search
        </Button>

        {/* Dropdown Menu for Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="hover:bg-gray-700">
              Profile
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
