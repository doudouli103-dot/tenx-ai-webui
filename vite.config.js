import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const mediaTarget = env.VITE_MEDIA_PROXY_TARGET || 'http://127.0.0.1:8091'

  return {
    plugins: [vue()],
    server: {
      port: 5174,
      proxy: {
        '/media': {
          target: mediaTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/media/, '')
        }
      }
    }
  }
})
