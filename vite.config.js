import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      proxy: {
        '/api': {
          target: 'https://frontend-api-express.onrender.com',
          changeOrigin: true,
        },
      },
    }),
  ],
});
