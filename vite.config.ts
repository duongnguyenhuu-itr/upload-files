/* eslint-disable @typescript-eslint/no-var-requires */
import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';

//vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3001,
  },
  build: {
    chunkSizeWarningLimit: 100,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return;
        }
        warn(warning);
      },
    },
  },
  plugins: [react()],
  define: {
    'process.platform': JSON.stringify(process.platform),
  },
});
