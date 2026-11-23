import type { NextConfig } from "next";

// STATIC_EXPORT=1 : copie statique du site (dossier out-export), utilisée pour l'aperçu.
const staticExport = process.env.STATIC_EXPORT === "1"

const nextConfig: NextConfig = {
  ...(staticExport ? { output: "export" as const, distDir: ".next-export", images: { unoptimized: true } } : {}),
  // Le rendu partiel n'existe pas en export statique : désactivé pour l'aperçu seulement.
  cacheComponents: !staticExport,
  partialPrefetching: !staticExport,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
