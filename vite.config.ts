import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: true, },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Keep the 3D stack and the motion engine out of the entry chunk;
        // the three chunk is only reachable through the lazy FilmRing.
        // Path matching claims every react runtime file (facades and their
        // CJS implementations) plus the vite preload helper: rollup absorbs
        // modules shared between the entry and a manual chunk, which would
        // otherwise leave the entry statically importing three at boot.
        manualChunks(id) {
          const p = id.replace(/\\/g, "/")
          if (p.includes("vite/preload-helper")) return "react"
          if (p.includes("/node_modules/react/") || p.includes("/node_modules/react-dom/") || p.includes("/node_modules/scheduler/")) return "react"
          if (p.includes("/node_modules/@react-three/") || p.includes("/node_modules/three/")) return "three"
          if (p.includes("/node_modules/gsap/") || p.includes("/node_modules/@gsap/")) return "gsap"
        },
      },
    },
  },
})
