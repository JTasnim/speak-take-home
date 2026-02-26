import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";

const UPSTREAM_URL = "wss://api.usespeak-staging.com/public/v2/ws";
const UPSTREAM_HEADERS = {
  "X-Access-Token": "DFKKEIO23DSAvsdf",
  "X-Client-Info": "Speak Interview Test",
};

export function setupWebSocketProxy(httpServer: Server) {
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  wss.on("connection", (clientWs) => {
    console.log("[WS Proxy] Client connected");

    // Open upstream connection to Speak API
    const upstream = new WebSocket(UPSTREAM_URL, {
      headers: UPSTREAM_HEADERS,
    });

    let upstreamOpen = false;
    const buffered: (string | Buffer)[] = [];

    upstream.on("open", () => {
      console.log("[WS Proxy] Upstream connected");
      upstreamOpen = true;
      // Flush any buffered messages
      for (const msg of buffered) {
        upstream.send(msg);
      }
      buffered.length = 0;
    });

    // Relay: client → upstream
    clientWs.on("message", (data: Buffer | string) => {
      if (upstreamOpen) {
        upstream.send(data);
      } else {
        buffered.push(data);
      }
    });

    // Relay: upstream → client
    upstream.on("message", (data: Buffer | string) => {
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(data);
      }
    });

    // Handle close
    clientWs.on("close", () => {
      console.log("[WS Proxy] Client disconnected");
      upstream.close();
    });

    upstream.on("close", () => {
      console.log("[WS Proxy] Upstream disconnected");
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.close();
      }
    });

    // Handle errors
    clientWs.on("error", (err) => {
      console.error("[WS Proxy] Client error:", err.message);
      upstream.close();
    });

    upstream.on("error", (err) => {
      console.error("[WS Proxy] Upstream error:", err.message);
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(
          JSON.stringify({
            type: "error",
            message: "Upstream connection failed",
          }),
        );
        clientWs.close();
      }
    });
  });

  console.log("[WS Proxy] WebSocket proxy ready on /ws");
  return wss;
}
