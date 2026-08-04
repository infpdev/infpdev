import bg1 from "@/assets/1.png";
import bg2 from "@/assets/2.png";
import bg3 from "@/assets/3.png";
import bg4 from "@/assets/4.png";
import bg5 from "@/assets/5.png";
import bg6 from "@/assets/6.png";
import bg7 from "@/assets/7.png";
import bg8 from "@/assets/8.png";
import bg9 from "@/assets/9.png";
import bg10 from "@/assets/10.png";
import mcMeow from "@/assets/11.gif";

import { useEffect, useMemo, useState } from "react";

// add new images here
const backgroundImages = [
  bg1,
  bg2,
  bg3,
  bg4,
  bg5,
  bg6,
  bg7,
  bg8,
  bg9,
  bg10,
  mcMeow,
];

// Local storage key
const STORAGE_KEY = "background_shown_history";

// Get the shown history from localStorage
const getShownHistory = (): number[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Error reading from localStorage:", error);
  }
  return [];
};

// Save the shown history to localStorage
const saveShownHistory = (history: number[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.log("Error saving to localStorage:", error);
  }
};

// Get a random background that hasn't been shown yet
const getRandomUnshownBackground = (
  shownIndices: number[],
): { image: string; index: number; reset: boolean } => {
  // Create an array of all indices
  const allIndices = Array.from(
    { length: backgroundImages.length },
    (_, i) => i,
  );

  // Filter out shown indices
  const availableIndices = allIndices.filter((i) => !shownIndices.includes(i));

  // If all have been shown, reset and start fresh
  if (availableIndices.length === 0) {
    console.log("All backgrounds have been shown. Resetting history.");

    // Get the last shown index
    const lastIndex = shownIndices[shownIndices.length - 1];

    // Create available indices excluding the last one
    const resetAvailable = allIndices.filter((i) => i !== lastIndex);

    // Pick a random index from available (excluding the last shown)
    const randomIndex =
      resetAvailable[Math.floor(Math.random() * resetAvailable.length)];

    return {
      image: backgroundImages[randomIndex],
      index: randomIndex,
      reset: true,
    };
  }

  // Pick random from available indices
  const randomIndex =
    availableIndices[Math.floor(Math.random() * availableIndices.length)];
  return {
    image: backgroundImages[randomIndex],
    index: randomIndex,
    reset: false,
  };
};

function Background({
  isMobile,
  showPage,
  backgroundReady,
  setBackgroundReady,
}: {
  isMobile: boolean;
  showPage: boolean;
  backgroundReady: boolean;
  setBackgroundReady: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [shownHistory, setShownHistory] = useState<number[]>(() =>
    getShownHistory(),
  );

  // Get the background image
  const backgroundImage = useMemo(() => {
    // Get the current shown history
    let currentHistory = getShownHistory();
    setShownHistory(currentHistory);

    // Get a new unshown background
    const result = getRandomUnshownBackground(currentHistory);

    // If reset was triggered, clear the history and start fresh
    if (result.reset) {
      currentHistory = [];
      saveShownHistory(currentHistory);
      setShownHistory(currentHistory);
    }

    // Add the chosen index to history
    const updatedHistory = [...currentHistory, result.index];
    saveShownHistory(updatedHistory);
    setShownHistory(updatedHistory);

    return result.image;
  }, []); // Empty dependency array - only runs once on mount

  // Optional: If you want to preload the next image when the current one is shown
  useEffect(() => {
    const img = new Image();

    img.onload = () => {
      setBackgroundReady(true);
    };

    img.src = backgroundImage;
  }, [backgroundImage, setBackgroundReady]);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center pointer-events-none
    transition-opacity duration-1000 p-6 md:p-8
    ${backgroundReady ? (showPage ? "opacity-30" : "opacity-50") : "opacity-0"}
  `}
    >
      <div
        className={`w-[70vh] h-[70vh] flex items-center justify-center
      ${isMobile ? "" : "-translate-y-[10vh]"}`}
      >
        <img src={backgroundImage} className="w-full h-full object-contain" />
      </div>
    </div>
  );
}

export default Background;
