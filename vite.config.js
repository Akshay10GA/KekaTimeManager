import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.dae", "**/*.gltf"],
  define: {
    // This is required for the emoji picker to work in Vite
    global: 'window',
  },
});