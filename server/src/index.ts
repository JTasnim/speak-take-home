import express from "express";
import cors from "cors";
import { coursesRouter } from "./routes/courses";
import { HttpError } from "./types/http";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// REST API
app.use("/api/courses", coursesRouter);

// Error handler (keep it after routes)
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
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
