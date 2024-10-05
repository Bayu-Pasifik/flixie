
"use client";
import React from "react";
import { motion } from "framer-motion"; 
import Image from "next/image";

const PersonDetailPage = () => {
  const person = {
    "adult": false,
    "also_known_as": [
      "스칼릿 조핸슨",
      "Σκάρλετ Τζοχάνσον",
      "Scarlett Ingrid Johansson",
      "اسکارلت جوهانسن",
      "สการ์เลตต์ อิงกริด โจแฮนส์สัน"
    ],
    "biography": "Scarlett Ingrid Johansson (born November 22, 1984) is an American actress. The world's highest-paid actress in 2018 and 2019, she has featured multiple times on the Forbes Celebrity 100 list. Her films have grossed over $14.3 billion worldwide, making Johansson the ninth-highest-grossing box office star of all time. She has received various accolades, including a Tony Award and a British Academy Film Award, in addition to nominations for two Academy Awards and five Golden Globe Awards.",
    "birthday": "1984-11-22",
    "gender": 1,
    "id": 1245,
    "known_for_department": "Acting",
    "name": "Scarlett Johansson",
    "place_of_birth": "New York City, New York, USA",
    "popularity": 100.199,
    "profile_path": "/6NsMbJXRlDZuDzatN2akFdGuTvx.jpg"
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Container utama */}
      <motion.div
        className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Gambar profil */}
        <motion.div
          className="flex-shrink-0 rounded-lg overflow-hidden"
          whileHover={{ scale: 1.05 }}
        >
          <Image
            src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
            alt={person.name}
            width={300}
            height={450}
            className="rounded-lg shadow-lg"
          />
        </motion.div>

        {/* Informasi utama */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold mb-4">
            {person.name}
          </h1>
          <p className="text-lg mb-2">
            <strong>Known for:</strong> {person.known_for_department}
          </p>
          <p className="text-lg mb-2">
            <strong>Birthday:</strong> {new Date(person.birthday).toLocaleDateString()}
          </p>
          <p className="text-lg mb-2">
            <strong>Place of Birth:</strong> {person.place_of_birth}
          </p>

          {/* Alias (also known as) */}
          <motion.div
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <h3 className="text-2xl font-semibold mb-2">Also Known As:</h3>
            <ul className="list-disc pl-4">
              {person.also_known_as.map((alias, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 10, color: "#FFD700" }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="text-lg"
                >
                  {alias}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Biografi */}
      <motion.div
        className="mt-12 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold mb-4">Biography</h2>
        <p className="text-lg leading-7">
          {person.biography}
        </p>
      </motion.div>
    </div>
  );
};

export default PersonDetailPage;
