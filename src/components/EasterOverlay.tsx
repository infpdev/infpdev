// EasterOverlay.tsx
import { useCallback, useEffect, useState, useRef } from "react";

interface EasterEggOverlayProps {
  onClose: () => void;
}

interface ClickText {
  id: number;
  x: number;
  y: number;
  angle: number;
  size: number;
  opacity: number;
  fadeOut: boolean;
  born: number;
  duration: number;
  glowInterval: number; // Random glow interval for each text
}

const EasterEggOverlay = ({
  isMobile,
  onClose,
}: EasterEggOverlayProps & { isMobile: boolean }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [clickTexts, setClickTexts] = useState<ClickText[]>([]);
  const [maxClickTexts, setMaxClickTexts] = useState(isMobile ? 25 : 50);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idCounterRef = useRef(0);

  useEffect(() => {
    setMaxClickTexts(isMobile ? 25 : 50);
  }, [isMobile]);

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 10);
  }, []);

  // Randomly add "click" texts
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setClickTexts((prev) => {
        if (prev.length >= maxClickTexts) return prev;

        const newClick: ClickText = {
          id: idCounterRef.current++,
          x: Math.random() * 100,
          y: Math.random() * 100,
          angle: Math.random() * 180 - 90,
          size: 12 + Math.random() * 24,
          opacity: 0.3 + Math.random() * 0.5,
          fadeOut: false,
          born: Date.now(),
          duration: 2000 + Math.random() * 2000,
          glowInterval: 500 + Math.random() * 1500,
        };

        return [...prev, newClick];
      });
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [maxClickTexts]);

  // Fade out clicks after their random duration
  useEffect(() => {
    const fadeInterval = setInterval(() => {
      setClickTexts((prev) => {
        const now = Date.now();
        return prev.map((text) => {
          if (now - text.born > text.duration && !text.fadeOut) {
            return { ...text, fadeOut: true };
          }
          return text;
        });
      });
    }, 500);

    return () => clearInterval(fadeInterval);
  }, []);

  // Remove faded out clicks after they finish fading
  useEffect(() => {
    const removeInterval = setInterval(() => {
      setClickTexts((prev) => {
        const now = Date.now();
        return prev.filter((text) => {
          if (text.fadeOut && now - text.born > text.duration + 500) {
            return false;
          }
          return true;
        });
      });
    }, 2000);

    return () => clearInterval(removeInterval);
  }, []);

  // Update opacity for each text at its own random interval
  useEffect(() => {
    const glowInterval = setInterval(() => {
      setClickTexts((prev) => {
        const now = Date.now();
        return prev.map((text) => {
          if (!text.fadeOut) {
            // Check if it's time for this specific text to glow
            const timeSinceBorn = now - text.born;
            if (timeSinceBorn % text.glowInterval < 100) {
              const newOpacity = 0.2 + Math.random() * 0.6;
              return { ...text, opacity: newOpacity };
            }
          }
          return text;
        });
      });
    }, 100);

    return () => clearInterval(glowInterval);
  }, []);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    onClose();
  }, [onClose]);

  // Close on any click
  useEffect(() => {
    const handleClick = () => handleClose();
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [handleClose]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      {/* "click" texts scattered around - snap in, fade out */}
      {clickTexts.map((text) => (
        <div
          key={text.id}
          className="absolute pointer-events-none text-muted-foreground/50 font-mono select-none"
          style={{
            fontFamily: "DM Mono, monospace",
            left: `${text.x}%`,
            top: `${text.y}%`,
            transform: `rotate(${text.angle}deg)`,
            fontSize: `${text.size}px`,
            opacity: text.fadeOut ? 0 : text.opacity,
            transition: text.fadeOut
              ? `opacity ${500 + Math.random() * 1500}ms ease-out`
              : "none",
          }}
        >
          click
        </div>
      ))}

      <div
        className={`h-auto gap-10 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-500
          ${isMobile ? "w-[80vw] py-10 px-5 bg-background/70" : "w-fit bg-background/10 backdrop-blur-md p-10"}`}
        style={{
          fontFamily: "DM Mono, monospace",
          transform: isVisible ? "scale(1)" : "scale(0.95)",
          opacity: isVisible ? 1 : 0,
          translate: !isMobile ? "0 -20%" : undefined,
        }}
        onClick={handleClose}
      >
        <div className="text-center flex flex-col px-6 gap-5 max-w-xl">
          <h1 className="text-2xl md:text-3xl font-medium text-foreground">
            you've discovered the monthly salary meow
          </h1>

          <p className="text-muted-foreground/70">click to pay meow meow</p>
        </div>
      </div>
    </div>
  );
};

export default EasterEggOverlay;
