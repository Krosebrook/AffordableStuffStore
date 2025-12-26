/**
 * FlashFusion Skeleton Loader Components
 *
 * Reusable skeleton components with shimmer effects
 * for better perceived performance during loading states
 */

import React from "react";
import { motion } from "framer-motion";

import { fadeIn } from "@/config/motion";

export interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: "text" | "circular" | "rectangular" | "rounded";
  animation?: "shimmer" | "pulse" | "wave" | "none";
}

/**
 * Base Skeleton component with shimmer effect
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  width,
  height,
  variant = "rectangular",
  animation = "shimmer",
}) => {
  const variantClasses = {
    text: "skeleton-text h-4",
    circular: "skeleton-avatar rounded-full",
    rectangular: "skeleton rounded-none",
    rounded: "skeleton rounded-lg",
  };

  const animationClass = animation !== "none" ? "skeleton" : "bg-default-200";

  const style: React.CSSProperties = {
    width: width || "100%",
    height: height || (variant === "text" ? "1em" : "100%"),
  };

  return (
    <motion.div
      className={`${animationClass} ${variantClasses[variant]} ${className}`}
      style={style}
      {...fadeIn}
      aria-label="Loading..."
      role="status"
    />
  );
};

/**
 * Skeleton Text component - for single line text
 */
export const SkeletonText: React.FC<Omit<SkeletonProps, "variant">> = (
  props,
) => {
  return <Skeleton {...props} variant="text" />;
};

/**
 * Skeleton Avatar component - circular skeleton
 */
export const SkeletonAvatar: React.FC<Omit<SkeletonProps, "variant">> = ({
  width = "3rem",
  height = "3rem",
  ...props
}) => {
  return (
    <Skeleton {...props} height={height} variant="circular" width={width} />
  );
};

/**
 * Skeleton Card component - for card layouts
 */
export const SkeletonCard: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <motion.div
      className={`space-y-4 p-4 border border-default-200 rounded-lg ${className}`}
      {...fadeIn}
    >
      <div className="flex items-center space-x-4">
        <SkeletonAvatar />
        <div className="flex-1 space-y-2">
          <SkeletonText width="60%" />
          <SkeletonText width="40%" />
        </div>
      </div>
      <Skeleton height="12rem" />
      <div className="space-y-2">
        <SkeletonText />
        <SkeletonText width="80%" />
      </div>
    </motion.div>
  );
};

/**
 * Skeleton Button component
 */
export const SkeletonButton: React.FC<Omit<SkeletonProps, "variant">> = ({
  width = "8rem",
  height = "2.5rem",
  ...props
}) => {
  return (
    <Skeleton {...props} height={height} variant="rounded" width={width} />
  );
};

/**
 * Skeleton Image component
 */
export const SkeletonImage: React.FC<Omit<SkeletonProps, "variant">> = ({
  width = "100%",
  height = "12rem",
  ...props
}) => {
  return (
    <Skeleton {...props} height={height} variant="rounded" width={width} />
  );
};

/**
 * Skeleton Table Row component
 */
export const SkeletonTableRow: React.FC<{ columns?: number }> = ({
  columns = 4,
}) => {
  return (
    <motion.tr {...fadeIn}>
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="p-4">
          <SkeletonText />
        </td>
      ))}
    </motion.tr>
  );
};

/**
 * Skeleton Table component
 */
export const SkeletonTable: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 4,
}) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full">
        <tbody>
          {Array.from({ length: rows }).map((_, index) => (
            <SkeletonTableRow key={index} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * Skeleton List component
 */
export const SkeletonList: React.FC<{ items?: number }> = ({ items = 5 }) => {
  return (
    <motion.div className="space-y-3" {...fadeIn}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center space-x-3">
          <SkeletonAvatar height="2rem" width="2rem" />
          <div className="flex-1 space-y-2">
            <SkeletonText width="70%" />
            <SkeletonText width="50%" />
          </div>
        </div>
      ))}
    </motion.div>
  );
};

/**
 * Skeleton Grid component - for grid layouts
 */
export const SkeletonGrid: React.FC<{ items?: number; columns?: number }> = ({
  items = 6,
  columns = 3,
}) => {
  return (
    <motion.div
      className={`grid gap-4`}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      {...fadeIn}
    >
      {Array.from({ length: items }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </motion.div>
  );
};

/**
 * Full Page Skeleton Loader
 */
export const SkeletonPage: React.FC = () => {
  return (
    <motion.div className="container mx-auto p-6 space-y-6" {...fadeIn}>
      <div className="space-y-4">
        <Skeleton height="3rem" width="60%" />
        <Skeleton height="1.5rem" width="40%" />
      </div>
      <SkeletonGrid columns={3} items={6} />
    </motion.div>
  );
};
