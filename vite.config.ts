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
  plugins: [react()],
  define: {
    'process.platform': JSON.stringify(process.platform),
  },
});
