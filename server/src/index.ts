import express from "express";
import cors from "cors";
import { coursesRouter } from "./routes/courses";
import { getAudioChunks } from "./services/courseService";
import { HttpError } from "./types/http";
import { setupWebSocketProxy } from "./ws/proxy";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// REST API
app.use("/api/courses", coursesRouter);

// Audio chunks endpoint (separate from courses)
app.get("/api/audio-chunks", (_req, res) => {
  res.json({ chunks: getAudioChunks() });
});

// error handler
app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    if (err instanceof HttpError) {
      return res.status(err.status).json({
        error: { code: err.code, message: err.message },
      });
    }

    console.error(err);
    return res.status(500).json({
      error: { code: "INTERNAL_SERVER_ERROR", message: "Something went wrong" },
    });
  },
);

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
const server = app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

// Attach WebSocket proxy
setupWebSocketProxy(server);
