import { useMemo } from "react";

function Stars({ isMobile }: { isMobile: boolean }) {
  const stars = useMemo(
    () =>
      Array.from({ length: isMobile ? 80 : 200 }, (_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: Math.random() * 2 + 1,
      })),
    [isMobile],
  );
  return (
    <div className="fixed inset-0 z-20 pointer-events-none">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars.map((star) => (
          <span
            key={star.id}
            className="star"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default Stars;
