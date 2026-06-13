import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

export default defineConfig(({ mode }) => {
  const currentDir = path.dirname(fileURLToPath(import.meta.url))
  const projectRoot = path.resolve(currentDir, '..')
  const env = loadEnv(mode, projectRoot, 'VITE_')

  return {
    base: '/app/',
    plugins: [
      react(),
      tailwindcss(),
    ],
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
      hmr: {
        protocol: 'wss',
        host: env.VITE_HMR_HOST || 'localhost',
        port: 5173,
        clientPort: Number(env.VITE_HMR_CLIENT_PORT) || 8443
      }
    }
  }
})
