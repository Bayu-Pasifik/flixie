import React from "react";
import { motion } from "framer-motion";

const NewDataLoading: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-4">
      <div className="relative w-12 h-12">
        {/* Small Circle */}
        <motion.div
          className="absolute inset-0 border-4 border-t-transparent border-blue-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />

        {/* Dots */}
        <motion.div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-2 h-2 bg-white rounded-full"
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 0.6 }}
          />
          <motion.div
            className="w-2 h-2 bg-white rounded-full ml-2"
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
          />
          <motion.div
            className="w-2 h-2 bg-white rounded-full ml-2"
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
          />
        </motion.div>

        {/* Loading Text */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          Loading...
        </motion.div>
      </div>
    </div>
  );
};

export default NewDataLoading;
