import React, { useEffect, useRef, useState, useCallback } from "react";
import { CATEGORY_COLORS, type ProjectCategory } from "@/lib/categoryColors";

// --- Constants ---
const TRAIL_LENGTH = 12;
const DEFAULT_COLOR = "#22d3ee"; // cyan-400
const GLOW_SIZE_REST = 12;
const GLOW_SIZE_ACTIVE = 32;
const RING_TRANSITION_MS = 250;

interface TrailPoint {
  x: number;
  y: number;
  age: number; // 0 = newest
}

const GlowCursor: React.FC = () => {
  // --- Accessibility gates ---
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouchDevice =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  const [isVisible, setIsVisible] = useState(false);

  // Refs for mutable state inside rAF
  const posRef = useRef({ x: -100, y: -100 });
  const prevPosRef = useRef({ x: -100, y: -100 });
  const velocityRef = useRef(0);
  const trailRef = useRef<TrailPoint[]>([]);
  const rafRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Category hover state
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | null>(null);
  const [targetBounds, setTargetBounds] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const activeCategoryColor = activeCategory ? CATEGORY_COLORS[activeCategory].hex : DEFAULT_COLOR;

  // --- Event listeners ---
  useEffect(() => {
    if (prefersReducedMotion || isTouchDevice) return;

    const onMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - prevPosRef.current.x;
      const dy = e.clientY - prevPosRef.current.y;
      velocityRef.current = Math.sqrt(dx * dx + dy * dy);
      prevPosRef.current = { x: posRef.current.x, y: posRef.current.y };
      posRef.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    const onCursorCategory = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setActiveCategory(detail.category as ProjectCategory);
      setTargetBounds(detail.bounds);
    };
    const onCursorCategoryReset = () => {
      setActiveCategory(null);
      setTargetBounds(null);
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);
    window.addEventListener("cursor-category", onCursorCategory);
    window.addEventListener("cursor-category-reset", onCursorCategoryReset);

    // Hide native cursor on <body>
    document.body.style.cursor = "none";

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      window.removeEventListener("cursor-category", onCursorCategory);
      window.removeEventListener("cursor-category-reset", onCursorCategoryReset);
      document.body.style.cursor = "";
    };
  }, [prefersReducedMotion, isTouchDevice, isVisible]);

  // --- Animation loop (update trail positions via DOM manipulation) ---
  useEffect(() => {
    if (prefersReducedMotion || isTouchDevice) return;

    const loop = () => {
      const trail = trailRef.current;
      const pos = posRef.current;

      // Unshift new position to front
      trail.unshift({ x: pos.x, y: pos.y, age: 0 });
      // Trim to max length
      while (trail.length > TRAIL_LENGTH) trail.pop();
      // Age each point
      for (let i = 0; i < trail.length; i++) trail[i].age = i;

      // Update DOM directly for performance
      const container = containerRef.current;
      if (container) {
        const children = container.children;

        // Core glow (first child)
        const core = children[0] as HTMLElement;
        if (core) {
          const vel = Math.min(velocityRef.current / 25, 1);
          const size = GLOW_SIZE_REST + vel * 6;
          core.style.transform = `translate(${pos.x - size / 2}px, ${pos.y - size / 2}px)`;
          core.style.width = `${size}px`;
          core.style.height = `${size}px`;
          core.style.opacity = isVisible ? "1" : "0";
        }

        // Outer glow (second child)
        const outer = children[1] as HTMLElement;
        if (outer) {
          outer.style.transform = `translate(${pos.x - 48}px, ${pos.y - 48}px)`;
          outer.style.opacity = isVisible ? "0.6" : "0";
        }

        // Trail dots (children 2+)
        for (let i = 0; i < TRAIL_LENGTH; i++) {
          const dot = children[i + 2] as HTMLElement;
          if (!dot) break;
          const point = trail[i];
          if (point) {
            const progress = i / TRAIL_LENGTH;
            const dotSize = Math.max(2, (1 - progress) * 6);
            const opacity = Math.max(0, (1 - progress) * 0.6);
            dot.style.transform = `translate(${point.x - dotSize / 2}px, ${point.y - dotSize / 2}px)`;
            dot.style.width = `${dotSize}px`;
            dot.style.height = `${dotSize}px`;
            dot.style.opacity = `${isVisible ? opacity : 0}`;
          } else {
            dot.style.opacity = "0";
          }
        }

        // Targeting ring (last child)
        const ring = children[TRAIL_LENGTH + 2] as HTMLElement;
        if (ring) {
          if (activeCategory && targetBounds) {
            const pad = 8;
            ring.style.transform = `translate(${targetBounds.x - pad}px, ${targetBounds.y - pad}px)`;
            ring.style.width = `${targetBounds.width + pad * 2}px`;
            ring.style.height = `${targetBounds.height + pad * 2}px`;
            ring.style.opacity = "1";
            ring.style.borderColor = activeCategoryColor;
          } else {
            ring.style.opacity = "0";
          }
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [prefersReducedMotion, isTouchDevice, isVisible, activeCategory, targetBounds, activeCategoryColor]);

  // Don't render anything for reduced motion or touch
  if (prefersReducedMotion || isTouchDevice) return null;

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-[100]"
      aria-hidden="true"
    >
      {/* Core glow dot */}
      <div
        className="absolute top-0 left-0 rounded-full will-change-transform"
        style={{
          width: GLOW_SIZE_REST,
          height: GLOW_SIZE_REST,
          background: `radial-gradient(circle, ${activeCategoryColor} 0%, transparent 70%)`,
          boxShadow: `0 0 12px 4px ${activeCategoryColor}80`,
          mixBlendMode: "screen",
          transition: `background ${RING_TRANSITION_MS}ms, box-shadow ${RING_TRANSITION_MS}ms`,
        }}
      />
      {/* Outer soft glow */}
      <div
        className="absolute top-0 left-0 rounded-full blur-xl will-change-transform"
        style={{
          width: 96,
          height: 96,
          background: `radial-gradient(circle, ${activeCategoryColor}30 0%, transparent 70%)`,
          mixBlendMode: "screen",
          transition: `background ${RING_TRANSITION_MS}ms`,
        }}
      />
      {/* Trail dots */}
      {Array.from({ length: TRAIL_LENGTH }).map((_, i) => (
        <div
          key={`trail-${i}`}
          className="absolute top-0 left-0 rounded-full will-change-transform"
          style={{
            background: activeCategoryColor,
            mixBlendMode: "screen",
            opacity: 0,
            transition: `background ${RING_TRANSITION_MS}ms`,
          }}
        />
      ))}
      {/* Targeting ring */}
      <div
        className="absolute top-0 left-0 rounded-xl border-2 will-change-transform"
        style={{
          borderColor: "transparent",
          opacity: 0,
          transition: `opacity ${RING_TRANSITION_MS}ms, border-color ${RING_TRANSITION_MS}ms, transform 150ms ease-out, width 150ms ease-out, height 150ms ease-out`,
          boxShadow: activeCategory ? `0 0 20px 2px ${activeCategoryColor}40` : "none",
        }}
      />
    </div>
  );
};

export default GlowCursor;
