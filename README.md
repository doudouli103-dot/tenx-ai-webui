# tenx-ai-webui

`tenx-ai-webui` is a Vue 3 media console for `tenx-ai-media-service`.

## Features

- Image generation through `POST /api/v1/images/generations`
- Video generation through `POST /api/v1/videos/generations`
- Video task polling through `GET /api/v1/videos/tasks/{taskId}`
- Real model names such as `qwen-image`, `flux-dev`, `wan2.2-ti2v-5b`
- Result preview from the document center URL returned by the media service

## Start

Start `study-ai-document-center-backend`, `tenx-ai-gateway`, and `tenx-ai-media-service` first:

```bash
cd /Users/lijunwei/PycharmProjects/tenx-ai-media-service
mvn spring-boot:run
```

Start this Web UI:

```bash
cd /Users/lijunwei/PycharmProjects/tenx-ai-webui
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
http://127.0.0.1:8091
```

To point the dev proxy to another media service host:

```bash
VITE_MEDIA_PROXY_TARGET=http://Windows-IP:8091 npm run dev
```

## Build

```bash
npm run build
```
