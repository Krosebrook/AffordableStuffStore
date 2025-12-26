/**
 * FlashFusion Framer Motion Configuration
 *
 * Default animation settings with cubic-bezier(0.4, 0, 0.2, 1)
 * ease-in-out timing for smooth transitions
 */

import { type Transition } from "framer-motion";

/**
 * Default easing function for FlashFusion animations
 * cubic-bezier(0.4, 0, 0.2, 1) - ease-in-out
 */
export const FLASH_FUSION_EASING = [0.4, 0, 0.2, 1] as const;

/**
 * Default transition configuration
 */
export const defaultTransition: Transition = {
  duration: 0.3,
  ease: FLASH_FUSION_EASING,
};

/**
 * Fast transition for quick interactions
 */
export const fastTransition: Transition = {
  duration: 0.15,
  ease: FLASH_FUSION_EASING,
};

/**
 * Slow transition for emphasized effects
 */
export const slowTransition: Transition = {
  duration: 0.5,
  ease: FLASH_FUSION_EASING,
};

/**
 * Spring transition with FlashFusion easing
 */
export const springTransition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

/**
 * Fade in animation variant
 */
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: defaultTransition,
};

/**
 * Slide up animation variant
 */
export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: defaultTransition,
};

/**
 * Scale animation variant
 */
export const scale = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: defaultTransition,
};

/**
 * Slide in from right animation variant
 */
export const slideInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: defaultTransition,
};

/**
 * Slide in from left animation variant
 */
export const slideInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: defaultTransition,
};

/**
 * Stagger children animation
 */
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};
