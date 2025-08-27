'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { memo, type ReactNode, useMemo } from 'react'

interface StaggerContainerProps {
  children: ReactNode
  staggerDelay?: number
  className?: string
}

const StaggerContainer = memo(function StaggerContainer({
  children,
  staggerDelay = 0.1,
  className = '',
}: StaggerContainerProps) {
  const prefersReducedMotion = useReducedMotion()

  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: prefersReducedMotion ? 0 : staggerDelay,
        },
      },
    }),
    [prefersReducedMotion, staggerDelay]
  )

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  )
})

export default StaggerContainer
