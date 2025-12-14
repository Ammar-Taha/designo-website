import { defineConfig } from "vite";
import { resolve } from "path";
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper function to copy directory recursively
function copyDir(src, dest) {
  if (!existsSync(dest)) {
    mkdirSync(dest, { recursive: true });
  }

  const entries = readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = resolve(src, entry.name);
    const destPath = resolve(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

// Plugin to copy component files to dist
function copyComponentsPlugin() {
  return {
    name: "copy-components",
    closeBundle() {
      const componentsDir = resolve(__dirname, "src/components");
      const distComponentsDir = resolve(__dirname, "dist/src/components");

      // Ensure dist/components directory exists
      if (!existsSync(distComponentsDir)) {
        mkdirSync(distComponentsDir, { recursive: true });
      }

      // Copy component files
      const componentFiles = ["header.html", "footer.html", "contact.html"];
      componentFiles.forEach((file) => {
        const src = resolve(componentsDir, file);
        const dest = resolve(distComponentsDir, file);
        if (existsSync(src)) {
          copyFileSync(src, dest);
          console.log(`✓ Copied ${file} to dist/src/components/`);
        } else {
          console.warn(`⚠ Component file not found: ${src}`);
        }
      });
    },
  };
}

// Plugin to copy assets folder to dist
function copyAssetsPlugin() {
  return {
    name: "copy-assets",
    closeBundle() {
      const assetsDir = resolve(__dirname, "assets");
      const distAssetsDir = resolve(__dirname, "dist/assets");

      if (existsSync(assetsDir)) {
        copyDir(assetsDir, distAssetsDir);
        console.log(`✓ Copied assets folder to dist/assets/`);
      } else {
        console.warn(`⚠ Assets folder not found: ${assetsDir}`);
      }
    },
  };
}

// ✅ Replace <REPO_NAME> with your GitHub repository name
export default defineConfig({
  base: "/designo-website/",
  plugins: [copyComponentsPlugin(), copyAssetsPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        about: resolve(__dirname, "src/pages/about.html"),
        "app-design": resolve(__dirname, "src/pages/app-design.html"),
        contact: resolve(__dirname, "src/pages/contact.html"),
        "graphic-design": resolve(__dirname, "src/pages/graphic-design.html"),
        locations: resolve(__dirname, "src/pages/locations.html"),
        "web-design": resolve(__dirname, "src/pages/web-design.html"),
      },
    },
  },
});
