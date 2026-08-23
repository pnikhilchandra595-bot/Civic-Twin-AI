import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://127.0.0.1:8000',
        ws: true,
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React
          'react-vendor': ['react', 'react-dom'],
          // Leaflet map (largest chunk)
          'leaflet-vendor': ['leaflet'],
          // Lucide icons
          'icons-vendor': ['lucide-react'],
          // All district data (large static dataset)
          'districts-data': ['./src/data/allIndianDistricts'],
        }
      }
    }
  }
})
