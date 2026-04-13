import { Volume2, VolumeX } from "lucide-react";
import { useAmbientAudio } from "@/hooks/useAmbientAudio";
import { useState, useEffect } from "react";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Tooltip } from "./ui/tooltip";

export const AmbientAudioToggle = ({ isMobile }) => {
  const { isPlaying, toggle } = useAmbientAudio();
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    // Show hint after 3 seconds
    const showTimer = setTimeout(() => {
      setShowHint(true);
    }, 3000);

    // Hide hint after 8 seconds total (3s delay + 5s visible)
    const hideTimer = setTimeout(
      () => {
        setShowHint(false);
      },
      isMobile ? 8000 : 30000,
    );

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [isMobile]);

  return (
    <TooltipProvider>
      <div
        className={`fixed top-6 right-6 z-50 flex items-center gap-2 ${
          isMobile ? "flex-col" : ""
        }`}
      >
        {isMobile && (
          <button
            onClick={() => {
              setShowHint(false);
              toggle();
            }}
            className="p-2 rounded-full bg-secondary/50 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all duration-200"
            aria-label={isPlaying ? "Mute ambient audio" : "Play ambient audio"}
            title={isPlaying ? "Mute" : "Play ambient music"}
          >
            {isPlaying ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>
        )}
        {/* Hint text */}
        <div
          className={`pointer-events-none flex items-center    transition-opacity duration-500 ${
            showHint ? "opacity-100" : "opacity-0"
          }
        ${
          isMobile
            ? "text-muted-foreground/70 text-xs [writing-mode:vertical-rl] [text-orientation:upright] leading-1"
            : "text-white text-sm gap-1.5"
        }`}
        >
          {isMobile && (
            <span
              className={`${isMobile ? "text-white/80 -rotate-90 text-lg" : "text-white"}`}
            >
              →
            </span>
          )}
          <span>ambient music</span>
          {!isMobile && (
            <span
              className={`${
                isMobile ? "text-muted-foreground/50" : "text-white"
              }`}
            >
              →
            </span>
          )}
        </div>

        {!isMobile && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => {
                  setShowHint(false);
                  toggle();
                }}
                className="p-2 rounded-full bg-secondary/50 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all duration-200"
                aria-label={
                  isPlaying ? "Mute ambient audio" : "Play ambient audio"
                }
              >
                {isPlaying ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent className="text-xs" side="bottom">
              {isPlaying ? "Mute ambient audio" : "Play ambient audio"}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
};
