import { useState, useEffect } from "react";
import {
  AmbientAudioToggle,
  Ded,
  Redirect,
  About,
  Background,
  Stars,
  Projects,
  Socials,
  LoadingSpinner,
} from "@/components";

const isDevDead = false;

const Index = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(
        window.matchMedia("(pointer: coarse)").matches ||
          window.matchMedia("(max-width: 960px)").matches,
      );

      // MacBook Air-ish screens and other small laptops
      setIsCompact(window.innerHeight <= 900);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div
      className={`min-h-screen bg-background text-foreground flex flex-col relative select-none transition-opacity duration-1000`}
    >
      {isDevDead && <Ded />}

      {imagesLoaded && <AmbientAudioToggle isMobile={isMobile} />}
      <Redirect />

      {/* fixed background image */}
      <Background isMobile={isMobile} imagesLoaded={imagesLoaded} />

      {/* Stars */}
      <Stars isMobile={isMobile} />

      {/* Spinner for the images */}
      <LoadingSpinner showLoader={showLoader} />

      {/* Main content container */}
      <div
        className={`flex-1 flex flex-col max-h-full items-center justify-center relative z-40 transition-opacity duration-1000
            ${imagesLoaded ? "opacity-100 " : "opacity-0 pointer-events-none"}
            ${isMobile ? "p-4" : ""}`}
      >
        <div
          className={`w-full ${isMobile ? "" : isCompact ? "max-w-[85dvw]" : "max-w-[75dvw]"}`}
        >
          {/* About Section */}
          <About isMobile={isMobile} isCompact={isCompact} />

          {/* Projects, below the grid */}
          <Projects
            isCompact={isCompact}
            imagesLoaded={imagesLoaded}
            setShowLoader={setShowLoader}
            setImagesLoaded={setImagesLoaded}
            isMobile={isMobile}
          />

          {/* Reach out - below both columns */}
          <Socials isMobile={isMobile} isCompact={isCompact} />
        </div>
      </div>
    </div>
  );
};

export default Index;
