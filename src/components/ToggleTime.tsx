import React from "react";
import { motion } from "framer-motion";

const timeModes = ["day", "week"];

interface TimeToggleProps {
  selectedView: string;
  onViewChange: (view: string) => void;
}

const TimeToggle: React.FC<TimeToggleProps> = ({
  selectedView,
  onViewChange,
}) => {
  const selectedIndex = timeModes.indexOf(selectedView);

  return (
    <div className="relative w-auto h-20 bg-slate-600 rounded-lg flex items-center p-1">
      {/* Toggle animation slider */}
      <motion.div
        className="absolute w-48 h-16 bg-blue-600 rounded-lg"
        layout
        initial={{ x: 0 }}
        animate={{ x: selectedIndex * 190 }} // Adjust slider position based on selected view
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
      />

      {/* Toggle buttons for Day and Week views */}
      {timeModes.map((viewMode) => (
        <div
          key={viewMode}
          className="cursor-pointer flex justify-center items-center w-48 h-16 z-10"
          onClick={() => onViewChange(viewMode)}
        >
          <div className="text-3xl text-white">
            {viewMode === "day" ? "Daily" : "Weekly"}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimeToggle;
