<template>
  <div class="app-shell">
    <aside class="side-panel">
      <div class="brand">
        <div class="brand-mark">
          <Sparkles :size="22" />
        </div>
        <div>
          <h1>tenx-ai-webui</h1>
          <p>媒体生成工作台</p>
        </div>
      </div>

      <section class="config-block">
        <div class="section-title">
          <Settings :size="18" />
          <span>Gateway</span>
        </div>
        <el-form label-position="top">
          <el-form-item label="Base URL">
            <el-input v-model="settings.gatewayBaseUrl" />
          </el-form-item>
          <el-form-item label="API Key">
            <el-input v-model="settings.apiKey" type="password" show-password />
          </el-form-item>
          <el-button class="wide-button" type="primary" :loading="modelsLoading" @click="loadModels">
            <RefreshCw :size="16" />
            刷新模型
          </el-button>
        </el-form>
      </section>

      <section class="model-list">
        <div class="section-title">
          <ListTree :size="18" />
          <span>模型</span>
        </div>
        <div v-if="models.length" class="model-items">
          <button
            v-for="model in models"
            :key="model.id"
            class="model-row"
            type="button"
            @click="selectModel(model)"
          >
            <span>{{ model.id }}</span>
            <small>{{ model.capability || 'chat' }}</small>
          </button>
        </div>
        <el-empty v-else :image-size="84" description="暂无模型" />
      </section>
    </aside>

    <main class="workspace">
      <header class="topbar">
        <div>
          <h2>图片与视频生成</h2>
          <p>{{ statusLine }}</p>
        </div>
        <el-button type="primary" plain @click="loadModels">
          <RefreshCw :size="16" />
          刷新
        </el-button>
      </header>

      <el-tabs v-model="activeTab" class="media-tabs">
        <el-tab-pane name="image">
          <template #label>
            <span class="tab-label"><ImageIcon :size="16" /> 图片</span>
          </template>
          <section class="generator-layout">
            <form class="tool-panel" @submit.prevent="generateImage">
              <div class="panel-title">
                <ImageIcon :size="18" />
                <span>图片生成</span>
              </div>
              <label>
                模型
                <el-select v-model="imageForm.model" filterable>
                  <el-option v-for="model in imageModels" :key="model.id" :label="model.id" :value="model.id" />
                </el-select>
              </label>
              <label>
                尺寸
                <el-select v-model="imageForm.size">
                  <el-option label="1024x1024" value="1024x1024" />
                  <el-option label="1280x720" value="1280x720" />
                  <el-option label="720x1280" value="720x1280" />
                </el-select>
              </label>
              <label>
                数量
                <el-input-number v-model="imageForm.n" :min="1" :max="4" />
              </label>
              <label>
                提示词
                <el-input v-model="imageForm.prompt" type="textarea" :rows="8" resize="none" />
              </label>
              <el-button native-type="submit" type="primary" :loading="imageLoading">
                <WandSparkles :size="16" />
                生成图片
              </el-button>
            </form>

            <section class="result-panel image-result">
              <div class="panel-title">
                <GalleryHorizontalEnd :size="18" />
                <span>结果</span>
              </div>
              <div v-if="imageResultUrl" class="preview-frame">
                <img :src="imageResultUrl" alt="generated image" />
              </div>
              <div v-else class="empty-state">
                <ImageIcon :size="42" />
                <span>等待生成</span>
              </div>
              <a v-if="imageResultUrl" class="result-link" :href="imageResultUrl" target="_blank" rel="noreferrer">
                {{ imageResultUrl }}
              </a>
            </section>
          </section>
        </el-tab-pane>

        <el-tab-pane name="video">
          <template #label>
            <span class="tab-label"><Clapperboard :size="16" /> 视频</span>
          </template>
          <section class="generator-layout">
            <form class="tool-panel" @submit.prevent="submitVideo">
              <div class="panel-title">
                <Clapperboard :size="18" />
                <span>视频生成</span>
              </div>
              <label>
                模型
                <el-select v-model="videoForm.model" filterable>
                  <el-option v-for="model in videoModels" :key="model.id" :label="model.id" :value="model.id" />
                </el-select>
              </label>
              <label>
                时长
                <el-input-number v-model="videoForm.duration" :min="1" :max="5" />
              </label>
              <label>
                尺寸
                <el-select v-model="videoForm.size">
                  <el-option label="1280x720" value="1280x720" />
                  <el-option label="720x1280" value="720x1280" />
                  <el-option label="1024x1024" value="1024x1024" />
                </el-select>
              </label>
              <label>
                提示词
                <el-input v-model="videoForm.prompt" type="textarea" :rows="8" resize="none" />
              </label>
              <el-button native-type="submit" type="primary" :loading="videoSubmitting">
                <Play :size="16" />
                提交任务
              </el-button>
            </form>

            <section class="result-panel">
              <div class="panel-title">
                <Activity :size="18" />
                <span>任务</span>
              </div>
              <div class="task-status" :class="videoTask.status || 'idle'">
                <span>{{ videoTask.status || 'idle' }}</span>
                <small>{{ videoTask.task_id || 'no task' }}</small>
              </div>
              <div v-if="videoTask.result_url" class="preview-frame video-frame">
                <video :src="videoTask.result_url" controls />
              </div>
              <div v-else class="empty-state">
                <Clapperboard :size="42" />
                <span>等待结果</span>
              </div>
              <a v-if="videoTask.result_url" class="result-link" :href="videoTask.result_url" target="_blank" rel="noreferrer">
                {{ videoTask.result_url }}
              </a>
              <p v-if="videoTask.error" class="error-text">{{ videoTask.error }}</p>
            </section>
          </section>
        </el-tab-pane>
      </el-tabs>
    </main>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Activity,
  Clapperboard,
  GalleryHorizontalEnd,
  ImageIcon,
  ListTree,
  Play,
  RefreshCw,
  Settings,
  Sparkles,
  WandSparkles
} from '@lucide/vue'
import { createGatewayClient } from './api'

