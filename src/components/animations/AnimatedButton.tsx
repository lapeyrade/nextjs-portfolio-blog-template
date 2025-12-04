"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface AnimatedButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export default function AnimatedButton({
  children,
  className = "",
  onClick,
  href,
  type = "button",
  disabled = false,
}: AnimatedButtonProps) {
  const Component = href ? motion.a : motion.button;
  const prefersReducedMotion = useReducedMotion();

  const props = href ? { href } : { type, onClick, disabled };

  return (
    <Component
      className={className}
      whileHover={disabled || prefersReducedMotion ? {} : { scale: 1.05 }}
      whileTap={disabled || prefersReducedMotion ? {} : { scale: 0.95 }}
      transition={{ duration: prefersReducedMotion ? 0.01 : 0.2 }}
      {...props}
    >
      {children}
    </Component>
  );
}
