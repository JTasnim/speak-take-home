# Speak Full-stack Take-home

A small language learning app where you can browse courses, pick a lesson, and practice speaking your speech gets transcribed in real time through a WebSocket connection.

## Getting Started

You'll need **Node.js 18+** installed (I used v23, but anything 18+ should work fine).

```bash
# install everything
npm install
npm --prefix server install
npm --prefix client install

# run both client and server
npm run dev
```

The client will start on [http://localhost:3000](http://localhost:3000) and the server on [http://localhost:3001](http://localhost:3001).

If you want to run them separately:
```bash
npm run dev:server   # just the API server
npm run dev:client   # just the Next.js frontend
```

## Environment Variables

None required — everything works with defaults. But if you need to customize:

- `PORT` — server port (default: `3001`)
- `NEXT_PUBLIC_API_BASE_URL` — where the client hits the API (default: `http://localhost:3001`)
- `NEXT_PUBLIC_WS_URL` — WebSocket endpoint (default: `ws://localhost:3001/ws`)

## How It Works

The app has three main screens:

1. **Home** — shows all available courses with thumbnails and language tags
2. **Course detail** — hero image at the top, list of lessons below
3. **Lesson** — the interesting one: you see the lesson prompt and a record button

When you tap Record on a lesson page, here's what happens under the hood:

- The client fetches simulated audio chunks from `GET /api/audio-chunks`
- It opens a WebSocket to the server at `/ws`
- The server proxies that connection to `wss://api.usespeak-staging.com/public/v2/ws`, injecting the required `X-Access-Token` and `X-Client-Info` headers (browsers can't set custom headers on WebSocket connections, so the proxy is necessary)
- Audio chunks get streamed to the upstream API at ~100ms intervals
- Any `asrResult` messages that come back are displayed as live transcription text

## Project Structure

```
├── assets/                 # course data + simulated audio chunks
├── server/
│   └── src/
│       ├── index.ts        # express app, REST routes, WS setup
│       ├── routes/         # course API endpoints
│       ├── services/       # data access (reads from assets/)
│       ├── ws/proxy.ts     # websocket proxy to Speak API
│       └── types/          # shared types
└── client/
    └── src/
        ├── app/            # Next.js pages (App Router)
        ├── components/     # RecordingPanel
        ├── hooks/          # useWebSocket
        ├── lib/            # API helpers
        └── types/          # client-side types
```

## Notable Decisions

- **WebSocket proxy**: The Speak API requires custom headers that browsers don't allow on WS connections, so the Node server acts as a relay. It buffers messages if the upstream connection isn't ready yet.

- **Client component for lesson page**: Most pages are server components, but the lesson page needs to be a client component since it manages WebSocket state and the record/stop interaction.

- **Simulated audio**: Rather than using the real microphone, the app sends pre-recorded base64 audio chunks from `assets/audio.json`. This makes it easy to demo without worrying about mic permissions.

- **Dark theme**: Went with a dark, mobile-first design — felt appropriate for a language learning app you'd use on your phone.
