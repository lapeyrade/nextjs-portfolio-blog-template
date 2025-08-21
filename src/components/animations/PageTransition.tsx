'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ReactNode } from 'react'

interface PageTransitionProps {
    children: ReactNode
    className?: string
}

const pageVariants = {
    initial: {
        opacity: 1, // Changed from 0 to 1 for better LCP
        y: 0, // Changed from 20 to 0
    },
    in: {
        opacity: 1,
        y: 0,
    },
    out: {
        opacity: 0,
        y: -20,
    },
}

const defaultPageTransition = { duration: 0.5 }

export default function PageTransition({ children, className = '' }: PageTransitionProps) {
    const prefersReducedMotion = useReducedMotion()
    const pageTransition = prefersReducedMotion ? { duration: 0.01 } : defaultPageTransition

    return (
        <motion.div
            className={className}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
        >
            {children}
        </motion.div>
    )
}
