import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === "development" ? "/" : process.env.VITE_BASE_PATH || "/",

  // Build optimizations
  build: {
    sourcemap: mode === "development",
    minify: mode === "production" ? 'esbuild' : false,
    cssMinify: mode === "production",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@radix-ui') || id.includes('framer-motion')) {
              return 'vendor';
            }
            if (id.includes('react')) {
              return 'react';
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // in kbs
  },

  // Dependency optimization
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
    esbuildOptions: {
      target: 'es2020',
    },
  },

  plugins: [
    react({
      jsxImportSource: '@emotion/react',
    }),

    // Visualize bundle size (development only)
    mode === 'analyze' && visualizer({
      open: true,
      filename: 'bundle-analyzer.html',
    }),

    // PWA support
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Jay Arre Talosig - Portfolio',
        short_name: 'Jay Portfolio',
        description: 'Portfolio of Jay Arre Talosig - Machine Learning Engineer & Blockchain Developer',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        icons: [
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ].filter(Boolean),

  resolve: {
    preserveSymlinks: true,
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    // @ts-ignore
    allowedHosts: true,
    hmr: {
      overlay: true,
    },
  },

  // CSS optimizations
  css: {
    devSourcemap: mode === 'development',
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },

  // Environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
}));
