// Import all background images - add more with bg-X.png naming
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
import { useEffect, useMemo } from "react";

// Array of all background images - add new imports here
const backgroundImages = [bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8, bg9, bg10];

// Pick a random background image
const getRandomBackground = () => {
  const index = Math.floor(Math.random() * backgroundImages.length);
  return backgroundImages[index];
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
  const backgroundImage = useMemo(() => getRandomBackground(), []);

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
