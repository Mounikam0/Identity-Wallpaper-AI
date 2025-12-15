import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/identity-wallpaper-ai/',
  plugins: [react()],
  build: {
    outDir: 'docs'
  }
})
