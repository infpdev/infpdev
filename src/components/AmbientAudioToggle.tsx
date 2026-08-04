import {
  Volume2,
  VolumeX,
  SkipForward,
  Shuffle,
  Pause,
  Play,
} from "lucide-react";
import { useAmbientAudio } from "@/hooks/useAmbientAudio";
import { useState, useEffect, useRef, useCallback } from "react";
import { TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Tooltip } from "./ui/tooltip";
import { titleCase } from "title-case";

export default function AmbientAudioToggle({
  isMobile,
}: {
  isMobile: boolean;
}) {
  const {
    isPlaying,
    toggle,
    currentTrack,
    skipToNext,
    swapTrack,
    hasInteracted,
  } = useAmbientAudio();
  const [showHint, setShowHint] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [menuOffset, setMenuOffset] = useState(0);
  const isPlayingRef = useRef(isPlaying);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideMenuTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper to get formatted track display
  const getTrackDisplay = (track: typeof currentTrack) => {
    if (!track) return null;
    return titleCase(
      track.artist ? `${track.name} by ${track.artist}` : track.name,
    );
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

  // Calculate menu offset to stay within viewport
  const calculateMenuOffset = () => {
    if (!buttonRef.current || !menuRef.current) return 0;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const menuRect = menuRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    const menuTop =
      buttonRect.top + buttonRect.height / 2 - menuRect.height / 2;
    const menuBottom = menuTop + menuRect.height;

    let offset = 0;

    if (menuTop < 0) {
      offset = -menuTop;
    } else if (menuBottom > viewportHeight) {
      offset = viewportHeight - menuBottom;
    }

    return offset;
  };

  // Close menu when clicking outside
  const handleClickOutside = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (isMobile && showMenu) {
        const target = event.target as Node;
        if (containerRef.current && !containerRef.current.contains(target)) {
          setShowMenu(false);
          // setMenuOffset(0);
          setIsLongPressing(false);
        }
      }
    },
    [isMobile, showMenu],
  );

  // Update menu offset when it opens or window resizes
  useEffect(() => {
    if (showMenu) {
      requestAnimationFrame(() => {
        const offset = calculateMenuOffset();
        setMenuOffset(offset);
      });
    }
  }, [showMenu, currentTrack]);

  // Recalculate on resize
  useEffect(() => {
    const handleResize = () => {
      if (showMenu) {
        const offset = calculateMenuOffset();
        setMenuOffset(offset);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [showMenu]);

  // Handle click outside for mobile
  useEffect(() => {
    if (isMobile) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("touchstart", handleClickOutside);
      };
    }
  }, [isMobile, handleClickOutside]);

  const handleMouseEnter = () => {
    if (!isMobile && hasInteracted) {
      if (hideMenuTimerRef.current) {
        clearTimeout(hideMenuTimerRef.current);
        hideMenuTimerRef.current = null;
      }
      setShowMenu(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      hideMenuTimerRef.current = setTimeout(() => {
        setShowMenu(false);
      }, 300);
    }
  };

  // Handle long press for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isMobile && hasInteracted) {
      // Only trigger long press if not already showing menu
      if (!showMenu) {
        longPressTimerRef.current = setTimeout(() => {
          setIsLongPressing(true);
          setShowMenu(true);
          if (navigator.vibrate) {
            navigator.vibrate(50);
          }
        }, 500);
      }
    }
  };

  const handleTouchEnd = () => {
    if (isMobile) {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
      setIsLongPressing(false);
    }
  };

  const handleTouchMove = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    setIsLongPressing(false);
  };

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
      if (hideMenuTimerRef.current) {
        clearTimeout(hideMenuTimerRef.current);
      }
    };
  }, []);

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

  const shouldShowPlayTooltip = !hasInteracted;

  useEffect(() => {
    if (shouldShowPlayTooltip) setShowMenu(true);
  }, [shouldShowPlayTooltip]);

  return (
    <div
      ref={containerRef}
      className={`fixed z-50 flex items-center gap-2 ${
        isMobile ? "flex-col top-4 right-4" : "top-6 right-6"
      }`}
    >
      {isMobile && (
        <div className="relative" ref={buttonRef}>
          <button
            onClick={() => {
              // If menu is open and user clicks the button, close menu instead of toggling
              if (showMenu) {
                setShowMenu(false);
                // setMenuOffset(0);
                setIsLongPressing(false);
                return;
              }
              if (!isLongPressing) {
                setShowHint(false);
                toggle();
              }
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
            onContextMenu={(e) => e.preventDefault()}
            className="no-underline p-2 rounded-full bg-secondary/50 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all duration-200"
            aria-label={getAriaLabel()}
            title={getButtonLabel()}
          >
            {isPlaying ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Menu - appears on long press for mobile */}
          {isMobile && showMenu && hasInteracted && (
            <div
              ref={menuRef}
              className={`absolute right-full mr-2 top-1/2 bg-secondary/50 backdrop-blur-sm border border-border/50 rounded-lg shadow-lg overflow-hidden transition-transform duration-200`}
              style={{
                transform: `translateY(calc(-50% + ${menuOffset + 16}px))`,
              }}
            >
              {/* Buttons at top */}
              <div className="flex items-center border-b border-primary/30 justify-around p-1.5 gap-0.5">
                {/* Play/Pause button */}
                <button
                  onClick={() => {
                    toggle();
                    // setShowMenu(false);
                  }}
                  className="p-2 rounded-md text-foreground hover:bg-primary/10 transition-colors"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </button>

                {/* Swap button */}
                <button
                  onClick={() => {
                    swapTrack();
                    // setShowMenu(false);
                  }}
                  className="p-2 rounded-md text-foreground hover:bg-primary/10 transition-colors"
                  aria-label="Swap track"
                >
                  <Shuffle className="w-4 h-4" />
                </button>

                {/* Next button */}
                <button
                  onClick={() => {
                    skipToNext();
                    // setShowMenu(false);
                  }}
                  className="p-2 rounded-md text-foreground hover:bg-primary/10 transition-colors"
                  aria-label="Next track"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Track info at bottom */}
              {currentTrack && (
                <div className="px-3 py-1.5 text-center min-w-[120px]">
                  <div className="text-sm font-medium text-foreground truncate max-w-[100px]">
                    {titleCase(currentTrack.name)}
                  </div>
                  {currentTrack.artist && (
                    <div className="text-xs text-muted-foreground truncate max-w-[100px]">
                      {titleCase(currentTrack.artist)}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Hint text */}
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
          <span>my favs</span>
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
        <div
          className="relative"
          ref={buttonRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Show tooltip only before first interaction */}
          {shouldShowPlayTooltip ? (
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
              <TooltipContent className="text-xs" side="bottom" sideOffset={5}>
                Play ambient music
              </TooltipContent>
            </Tooltip>
          ) : (
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
          )}

          {/* Menu - appears on hover for desktop */}
          {!isMobile && showMenu && hasInteracted && (
            <div
              ref={menuRef}
              className={`absolute right-full mr-2 top-1/2 backdrop-blur-[2px] bg-secondary/30 border border-border/50 rounded-lg shadow-lg overflow-hidden transition-transform duration-200`}
              style={{
                transform: `translateY(calc(-50% + ${menuOffset + 24}px))`,
              }}
            >
              {/* Buttons at top */}
              <div className="flex items-center border-b border-primary/30 justify-around p-1.5 gap-0.5">
                {/* Play/Pause button */}
                <button
                  onClick={() => {
                    toggle();
                    // setShowMenu(false);
                  }}
                  className="p-2 rounded-md text-foreground hover:bg-primary/10 transition-colors"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </button>

                {/* Swap button */}
                <button
                  onClick={() => {
                    swapTrack();
                    // setShowMenu(false);
                  }}
                  className="p-2 rounded-md text-foreground hover:bg-primary/10 transition-colors"
                  aria-label="Swap track"
                >
                  <Shuffle className="w-4 h-4" />
                </button>

                {/* Next button */}
                <button
                  onClick={() => {
                    skipToNext();
                    // setShowMenu(false);
                  }}
                  className="p-2 rounded-md text-foreground hover:bg-primary/10 transition-colors"
                  aria-label="Next track"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>
              {/* Track info at bottom */}
              {currentTrack && (
                <div className="px-3 py-1.5 text-center min-w-[120px]">
                  <div className="text-sm font-medium text-foreground truncate max-w-[100px]">
                    {titleCase(currentTrack.name)}
                  </div>
                  {currentTrack.artist && (
                    <div className="text-xs text-muted-foreground truncate max-w-[100px]">
                      {titleCase(currentTrack.artist)}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
