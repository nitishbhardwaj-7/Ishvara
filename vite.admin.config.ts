import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// The admin uploader. Built separately so it never ships inside the app.
// Deployed to GitHub Pages at /<repo>/admin/ by .github/workflows/pages.yml.
export default defineConfig({
  root: path.resolve(__dirname, 'admin'),
  base: './',
  envDir: __dirname,
  publicDir: false,
  plugins: [react(), tailwindcss()],
  build: {
    outDir: path.resolve(__dirname, 'dist-admin'),
    emptyOutDir: true,
  },
  server: { port: 3001 },
});
