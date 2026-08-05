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
import EasterEggOverlay from "@/components/EasterOverlay";

const isDevDead = false;

const Index = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  const [backgroundReady, setBackgroundReady] = useState(false);
  const [currentBackground, setCurrentBackground] = useState<string | null>(
    null,
  );
  const [isEasterEgg, setIsEasterEgg] = useState(false);
  const [playEasterAudio, setPlayEasterAudio] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const [showPage, setShowPage] = useState(false);

  const handleEasterClick = () => {
    setPlayEasterAudio(true);
    setShowLoader(true);
    setTimeout(() => {
      setShowEasterEgg(false);
      showPageHandler(true);
    }, 1000);
  };

  useEffect(() => {
    if (projectsLoaded && backgroundReady) {
      if (isEasterEgg) {
        setShowEasterEgg(true);
        setShowLoader(false);
        return;
      }
      showPageHandler();
    }
  }, [projectsLoaded, backgroundReady, isEasterEgg]);

  const showPageHandler = (immediate = false) => {
    setTimeout(
      () => {
        setShowLoader(false);
        setShowPage(true);
      },
      immediate ? 0 : 1000,
    );
  };

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

      {showEasterEgg && (
        <EasterEggOverlay
          isMobile={isMobile}
          onClose={() => handleEasterClick()}
        />
      )}

      {showPage && (
        <AmbientAudioToggle
          setPlayEasterAudio={setPlayEasterAudio}
          playEasterAudio={playEasterAudio}
          isMobile={isMobile}
        />
      )}
      <Redirect />

      {/* fixed background image */}
      <Background
        isMobile={isMobile}
        showPage={showPage}
        backgroundReady={backgroundReady}
        setBackgroundReady={setBackgroundReady}
        setCurrentBackground={setCurrentBackground}
        setIsEasterEgg={setIsEasterEgg}
      />

      {/* Stars */}
      <Stars isMobile={isMobile} />

      {/* Spinner for the images */}
      <LoadingSpinner showLoader={showLoader} />

      {/* Main content container */}
      <div
        className={`flex-1 flex flex-col max-h-full items-center justify-center relative z-40 transition-opacity duration-1000
            ${showPage ? "opacity-100 " : "opacity-0 pointer-events-none"}
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
            setShowLoader={setShowLoader}
            showPage={showPage}
            setProjectsLoaded={setProjectsLoaded}
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