const activeTab = ref('image')
const models = ref([])
const modelsLoading = ref(false)
const imageLoading = ref(false)
const videoSubmitting = ref(false)
const imageResultUrl = ref('')
const pollTimer = ref(null)

const settings = reactive(loadSettings())

const imageForm = reactive({
  model: 'qwen-image',
  size: '1024x1024',
  n: 1,
  prompt: '生成一张科技感 AI Gateway 架构图，干净背景，清晰节点，适合技术文档'
})

const videoForm = reactive({
  model: 'wan2.2-ti2v-5b',
  duration: 5,
  size: '1280x720',
  prompt: '一个 5 秒的科技感 AI Gateway 动画，数据流从客户端进入网关再流向模型服务'
})

const videoTask = reactive({
  task_id: '',
  status: '',
  file_id: '',
  result_url: '',
  error: ''
})

const imageModels = computed(() => models.value.filter((model) => model.capability === 'image'))
const videoModels = computed(() => models.value.filter((model) => model.capability === 'video'))
const statusLine = computed(() => {
  const imageCount = imageModels.value.length
  const videoCount = videoModels.value.length
  return `${imageCount} 个图片模型，${videoCount} 个视频模型`
})

watch(settings, () => {
  localStorage.setItem('tenx-ai-webui-settings', JSON.stringify(settings))
}, { deep: true })

onMounted(() => {
  loadModels()
})

onBeforeUnmount(() => {
  stopPolling()
})

async function loadModels() {
  modelsLoading.value = true
  try {
    const data = await gateway().listModels()
    models.value = data.data || []
    chooseDefaults()
  } catch (error) {
    ElMessage.error(readError(error))
  } finally {
    modelsLoading.value = false
  }
}

async function generateImage() {
  imageLoading.value = true
  imageResultUrl.value = ''
  try {
    const data = await gateway().generateImage({ ...imageForm })
    const first = data.data && data.data[0]
    imageResultUrl.value = first ? first.url : ''
    ElMessage.success('图片已生成')
  } catch (error) {
    ElMessage.error(readError(error))
  } finally {
    imageLoading.value = false
  }
}

async function submitVideo() {
  videoSubmitting.value = true
  resetVideoTask()
  try {
    const data = await gateway().submitVideo({ ...videoForm })
    Object.assign(videoTask, data)
    startPolling(data.task_id)
    ElMessage.success('视频任务已提交')
  } catch (error) {
    ElMessage.error(readError(error))
  } finally {
    videoSubmitting.value = false
  }
}

function startPolling(taskId) {
  stopPolling()
  pollTimer.value = window.setInterval(async () => {
    try {
      const data = await gateway().getVideoTask(taskId)
      Object.assign(videoTask, data)
      if (data.status === 'succeeded' || data.status === 'failed') {
        stopPolling()
      }
    } catch (error) {
      stopPolling()
      videoTask.status = 'failed'
      videoTask.error = readError(error)
    }
  }, 2500)
}

function stopPolling() {
  if (pollTimer.value) {
    window.clearInterval(pollTimer.value)
    pollTimer.value = null
  }
}

function resetVideoTask() {
  Object.assign(videoTask, {
    task_id: '',
    status: '',
    file_id: '',
    result_url: '',
    error: ''
  })
}

function selectModel(model) {
  if (model.capability === 'image') {
    activeTab.value = 'image'
    imageForm.model = model.id
  }
  if (model.capability === 'video') {
    activeTab.value = 'video'
    videoForm.model = model.id
  }
}

function chooseDefaults() {
  if (!imageModels.value.some((model) => model.id === imageForm.model) && imageModels.value[0]) {
    imageForm.model = imageModels.value[0].id
  }
  if (!videoModels.value.some((model) => model.id === videoForm.model) && videoModels.value[0]) {
    videoForm.model = videoModels.value[0].id
  }
}

function gateway() {
  return createGatewayClient(settings)
}

function loadSettings() {
  const saved = localStorage.getItem('tenx-ai-webui-settings')
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch (error) {
      localStorage.removeItem('tenx-ai-webui-settings')
    }
  }
  return {
    gatewayBaseUrl: '/gateway/v1',
    apiKey: 'local-dev-key'
  }
}

function readError(error) {
  return error?.response?.data?.message || error?.response?.data || error?.message || '请求失败'
}
</script>
