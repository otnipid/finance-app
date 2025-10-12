import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      port: 5173,
      host: '0.0.0.0',
      strictPort: true,
      proxy: {
        // Proxy requests that start with /accounts to the backend
        '/accounts': {
          target: 'http://finance-api:80',
          changeOrigin: true,
          secure: false,
        },
        // Add other API endpoints here as needed
        '/transactions': {
          target: 'http://finance-api:80',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || ''),
    },
  };
});
