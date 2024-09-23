import React from 'react';
import { motion } from 'framer-motion';

const LoadingIndicator = () => {
  const circleVariants = {
    initial: {
      opacity: 0.5,
      scale: 0.8,
    },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'mirror' as 'mirror', // Explicitly type the string
      },
    },
  };

  return (
    <div className="flex items-center justify-center h-screen bg-slate-800">
      <div className="flex space-x-4">
        {[...Array(3)].map((_, index) => (
          <motion.div
            key={index}
            className="w-10 h-10 bg-blue-500 rounded-full"
            variants={circleVariants}
            initial="initial"
            animate="animate"
            style={{
              // Offset each circle for visual effect
              animationDelay: `${index * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingIndicator;
