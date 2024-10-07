import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Images } from '@/types/imageType';

interface ZoomPictureProps {
  pictures: Images[];
}

const ZoomPicture: React.FC<ZoomPictureProps> = ({ pictures }) => {
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const handleImageClick = (large_image_url: string) => {
    setZoomedImage(large_image_url);
  };

  const handleOverlayClick = () => {
    setZoomedImage(null);
  };

  return (
    <>
      {pictures.map((picture, index) => (
        <motion.div
          key={index}
          onClick={() => handleImageClick(process.env.NEXT_PUBLIC_IMAGE_URL_ORIGINAL + picture.file_path)}
          className="cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <img
            src={process.env.NEXT_PUBLIC_IMAGE_URL + picture.file_path}
            alt={`Picture ${index + 1}`}
            className="rounded-md object-cover w-full h-full"
          />
        </motion.div>
      ))}

      {/* Zoomed image overlay */}
      <AnimatePresence>
        {zoomedImage && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 cursor-zoom-out"
            onClick={handleOverlayClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.img
              src={zoomedImage}
              alt="Zoomed"
              className="rounded-md max-w-3xl max-h-[100vh]"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ZoomPicture;
