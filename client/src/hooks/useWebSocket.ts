"use client";

import { useState, useRef, useCallback, useEffect } from "react";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:3001/ws";

export type ConnectionState = "idle" | "connecting" | "connected" | "error" | "closed";

export type TranscriptionResult = {
  text: string;
  isFinal: boolean;
  timestamp: number;
};

export function useWebSocket() {
  const [connectionState, setConnectionState] = useState<ConnectionState>("idle");
  const [transcriptions, setTranscriptions] = useState<TranscriptionResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    setConnectionState("connecting");
    setError(null);

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnectionState("connected");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data as string);

        // Handle asrResult events — these contain transcription
        if (data.type === "asrResult" && data.payload) {
          const text = data.payload.text ?? data.payload.transcript ?? "";
          const isFinal = data.payload.isFinal ?? false;

          if (text) {
            setTranscriptions((prev) => {
              // If not final, replace the last non-final entry
              if (!isFinal && prev.length > 0 && !prev[prev.length - 1]!.isFinal) {
                return [...prev.slice(0, -1), { text, isFinal, timestamp: Date.now() }];
              }
              return [...prev, { text, isFinal, timestamp: Date.now() }];
            });
          }
        }

        // Handle error messages from proxy
        if (data.type === "error") {
          setError(data.message ?? "Unknown error");
        }
      } catch {
        // Non-JSON messages are ignored
      }
    };

    ws.onerror = () => {
      setError("WebSocket connection failed");
      setConnectionState("error");
    };

    ws.onclose = () => {
      setConnectionState("closed");
    };
  }, []);

  const disconnect = useCallback(() => {
    wsRef.current?.close();
    wsRef.current = null;
    setConnectionState("idle");
  }, []);

  const sendAudioChunk = useCallback((base64Chunk: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "asrStream",
          chunk: base64Chunk,
          isFinal: false,
        })
      );
    }
  }, []);

  const sendFinal = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "asrStream",
          chunk: "",
          isFinal: true,
        })
      );
    }
  }, []);

  const clearTranscriptions = useCallback(() => {
    setTranscriptions([]);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      wsRef.current?.close();
    };
  }, []);

  return {
    connectionState,
    transcriptions,
    error,
    connect,
    disconnect,
    sendAudioChunk,
    sendFinal,
    clearTranscriptions,
  };
}
