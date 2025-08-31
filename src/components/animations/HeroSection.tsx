"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface HeroSectionProps {
	children: ReactNode;
	className?: string;
}

// Optimized hero animation that doesn't delay LCP
export default function HeroSection({
	children,
	className = "",
}: HeroSectionProps) {
	const prefersReducedMotion = useReducedMotion();

	// For LCP optimization, content is visible immediately
	// Animation only adds subtle enhancement without affecting initial paint
	const variants = {
		hidden: prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 10 },
		visible: { opacity: 1, y: 0 },
	};

	return (
		<motion.div
			className={className}
			initial="hidden"
			animate="visible"
			variants={variants}
			transition={{
				duration: prefersReducedMotion ? 0.01 : 0.3,
				ease: [0.6, -0.05, 0.01, 0.99],
			}}
		>
			{children}
		</motion.div>
	);
}
