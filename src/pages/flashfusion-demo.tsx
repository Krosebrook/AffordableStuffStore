/**
 * FlashFusion Demo Page
 * Demonstrates performance features including skeleton loaders with shimmer effects
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@heroui/button";

import {
  SkeletonCard,
  SkeletonList,
  SkeletonGrid,
  SkeletonAvatar,
  SkeletonText,
  SkeletonButton,
  SkeletonImage,
} from "@/components/skeleton";
import { fadeIn, slideUp, scale, staggerContainer } from "@/config/motion";
import DefaultLayout from "@/layouts/default";
import { title, subtitle } from "@/components/primitives";

export default function FlashFusionDemo() {
  const [showSkeleton, setShowSkeleton] = useState(true);

  return (
    <DefaultLayout>
      <motion.section
        className="flex flex-col items-center justify-center gap-8 py-8 md:py-10"
        {...fadeIn}
      >
        <div className="inline-block max-w-4xl text-center justify-center">
          <motion.h1 className={title()} {...slideUp}>
            FlashFusion Performance Standards
          </motion.h1>
          <motion.div className={subtitle({ class: "mt-4" })} {...scale}>
            Demonstrating skeleton loaders, 8pt grid spacing, fluid typography,
            and optimized animations
          </motion.div>
        </div>

        <motion.div className="flex gap-4" {...fadeIn}>
          <Button
            color={showSkeleton ? "primary" : "default"}
            onPress={() => setShowSkeleton(true)}
          >
            Show Skeletons
          </Button>
          <Button
            color={!showSkeleton ? "primary" : "default"}
            onPress={() => setShowSkeleton(false)}
          >
            Show Content
          </Button>
        </motion.div>

        <div className="w-full max-w-6xl space-y-8">
          {/* Typography Scale Demo */}
          <motion.section className="space-4" {...slideUp}>
            <h2 className="font-display text-fluid-3xl mb-4">
              Fluid Typography
            </h2>
            <div className="space-y-2">
              <p className="text-fluid-xs font-ui">
                Extra Small Text (clamp) - Inter font
              </p>
              <p className="text-fluid-sm font-ui">
                Small Text (clamp) - Inter font
              </p>
              <p className="text-fluid-base font-ui">
                Base Text (clamp) - Inter font (default)
              </p>
              <p className="text-fluid-lg font-ui">
                Large Text (clamp) - Inter font
              </p>
              <p className="text-fluid-xl font-display">
                Display XL Text (clamp) - Sora font
              </p>
              <p className="text-fluid-2xl font-display">
                Display 2XL Text (clamp) - Sora font
              </p>
            </div>
          </motion.section>

          {/* 8pt Grid Spacing Demo */}
          <motion.section className="space-6" {...slideUp}>
            <h2 className="font-display text-fluid-3xl">8pt Grid Spacing</h2>
            <div className="flex flex-wrap gap-4">
              <div className="space-2 bg-primary/10 p-4 rounded">
                space-2 (8px)
              </div>
              <div className="space-4 bg-primary/10 p-4 rounded">
                space-4 (16px)
              </div>
              <div className="space-6 bg-primary/10 p-4 rounded">
                space-6 (24px)
              </div>
              <div className="space-8 bg-primary/10 p-4 rounded">
                space-8 (32px)
              </div>
            </div>
          </motion.section>

          {/* Skeleton Components Demo */}
          <motion.section className="space-6" {...slideUp}>
            <h2 className="font-display text-fluid-3xl">Skeleton Loaders</h2>

            {/* Basic Skeletons */}
            <div className="space-y-4">
              <h3 className="font-display text-fluid-xl">Basic Components</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm mb-2">Avatar:</p>
                  {showSkeleton ? (
                    <SkeletonAvatar />
                  ) : (
                    <div className="w-12 h-12 bg-primary rounded-full" />
                  )}
                </div>
                <div>
                  <p className="text-sm mb-2">Button:</p>
                  {showSkeleton ? (
                    <SkeletonButton />
                  ) : (
                    <Button color="primary">Load More</Button>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm mb-2">Text Lines:</p>
                {showSkeleton ? (
                  <div className="space-y-2">
                    <SkeletonText />
                    <SkeletonText width="80%" />
                    <SkeletonText width="60%" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p>This is the first line of actual content.</p>
                    <p>This is the second line of actual content.</p>
                    <p>This is the third line.</p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm mb-2">Image:</p>
                {showSkeleton ? (
                  <SkeletonImage height="200px" />
                ) : (
                  <div className="w-full h-[200px] bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center text-white">
                    Image Placeholder
                  </div>
                )}
              </div>
            </div>

            {/* Complex Skeletons */}
            <div className="space-y-4 mt-8">
              <h3 className="font-display text-fluid-xl">Complex Components</h3>

              <div>
                <p className="text-sm mb-2">Card:</p>
                {showSkeleton ? (
                  <SkeletonCard />
                ) : (
                  <motion.div
                    className="border border-default-200 rounded-lg p-4 space-y-4"
                    {...fadeIn}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary rounded-full" />
                      <div>
                        <h4 className="font-semibold">John Doe</h4>
                        <p className="text-sm text-default-500">
                          Software Engineer
                        </p>
                      </div>
                    </div>
                    <div className="w-full h-48 bg-gradient-to-r from-blue-500 to-purple-500 rounded" />
                    <div>
                      <p>This is a sample card with actual content.</p>
                      <p className="text-sm text-default-500">
                        With multiple lines of text.
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              <div>
                <p className="text-sm mb-2">List:</p>
                {showSkeleton ? (
                  <SkeletonList items={3} />
                ) : (
                  <motion.div className="space-y-3" {...staggerContainer}>
                    {[1, 2, 3].map((item) => (
                      <motion.div
                        key={item}
                        className="flex items-center space-x-3"
                        {...fadeIn}
                      >
                        <div className="w-8 h-8 bg-primary rounded-full" />
                        <div>
                          <p className="font-semibold">List Item {item}</p>
                          <p className="text-sm text-default-500">
                            Description text
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>

              <div>
                <p className="text-sm mb-2">Grid (3 cards):</p>
                {showSkeleton ? (
                  <SkeletonGrid columns={3} items={3} />
                ) : (
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    {...staggerContainer}
                  >
                    {[1, 2, 3].map((item) => (
                      <motion.div
                        key={item}
                        className="border border-default-200 rounded-lg p-4 space-y-2"
                        {...scale}
                      >
                        <div className="w-full h-32 bg-gradient-to-br from-pink-500 to-orange-500 rounded" />
                        <h4 className="font-display text-lg">Product {item}</h4>
                        <p className="text-sm text-default-500">
                          Product description
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.section>

          {/* Performance Info */}
          <motion.section
            className="space-6 bg-default-100 p-6 rounded-lg"
            {...slideUp}
          >
            <h2 className="font-display text-fluid-2xl">Performance Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-ui">
              <div>
                <h3 className="font-semibold mb-2">Core Web Vitals Targets:</h3>
                <ul className="space-y-1 text-sm">
                  <li>✓ TTFB ≤ 150ms</li>
                  <li>✓ LCP ≤ 2.5s</li>
                  <li>✓ INP ≤ 200ms</li>
                  <li>✓ CLS ≤ 0.08</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Bundle Size Budgets:</h3>
                <ul className="space-y-1 text-sm">
                  <li>✓ JS ≤ 180KB gzip per route</li>
                  <li>✓ CSS ≤ 35KB gzip (actual: 31KB)</li>
                  <li>✓ Edge runtime for APIs</li>
                  <li>✓ Optimized chunking</li>
                </ul>
              </div>
            </div>
          </motion.section>
        </div>
      </motion.section>
    </DefaultLayout>
  );
}
