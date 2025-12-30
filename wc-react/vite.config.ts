// // import { defineConfig } from "vite";
// // import react from "@vitejs/plugin-react";
// // import { resolve } from "path";

// // export default defineConfig({
// //   plugins: [
// //     react({
// //       jsxRuntime: "classic", // ✅ خیلی مهم
// //     }),
// //   ],
// //   build: {
// //     lib: {
// //       entry: {
// //         "cti-footer": resolve(__dirname, "src/entries/cti-footer.tsx"),
// //         // "cti-footer-hover": resolve(
// //         //   __dirname,
// //         //   "src/entries/cti-footer-hover.tsx"
// //         // ),
// //         // "cti-footer-modal": resolve(
// //         //   __dirname,
// //         //   "src/entries/cti-footer-modal.tsx"
// //         // ),
// //       },
// //       name: "CTIFooter",
// //       formats: ["iife"],
// //     },
// //     outDir: "../virtual-cdn/public/wc",
// //     rollupOptions: {
// //       external: ["react", "react-dom/client"],
// //       output: {
// //         entryFileNames: "[name].js",
// //         globals: {
// //           react: "React",
// //           "react-dom/client": "ReactDOMClient",
// //         },
// //       },
// //     },
// //   },
// //   define: {
// //     "process.env.NODE_ENV": '"production"',
// //   },
// // });
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import { resolve } from "path";

// export default defineConfig({
//   plugins: [
//     react({
//       jsxRuntime: "classic", // ✅ خیلی مهم
//     }),
//   ],
//   build: {
//     lib: {
//       entry: {
//         // "cti-footer": resolve(__dirname, "src/entries/cti-footer.tsx"),
//         // "cti-footer-hover": resolve(
//         //   __dirname,
//         //   "src/entries/cti-footer-hover.tsx"
//         // ),
//         "cti-footer-modal": resolve(
//           __dirname,
//           "src/entries/cti-footer-modal.tsx"
//         ),
//       },
//       name: "CTIFooter",
//       formats: ["iife"],
//     },
//     outDir: "../virtual-cdn/public/wc",
//     rollupOptions: {
//       external: ["react", "react-dom/client"],
//       output: {
//         entryFileNames: "[name].js",
//         globals: {
//           react: "React",
//           "react-dom/client": "ReactDOMClient",
//         },
//       },
//     },
//   },
//   define: {
//     "process.env.NODE_ENV": '"production"',
//   },
// });
// wc-react/vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
    plugins: [
      react({
        // classic باعث میشه JSX به React.createElement تبدیل بشه
        // و چون react رو external کردیم، باید global React داشته باشیم.
        jsxRuntime: "classic",
      }),
    ],

    define: {
      __DEV__: JSON.stringify(isDev),
    },

    build: {
      lib: {
        entry: {
          // "cti-footer": resolve(__dirname, "src/entries/cti-footer.tsx"),
          // "cti-footer-hover": resolve(
          //   __dirname,
          //   "src/entries/cti-footer-hover.tsx"
          // ),
          // "cti-footer-modal": resolve(
          //   __dirname,
          //   "src/entries/cti-footer-modal.tsx"
          // ),
          // "cti-info-card": resolve(__dirname, "src/entries/cti-info-card.tsx"),
          "cti-dynamic-card": resolve(
            __dirname,
            "src/entries/cti-dynamic-card.tsx"
          ),
        },
        name: "CTIWebComponents",
        formats: ["iife"],
      },

      outDir: "../virtual-cdn/public/wc",
      emptyOutDir: false,

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
  };
});
