import React from "react";
import Image from "next/image";
import Link from "next/link";

interface MiniCardProps {
  imagePath: string;
  name: string;
  altText?: string;
  to: string;
}

const MiniCard: React.FC<MiniCardProps> = ({
  imagePath,
  name,
  altText = "",
  to,
}) => {
  return (
    <Link href={to} passHref>
      <div className="relative w-28 h-20 bg-blue-400 shadow-lg rounded-lg overflow-hidden group">
        {/* Gambar */}
        <Image
          src={imagePath}
          alt={altText}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 ease-in-out group-hover:scale-105"
        />
        {/* Nama yang muncul saat hover */}
        <div className="absolute inset-0 bg-black bg-opacity-60 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
          <span className="text-white text-sm font-bold">{name}</span>
        </div>
      </div>
    </Link>
  );
};

export default MiniCard;
