import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const GlowCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  // If user prefers reduced motion or is on mobile, hide the custom cursor
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  
  if (prefersReducedMotion || isTouchDevice) return null;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[100] h-8 w-8 rounded-full border border-cyan-400 mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          opacity: isVisible ? 1 : 0,
        }}
      />
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[99] h-32 w-32 -mt-12 -ml-12 rounded-full bg-cyan-500/10 blur-xl mix-blend-screen"
        style={{
          x: cursorX,
          y: cursorY,
          opacity: isVisible ? 0.8 : 0,
        }}
      />
    </>
  );
};

export default GlowCursor;
