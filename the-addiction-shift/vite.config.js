import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/the-ai-shift/the-addiction-shift/',
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
});
