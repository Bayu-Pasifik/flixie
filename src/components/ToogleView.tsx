import React from "react";
import { FaThLarge, FaList } from "react-icons/fa"; // Icons for Card and List views
import { motion } from "framer-motion";

// Icons for view modes
const viewIcons: { [key: string]: JSX.Element } = {
  card: <FaThLarge />,
  list: <FaList />,
};

const viewModes = ["card", "list"];

interface ViewToggleProps {
  selectedView: string;
  onViewChange: (view: string) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({
  selectedView,
  onViewChange,
}) => {
  const selectedIndex = viewModes.indexOf(selectedView);

  return (
    <div className="relative w-auto h-20 bg-slate-600 rounded-lg flex items-center p-1">
      {/* Toggle animation slider */}
      <motion.div
        className="absolute w-16 h-16 bg-blue-600 rounded-lg"
        layout
        initial={{ x: 0 }}
        animate={{ x: selectedIndex * 64 }} // Adjust slider position based on selected view
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
      />

      {/* Toggle buttons for Card and List views */}
      {viewModes.map((viewMode) => (
        <div
          key={viewMode}
          className="cursor-pointer flex justify-center items-center w-16 h-16 z-10"
          onClick={() => onViewChange(viewMode)}
        >
          {/* View icons */}
          <div className="text-3xl text-white">{viewIcons[viewMode]}</div>
        </div>
      ))}
    </div>
  );
};

export default ViewToggle;
