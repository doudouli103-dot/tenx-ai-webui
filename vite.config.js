import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const gatewayTarget = env.VITE_GATEWAY_PROXY_TARGET || 'http://127.0.0.1:8088'

  return {
    plugins: [vue()],
    server: {
      port: 5174,
      proxy: {
        '/gateway': {
          target: gatewayTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/gateway/, '')
        }
      }
    }
  }
})
