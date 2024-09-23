import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

export const ImageModal = ({ isOpen, onClose, imageUrl }: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Disable scrolling when modal is open
    } else {
      document.body.style.overflow = "auto"; // Enable scrolling when modal is closed
    }
  }, [isOpen]);
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 cursor-zoom-out"
          onClick={onClose} // Close the modal when the background is clicked
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.img
            src={imageUrl}
            alt="Zoomed"
            className="rounded-md"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.5 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            style={{ maxWidth: '100%', maxHeight: '100vh' }} // Maintain aspect ratio and fit within the viewport
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
