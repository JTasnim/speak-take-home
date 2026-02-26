"use client";

import { useState, useCallback, useRef } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";
import { API_BASE_URL } from "@/lib/api";
import type { AudioChunk } from "@/types/course";

type RecordingState = "idle" | "loading" | "recording" | "processing";

export function RecordingPanel() {
  const {
    connectionState,
    transcriptions,
    error,
    connect,
    disconnect,
    sendAudioChunk,
    sendFinal,
    clearTranscriptions,
  } = useWebSocket();

  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const chunksRef = useRef<AudioChunk[]>([]);
  const chunkIndexRef = useRef(0);

  const startRecording = useCallback(async () => {
    setRecordingState("loading");
    clearTranscriptions();

    try {
      // Fetch audio chunks
      const res = await fetch(`${API_BASE_URL}/api/audio-chunks`, {
        cache: "no-store",
      });
      const data = await res.json();
      chunksRef.current = data.chunks ?? [];
      chunkIndexRef.current = 0;

      // Connect WebSocket
      connect();

      // Wait a moment for connection to establish
      await new Promise((r) => setTimeout(r, 500));

      setRecordingState("recording");

      // Start streaming chunks at intervals (simulating real-time recording)
      intervalRef.current = setInterval(() => {
        if (chunkIndexRef.current < chunksRef.current.length) {
          const chunk = chunksRef.current[chunkIndexRef.current];
          if (chunk) {
            sendAudioChunk(chunk.chunk);
          }
          chunkIndexRef.current++;
        } else {
          // All chunks sent
          stopRecording();
        }
      }, 100); // Send a chunk every 100ms
    } catch (e) {
      setRecordingState("idle");
    }
  }, [connect, sendAudioChunk, clearTranscriptions]);

  const stopRecording = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setRecordingState("processing");
    sendFinal();

    // Give time for final transcription to arrive
    setTimeout(() => {
      disconnect();
      setRecordingState("idle");
    }, 2000);
  }, [disconnect, sendFinal]);

  const handleToggle = useCallback(() => {
    if (recordingState === "idle") {
      startRecording();
    } else if (recordingState === "recording") {
      stopRecording();
    }
  }, [recordingState, startRecording, stopRecording]);

  const latestTranscription =
    transcriptions.length > 0
      ? transcriptions.map((t) => t.text).join(" ")
      : null;

  return (
    <div className="recording-panel">
      {/* Status indicator */}
      <div className="recording-status">
        <div className={`status-dot ${recordingState}`} />
        <span className="status-text">
          {recordingState === "idle" && "Ready to record"}
          {recordingState === "loading" && "Preparing..."}
          {recordingState === "recording" && "Recording..."}
          {recordingState === "processing" && "Processing..."}
        </span>
        {connectionState === "connected" && (
          <span className="connection-badge">Live</span>
        )}
      </div>

      {/* Record button */}
      <button
        className={`record-button ${recordingState}`}
        onClick={handleToggle}
        disabled={recordingState === "loading" || recordingState === "processing"}
      >
        <div className="record-button-inner">
          {recordingState === "recording" ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="8" />
            </svg>
          )}
        </div>
        <span className="record-label">
          {recordingState === "idle" && "Tap to Record"}
          {recordingState === "loading" && "Connecting..."}
          {recordingState === "recording" && "Tap to Stop"}
          {recordingState === "processing" && "Processing..."}
        </span>
      </button>

      {/* Transcription display */}
      <div className="transcription-area">
        <h3 className="transcription-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Transcription
        </h3>
        <div className="transcription-content">
          {latestTranscription ? (
            <p className="transcription-text">{latestTranscription}</p>
          ) : (
            <p className="transcription-placeholder">
              {recordingState === "recording"
                ? "Listening for speech..."
                : "Press the record button to start speaking. Your speech will be transcribed in real-time."}
            </p>
          )}
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="recording-error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          {error}
        </div>
      )}

      {/* Chunk progress */}
      {recordingState === "recording" && chunksRef.current.length > 0 && (
        <div className="chunk-progress">
          <div
            className="chunk-progress-bar"
            style={{
              width: `${(chunkIndexRef.current / chunksRef.current.length) * 100}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}
