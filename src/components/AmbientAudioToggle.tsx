// In AmbientAudioToggle.tsx

import { Volume2, VolumeX } from "lucide-react";
import { useAmbientAudio } from "@/hooks/useAmbientAudio";
import { useState, useEffect, useRef } from "react";
import { TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Tooltip } from "./ui/tooltip";

export default function AmbientAudioToggle({
  isMobile,
}: {
  isMobile: boolean;
}) {
  const { isPlaying, toggle, currentTrack } = useAmbientAudio();
  const [showHint, setShowHint] = useState(false);
  const isPlayingRef = useRef(isPlaying);

  // Helper to get formatted track display
  const getTrackDisplay = (track: typeof currentTrack) => {
    if (!track) return null;
    return track.artist ? `${track.name} by ${track.artist}` : track.name;
  };

  // Get display name for the button
  const getButtonLabel = () => {
    if (currentTrack) {
      const trackDisplay = getTrackDisplay(currentTrack);
      if (isPlaying) {
        return `Pause "${trackDisplay}"`;
      } else {
        return `Resume "${trackDisplay}"`;
      }
    }
    return isPlaying ? "Pause ambient audio" : "Play ambient audio";
  };

  // Get aria-label
  const getAriaLabel = () => {
    if (currentTrack) {
      const trackDisplay = getTrackDisplay(currentTrack);
      if (isPlaying) {
        return `Pause ${trackDisplay}`;
      } else {
        return `Resume ${trackDisplay}`;
      }
    }
    return isPlaying ? "Mute ambient audio" : "Play ambient audio";
  };

  // Get tooltip content
  const getTooltipContent = () => {
    if (currentTrack) {
      const trackDisplay = getTrackDisplay(currentTrack);
      if (isPlaying) {
        return `Pause "${trackDisplay}"`;
      } else {
        return `Resume "${trackDisplay}"`;
      }
    }
    return isPlaying ? "Pause ambient audio" : "Play ambient audio";
  };

  // Get hint text
  const getHintText = () => {
    if (isPlaying && currentTrack) {
      return getTrackDisplay(currentTrack);
    }
    return "my favs";
  };

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      if (!isPlayingRef.current) {
        setShowHint(true);
      }
    }, 3000);

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
    <div
      className={`fixed z-50 flex items-center gap-2 ${
        isMobile ? "flex-col top-4 right-4" : "top-6 right-6"
      }`}
    >
      {isMobile && (
        <button
          onClick={() => {
            setShowHint(false);
            toggle();
          }}
          className="p-2 rounded-full bg-secondary/50 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all duration-200"
          aria-label={getAriaLabel()}
          title={getButtonLabel()}
        >
          {isPlaying ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </button>
      )}

      {/* Hint text - updated to show track info when playing */}
      <div
        className={`pointer-events-none flex items-center transition-opacity duration-500 ${
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
        <span>
          <span>{getHintText()}</span>
        </span>
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
              aria-label={getAriaLabel()}
            >
              {isPlaying ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent className="text-xs" side="left" sideOffset={5}>
            {getTooltipContent()}
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
