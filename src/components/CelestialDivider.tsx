import React from "react";

interface StarParticle {
  id: number;
  left: string;
  top: string;
  size: string;
  opacity: number;
  delay: string;
}

// Fixed coordinates to prevent any React hydration mismatches on client render
const CELESTIAL_STARS: StarParticle[] = [
  { id: 1, left: "5%", top: "35%", size: "1.2px", opacity: 0.5, delay: "0s" },
  { id: 2, left: "12%", top: "65%", size: "1.8px", opacity: 0.7, delay: "1.5s" },
  { id: 3, left: "18%", top: "25%", size: "1px", opacity: 0.4, delay: "0.8s" },
  { id: 4, left: "28%", top: "72%", size: "1.5px", opacity: 0.6, delay: "2.1s" },
  { id: 5, left: "40%", top: "30%", size: "1px", opacity: 0.3, delay: "1s" },
  { id: 6, left: "55%", top: "68%", size: "1.5px", opacity: 0.8, delay: "0.4s" },
  { id: 7, left: "68%", top: "28%", size: "1.2px", opacity: 0.5, delay: "1.8s" },
  { id: 8, left: "78%", top: "78%", size: "1px", opacity: 0.4, delay: "2.5s" },
  { id: 9, left: "86%", top: "42%", size: "1.6px", opacity: 0.7, delay: "0.2s" },
  { id: 10, left: "94%", top: "60%", size: "1.1px", opacity: 0.5, delay: "1.2s" },
];

export default function CelestialDivider() {
  return (
    <div className="relative w-full overflow-hidden select-none pointer-events-none py-8 my-1 flex items-center">
      {/* 
        The atmospheric background band faithfully matching the user's reference image:
        - Rich olive-amber/Vedic gold glow on the far left (about 30%)
        - Drops off quickly into complete dark, deep container background in the center and right
        - The right side has zero vertical glow width, making it extremely thin ("black out")
      */}
      <div 
        className="absolute inset-0 h-full w-full opacity-60 mix-blend-screen" 
        style={{
          background: "linear-gradient(to right, rgba(122, 107, 36, 0.45) 0%, rgba(90, 78, 25, 0.3) 15%, rgba(10, 13, 28, 0) 40%, rgba(10, 13, 28, 0) 100%)"
        }}
      />
      
      {/* Tall radial light only on the far left, matching the left side of the image */}
      <div className="absolute left-[5%] top-1/2 -translate-y-1/2 w-[300px] h-[70px] bg-[#847333]/15 blur-[35px] rounded-full" />

      {/* Scattered twinkling celestial star dust particles precisely as shown in the reference */}
      <div className="absolute inset-0 w-full h-full">
        {CELESTIAL_STARS.map((star) => (
          <div
            key={star.id}
            className="absolute bg-white rounded-full transition-opacity duration-1000 animate-pulse"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
              boxShadow: star.opacity > 0.65 ? "0 0 5px rgba(255, 255, 255, 0.8)" : "none",
              animationDelay: star.delay,
              animationDuration: star.id % 2 === 0 ? "3.2s" : "4.8s",
            }}
          />
        ))}
      </div>

      {/* 
        The continuous level gold line of the instrument / divider 
        - Perfectly level and extremely fine (1px or 0.5px)
        - Highlighted in a vibrant premium Celestial Gold color scheme
        - Fades slowly to transparent near the boundaries, maintaining an ultra-sleek look
      */}
      <div className="relative w-full flex items-center justify-center">
        <div 
          className="w-full h-[0.5px] sm:h-[1px]" 
          style={{
            background: "linear-gradient(to right, rgba(218, 185, 96, 0.15) 0%, rgba(218, 185, 96, 0.4) 15%, rgba(229, 192, 96, 0.65) 35%, rgba(229, 192, 96, 0.4) 60%, rgba(218, 185, 96, 0.15) 85%, rgba(218, 185, 96, 0.02) 100%)",
            boxShadow: "0 0 3px rgba(229, 192, 96, 0.1)"
          }}
        />
      </div>
    </div>
  );
}
