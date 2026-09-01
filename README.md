# tenx-ai-webui

`tenx-ai-webui` is a Vue 3 media console for `tenx-ai-media-service`.

## Features

- Image generation through `POST /api/v1/images/generations`
- Video generation through `POST /api/v1/videos/generations`
- Video task polling through `GET /api/v1/videos/tasks/{taskId}`
- Failed video task retry through `POST /api/v1/videos/tasks/{taskId}/retry`
- Video task metadata display for provider task ID and timestamps
- Real model names such as `qwen-image`, `flux-dev`, `wan2.2-ti2v-5b`
- Result preview from the asset URL returned by `tenx-ai-media-service`

## Project Role

`tenx-ai-webui` is the separated frontend for direct image/video media generation. It calls only `tenx-ai-media-service`; it does not call `tenx-ai-gateway`, `tenx-ai-tts-adapter`, or `study-ai-document-center-backend` directly.

Use `video-agent-webui` for short-video Agent workflows. Use `tenx-ai-webui` when you want a lower-level image/video generation console.

## Calling Chains

Image generation:

```text
browser
  -> tenx-ai-webui
      -> tenx-ai-media-service /api/v1/images/generations
          -> tenx-ai-gateway /v1/images/generations
              -> image-adapter
                  -> ComfyUI
          -> tenx-ai-media-service storage/media
      -> browser opens /api/v1/assets/<file_id>
```

Video generation:

```text
browser
  -> tenx-ai-webui
      -> tenx-ai-media-service /api/v1/videos/generations
          -> tenx-ai-gateway /v1/videos/generations
              -> video-adapter
                  -> ComfyUI / Wan runtime
          -> tenx-ai-media-service storage/media
      -> tenx-ai-webui polls /api/v1/videos/tasks/{taskId}
      -> browser opens /api/v1/assets/<file_id>
```

## Start

Start dependencies first:

```text
1. tenx-ai-gateway
2. tenx-ai-media-service
3. tenx-ai-webui
```

Start `tenx-ai-media-service`:

```bash
cd /Users/junweili1992163.com/ljwStudy/study-ai/tenx-ai-media-service
mvn spring-boot:run
```

Start this Web UI:

```bash
cd /Users/junweili1992163.com/ljwStudy/study-ai/tenx-ai-webui
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:5174
```

## Media Service Connection

Default development connection:

```text
Media Service Base URL: /media/api/v1
API Key: local-dev-key
```

Vite proxies `/media` to:

```text
http://127.0.0.1:8092
```

To point the dev proxy to another media service host:

```bash
VITE_MEDIA_PROXY_TARGET=http://Windows-IP:8092 npm run dev
```

## Build

```bash
npm run build
```
