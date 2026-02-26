# Speak Full-stack Take-home

A language learning portal where users can browse courses, view lessons, and practice speaking with real-time transcription via WebSocket.

## Prerequisites

- **Node.js** v18+ (built with v23.11.0)
- **npm** v9+

## Installation

```bash
# Install root dependencies (concurrently)
npm install

# Install server dependencies
npm --prefix server install

# Install client dependencies
npm --prefix client install
```

## Running the Application

```bash
npm run dev
```

This starts both servers concurrently:

| Service | URL | Description |
|---------|-----|-------------|
| **Client** (Next.js) | `http://localhost:3000` | React frontend |
| **Server** (Express) | `http://localhost:3001` | REST API + WebSocket proxy |

You can also run them individually:

```bash
npm run dev:server  # Server only on :3001
npm run dev:client  # Client only on :3000
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Server port |
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:3001` | Client → Server API base URL |
| `NEXT_PUBLIC_WS_URL` | `ws://localhost:3001/ws` | Client → Server WebSocket URL |

No `.env` files are required — all defaults work out of the box.

## Architecture

```
take-home-test/
├── assets/              # Shared data files
│   ├── course.json      # Course & lesson data
│   └── audio.json       # Simulated audio chunks (base64)
├── server/              # Node.js + Express backend
│   └── src/
│       ├── index.ts           # Express app + routes + WS integration
│       ├── routes/courses.ts  # REST API routes
│       ├── services/courseService.ts  # Data access layer
│       ├── ws/proxy.ts        # WebSocket proxy to Speak API
│       └── types/             # TypeScript types
└── client/              # Next.js frontend
    └── src/
        ├── app/               # Pages (App Router)
        ├── components/        # RecordingPanel UI
        ├── hooks/             # useWebSocket hook
        ├── lib/               # API client utilities
        └── types/             # TypeScript types
```

### Key Design Decisions

- **WebSocket Proxy** (`server/src/ws/proxy.ts`): Browsers cannot set custom headers on WebSocket connections, so the server proxies client connections to `wss://api.usespeak-staging.com/public/v2/ws` with the required `X-Access-Token` and `X-Client-Info` headers. Messages are relayed bidirectionally.

- **Simulated Recording**: The `RecordingPanel` component fetches audio chunks from `GET /api/audio-chunks` and streams them over the WebSocket at 100ms intervals, simulating a real-time microphone input. Transcription results (`asrResult` events) are displayed as they arrive.

- **Client-side Lesson Page**: The lesson page is a React client component (not a server component) because it needs interactive state management for the recording UI and WebSocket connection lifecycle.

- **Mobile-first Dark Theme**: The UI uses a custom design system with glassmorphism cards, gradient accents, and smooth animations — optimized for a phone-sized viewport.