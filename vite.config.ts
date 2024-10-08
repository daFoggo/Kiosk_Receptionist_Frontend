import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';
import path from 'path';

export default defineConfig({
  server: {
    // https: {
    //   key: fs.readFileSync(path.resolve(__dirname, 'private.key')),
    //   cert: fs.readFileSync(path.resolve(__dirname, 'certificate.crt')),
    // },
    // Other server options...
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});