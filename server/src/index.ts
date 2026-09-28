import express from "express";
import { PORT } from "./config.js";
import { initDb, isDbUp } from "./db.js";
import { router } from "./routes.js";
import { isGeminiConfigured } from "./gemini.js";

const app = express();

// Dependency-free CORS so the standalone file:// build or any origin can call the API.
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(express.json({ limit: "10mb" }));

app.get("/", (_req, res) => {
  res.json({
    name: "ContractFlow AI API",
    db: isDbUp(),
    mode: isDbUp() ? "postgres" : "in-memory-fallback",
    gemini: isGeminiConfigured() ? "active" : "unconfigured",
    endpoints: [
      "GET /api/health", "GET /api/gemini/status", "GET /api/contracts", "GET /api/clauses",
      "GET /api/tasks", "GET /api/audit", "GET /api/integrations", "GET /api/approvals",
      "GET /api/stats", "GET /api/compliance-timeline", "POST /api/analyze",
      "POST /api/copilot/chat", "POST /api/tasks/:id/complete", "POST /api/tasks/:id/assign",
      "POST /api/integrations/:id/toggle", "POST /api/approvals/:id/decide",
    ],
  });
});

app.use("/api", router);

// 404 + error handlers
app.use((req, res) => res.status(404).json({ error: `not found: ${req.method} ${req.path}` }));
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[api] error:", err?.message || err);
  res.status(500).json({ error: "internal server error" });
});

initDb().finally(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\n  ========================================`);
    console.log(`  ContractFlow AI API`);
    console.log(`  ➜  URL: http://localhost:${PORT}/api`);
    console.log(`  ➜  Direct: http://127.0.0.1:${PORT}/api`);
    console.log(`  ➜  Storage: ${isDbUp() ? "PostgreSQL" : "In-memory fallback (set DATABASE_URL for Postgres)"}`);
    console.log(`  ➜  AI Engine: ${isGeminiConfigured() ? "Google Gemini AI (Active)" : "Simulated Rule Engine (Set GEMINI_API_KEY in .env)"}`);
    console.log(`  ========================================\n`);
  });
});

