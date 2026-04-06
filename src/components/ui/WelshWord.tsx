"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { useI18n } from "@/lib/i18n/context";
import { useLearnWelsh } from "@/lib/i18n/learn-welsh";

interface WelshWordProps {
  children: ReactNode;
  en: string;
}

export function WelshWord({ children, en }: WelshWordProps) {
  const { locale } = useI18n();
  const { enabled } = useLearnWelsh();
  const [show, setShow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setIsMobile("ontouchstart" in window);
  }, []);

  // Only show tooltips in Welsh mode with learn feature on
  if (locale !== "cy" || !enabled) {
    return <>{children}</>;
  }

  function handleTap() {
    if (isMobile) {
      setShow((prev) => !prev);
    }
  }

  // Dismiss on outside tap (mobile)
  useEffect(() => {
    if (!show || !isMobile) return;
    function handleOutside(e: Event) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShow(false);
      }
    }
    document.addEventListener("touchstart", handleOutside);
    return () => document.removeEventListener("touchstart", handleOutside);
  }, [show, isMobile]);

  return (
    <span
      ref={ref}
      className="relative inline-block"
      onMouseEnter={() => !isMobile && setShow(true)}
      onMouseLeave={() => !isMobile && setShow(false)}
      onClick={handleTap}
    >
      <span className="border-b border-dotted border-accent/40 cursor-help">
        {children}
      </span>

      {/* Tooltip */}
      <span
        className={`absolute left-1/2 top-full z-50 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent px-2.5 py-1 font-body text-xs font-semibold text-dusk shadow-card transition-all duration-200 ${
          show
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-1 pointer-events-none"
        }`}
        role="tooltip"
      >
        <span className="mr-1 text-[10px] opacity-60">CY→EN</span>
        {en}
        {/* Arrow */}
        <span className="absolute -top-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-accent" />
      </span>
    </span>
  );
}
