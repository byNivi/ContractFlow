import { Router } from "express";
import * as store from "./store.js";
import { runAnalysis } from "./analysis.js";
import { chatWithGeminiCopilot, isGeminiConfigured } from "./gemini.js";
import { isDbUp } from "./db.js";

export const router = Router();

router.get("/health", (_req, res) => {
  res.json({
    ok: true,
    db: isDbUp(),
    mode: isDbUp() ? "postgres" : "in-memory-fallback",
    gemini: isGeminiConfigured(),
    time: new Date().toISOString(),
  });
});

router.get("/gemini/status", (_req, res) => {
  res.json({ configured: isGeminiConfigured() });
});

router.get("/contracts", async (_req, res) => {
  res.json(await store.getContracts());
});

router.get("/clauses", async (_req, res) => {
  res.json(await store.getClauses());
});

router.get("/obligations", async (_req, res) => {
  res.json(await store.getClauses());
});

router.get("/tasks", async (_req, res) => {
  res.json(await store.getTasks());
});

router.post("/tasks/:id/complete", async (req, res) => {
  const task = await store.completeTask(req.params.id);
  if (!task) return res.status(404).json({ error: "task not found" });
  res.json(task);
});

router.post("/tasks/:id/assign", async (req, res) => {
  const owner = String(req.body?.owner || "").trim();
  if (!owner) return res.status(400).json({ error: "owner required" });
  const task = await store.assignTask(req.params.id, owner);
  if (!task) return res.status(404).json({ error: "task not found" });
  res.json(task);
});

router.get("/audit", async (_req, res) => {
  res.json(await store.getAudit());
});

router.get("/integrations", async (_req, res) => {
  res.json(await store.getIntegrations());
});

router.post("/integrations/:id/toggle", async (req, res) => {
  const it = await store.toggleIntegration(req.params.id);
  if (!it) return res.status(404).json({ error: "integration not found" });
  res.json(it);
});

router.get("/approvals", async (_req, res) => {
  res.json(await store.getApprovals());
});

router.post("/approvals/:id/decide", async (req, res) => {
  const decision = String(req.body?.decision || "").toLowerCase();
  if (!["approve", "reject"].includes(decision)) {
    return res.status(400).json({ error: "decision must be 'approve' or 'reject'" });
  }
  const ap = await store.decideApproval(req.params.id, decision);
  if (!ap) return res.status(404).json({ error: "approval not found" });
  res.json(ap);
});

router.get("/stats", async (_req, res) => {
  res.json(await store.getStats());
});

router.get("/compliance-timeline", (_req, res) => {
  res.json(store.complianceTimeline);
});

// The contract-to-action pipeline. Accepts optional raw text; returns structured
// clauses/obligations/tasks/workflow. Uses Gemini AI when key is present, and persists results.
router.post("/analyze", async (req, res) => {
  try {
    const filename = typeof req.body?.filename === "string" ? req.body.filename : undefined;
    const text = typeof req.body?.text === "string" ? req.body.text : undefined;
    const result = await runAnalysis({ filename, text });

    await store.persistAnalysis({
      id: result.id,
      filename: result.filename,
      contract_type: result.contract_type,
      clauses: result.clauses,
      tasks: result.tasks,
    });

    res.json(result);
  } catch (err: any) {
    console.error("[api/analyze] error:", err?.message || err);
    res.status(500).json({ error: "Failed to analyze contract" });
  }
});

// AI Copilot conversational chat powered by Google Gemini
router.post("/copilot/chat", async (req, res) => {
  try {
    const message = String(req.body?.message || "").trim();
    if (!message) return res.status(400).json({ error: "message is required" });

    const history = Array.isArray(req.body?.history) ? req.body.history : [];
    const contractContext = typeof req.body?.contractContext === "string" ? req.body.contractContext : "";

    const response = await chatWithGeminiCopilot(message, history, contractContext);
    res.json(response);
  } catch (err: any) {
    console.error("[api/copilot/chat] error:", err?.message || err);
    res.status(500).json({ error: "Failed to process chat message" });
  }
});
