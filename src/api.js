import axios from 'axios'

export function createGatewayClient(settings) {
  const baseURL = trimTrailingSlash(settings.gatewayBaseUrl || '/gateway/v1')
  const apiKey = settings.apiKey || ''

  const client = axios.create({
    baseURL,
    timeout: 300000,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  })

  return {
    async listModels() {
      const response = await client.get('/models')
      return response.data
    },

    async generateImage(payload) {
      const response = await client.post('/images/generations', payload)
      return response.data
    },

    async submitVideo(payload) {
      const response = await client.post('/videos/generations', payload)
      return response.data
    },

    async getVideoTask(taskId) {
      const response = await client.get(`/videos/tasks/${encodeURIComponent(taskId)}`)
      return response.data
    }
  }
}

function trimTrailingSlash(value) {
  return value.replace(/\/$/, '')
}
