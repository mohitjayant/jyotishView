import React from "react";

interface LogoProps {
  className?: string;
  variant?: "header" | "footer";
  scrolled?: boolean;
}

export default function Logo({ className = "", variant = "header", scrolled = false }: LogoProps) {
  const isHeader = variant === "header";

  // Determine height based on scroll state for header logo
  const logoHeightClass = isHeader
    ? scrolled
      ? "h-[42px] sm:h-[48px] md:h-[52px] lg:h-[56px]"
      : "h-[52px] sm:h-[62px] md:h-[70px] lg:h-[78px]"
    : "h-[64px] sm:h-[78px] md:h-[92px] lg:h-[104px] mx-auto";

  return (
    <div className={`flex items-center justify-center select-none ${className}`}>
      <img
        src={`${import.meta.env.BASE_URL}logo.webp`}
        alt="Jyotish9 Logo"
        referrerPolicy="no-referrer"
        className={`${logoHeightClass} w-auto object-contain transition-all duration-300`}
      />
    </div>
  );
}
