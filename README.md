# tenx-ai-webui

`tenx-ai-webui` is a Vue 3 media console for `tenx-ai-gateway`.

## Features

- Image generation through `POST /v1/images/generations`
- Video generation through `POST /v1/videos/generations`
- Video task polling through `GET /v1/videos/tasks/{taskId}`
- Real model names such as `qwen-image`, `flux-dev`, `wan2.2-ti2v-5b`
- Result preview from the document center URL returned by the Gateway

## Start

Start `tenx-ai-gateway` first:

```bash
cd /Users/lijunwei/PycharmProjects/tenx-ai-gateway
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

## Gateway Connection

Default development connection:

```text
Gateway Base URL: /gateway/v1
API Key: local-dev-key
```

Vite proxies `/gateway` to:

```text
http://127.0.0.1:8088
```

To point the dev proxy to a Mac Studio Gateway:

```bash
VITE_GATEWAY_PROXY_TARGET=http://Mac-Studio-IP:8088 npm run dev
```

## Build

```bash
npm run build
```
