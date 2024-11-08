import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  define: {
    __FIREBASE_CONFIG__: {
      apiKey: JSON.stringify(process.env.VITE_FIREBASE_API_KEY),
      authDomain: JSON.stringify(process.env.VITE_FIREBASE_AUTH_DOMAIN),
      projectId: JSON.stringify(process.env.VITE_FIREBASE_PROJECT_ID),
      storageBucket: JSON.stringify(process.env.VITE_FIREBASE_STORAGE_BUCKET),
      messagingSenderId: JSON.stringify(process.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
      appId: JSON.stringify(process.env.VITE_FIREBASE_APP_ID),
    },
  },
});