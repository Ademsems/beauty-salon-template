"use client";

/**
 * components/ScrollReveal.tsx
 * ─────────────────────────────────────────────────────────────
 * Wraps any section in a fade-up reveal that fires once when
 * the element enters the viewport. Uses framer-motion useInView
 * so it works with Next.js App Router without layout shift.
 * ─────────────────────────────────────────────────────────────
 */

import { useRef, ReactNode } from "react";
import { motion, useInView } from "framer-motion";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  /** How far from viewport edge to trigger (default −80px = 80px before entering) */
  margin?: string;
  className?: string;
  /** Override the default fade-up with any framer variant */
  from?: { opacity?: number; y?: number; x?: number; scale?: number };
}

export default function ScrollReveal({
  children,
  delay = 0,
  margin = "-80px",
  className,
  from = { opacity: 0, y: 32 },
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: margin as any,
  });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={from}
      animate={isInView ? { opacity: 1, y: 0, x: 0, scale: 1 } : from}
      transition={{
        duration: 0.75,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
