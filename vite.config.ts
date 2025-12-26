import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { githubPagesSpa } from "@sctg/vite-plugin-github-pages-spa";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

import _package from "./package.json" with { type: "json" };

/**
 * Package.json type definition for React project
 *
 * Provides TypeScript typing for package.json structure with
 * common fields used in React applications
 */
export type PackageJson = {
  name: string;
  private: boolean;
  version: string;
  type: string;
  scripts: {
    dev: string;
    build: string;
    lint: string;
    preview: string;
    [key: string]: string;
  };
  dependencies: {
    react: string;
    "react-dom": string;
    "react-router-dom": string;
    [key: string]: string;
  };
  devDependencies: {
    typescript: string;
    eslint: string;
    vite: string;
    [key: string]: string;
  };
};

const packageJson: PackageJson = _package;

/**
 * Extract dependencies with a specific vendor prefix
 *
 * @param packageJson - The package.json object
 * @param vendorPrefix - Vendor namespace prefix (e.g. "@heroui")
 * @returns Array of dependency names matching the vendor prefix
 *
 * Used for chunk optimization in the build configuration
 */
export function extractPerVendorDependencies(
  packageJson: PackageJson,
  vendorPrefix: string,
): string[] {
  const dependencies = Object.keys(packageJson.dependencies || {});

  return dependencies.filter((dependency) =>
    dependency.startsWith(`${vendorPrefix}/`),
  );
}

/**
 * Vite configuration
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
  plugins: [react(), tsconfigPaths(), tailwindcss(), githubPagesSpa()],
  build: {
    // Disable source maps in production for better performance and security
    sourcemap: false,

    // Inline assets smaller than 4KB (optimized for performance)
    assetsInlineLimit: 4096,

    // Target modern browsers for smaller bundle sizes
    target: 'es2020',

    // CSS code splitting
    cssCodeSplit: true,

    // Minify options for optimal compression
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.trace'],
        passes: 2,
      },
      mangle: {
        safari10: true,
      },
      format: {
        comments: false,
      },
    },

    rollupOptions: {
      output: {
        // Customizing the output file names
        assetFileNames: `assets/${packageJson.name}-[name]-[hash][extname]`,
        entryFileNames: `js/${packageJson.name}-[hash].js`,
        chunkFileNames: `js/${packageJson.name}-[hash].js`,

        /**
         * Manual chunk configuration for better code splitting
         * Optimized to meet JS≤180KB gzip/route budget
         */
        manualChunks: (id) => {
          // Vendor chunks - more granular splitting
          if (id.includes('node_modules')) {
            // React core - separate from react-dom
            if (id.includes('react/') && !id.includes('react-dom') && !id.includes('react-router')) {
              return 'vendor-react-core';
            }
            // React DOM separately
            if (id.includes('react-dom')) {
              return 'vendor-react-dom';
            }
            // Framer Motion
            if (id.includes('framer-motion')) {
              return 'vendor-motion';
            }
            // HeroUI theme and system (smaller)
            if (id.includes('@heroui/theme') || id.includes('@heroui/system')) {
              return 'vendor-heroui-core';
            }
            // HeroUI components (can be loaded on demand)
            if (id.includes('@heroui/')) {
              return 'vendor-heroui-components';
            }
            // i18n libraries
            if (id.includes('i18next') || id.includes('react-i18next')) {
              return 'vendor-i18n';
            }
            // React Router
            if (id.includes('react-router')) {
              return 'vendor-router';
            }
            // Tailwind utilities
            if (id.includes('tailwind') || id.includes('clsx') || id.includes('class-variance-authority')) {
              return 'vendor-styles';
            }
            // Other vendor code
            return 'vendor-other';
          }
        },
      },
    },

    // Chunk size warnings
    chunkSizeWarningLimit: 180, // 180KB to match budget
  },

  // Performance optimizations
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
  },
});
