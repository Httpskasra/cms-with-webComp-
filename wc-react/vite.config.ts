import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "classic", // ✅ خیلی مهم
    }),
  ],
  build: {
    lib: {
      entry: {
        "cti-footer-modal": resolve(
          __dirname,
          "src/entries/cti-footer-modal.tsx"
        ),
        // "cti-footer-hover": resolve(
        //   __dirname,
        //   "src/entries/cti-footer-hover.tsx"
        // ),
      },
      name: "CTIFooter",
      formats: ["iife"],
    },
    outDir: "../virtual-cdn/public/wc",
    rollupOptions: {
      external: ["react", "react-dom/client"],
      output: {
        entryFileNames: "[name].js",
        globals: {
          react: "React",
          "react-dom/client": "ReactDOMClient",
        },
      },
    },
  },
  define: {
    "process.env.NODE_ENV": '"production"',
  },
});
