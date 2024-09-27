import { motion } from "framer-motion";

interface MotionCardProps {
  imageSrc: string;
  index: number;
  onClick: () => void; // Menambahkan prop onClick
}

export const MotionCard: React.FC<MotionCardProps> = ({ imageSrc, index, onClick }) => {
  return (
    <motion.div
      onClick={onClick} // Menambahkan event onClick
      initial={{ opacity: 0, y: 50, scale: 0.8 }} // Awal dengan opacity 0, y 50, dan scale 0.8
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        rotate: 0, // Tambahkan efek rotasi
      }}
      exit={{
        opacity: 0,
        y: -50,
        scale: 0.8,
        rotate: 20, // Tambahkan efek rotasi keluar
      }}
      transition={{
        duration: 0.5,
        delay: index * 0.1, // Delay animasi untuk setiap gambar
        type: "spring", // Tipe animasi yang lebih halus
        stiffness: 100, // Kekakuan pegas
      }}
      className="w-full h-60 object-cover mb-4 rounded-lg overflow-hidden cursor-pointer" // Menambahkan cursor pointer
    >
      <img
        src={imageSrc}
        alt={`Backdrop ${index}`}
        className="w-full h-full object-cover"
      />
    </motion.div>
  );
};
