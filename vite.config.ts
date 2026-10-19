import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const { VITE_BASE_PATH = '/' } = loadEnv(mode, '.', 'VITE_')

  return {
    base: VITE_BASE_PATH,
    plugins: [react(), tailwindcss()],
  }
})
