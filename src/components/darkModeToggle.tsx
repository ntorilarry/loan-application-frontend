"use client";

import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useDarkMode } from "../utils/useDarkMode";

const DarkModeToggle = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 focus:outline-none transition duration-200"
      aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {darkMode ? (
        <MdLightMode size={24} className="text-white" />
      ) : (
        <MdDarkMode size={24} className="text-black" />
      )}
    </button>
  );
};

export default DarkModeToggle;
