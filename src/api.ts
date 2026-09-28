import { useCallback, useEffect, useState } from "react";
import {
  localAnalysis, localApprovals, localAudit, localClauses, localContracts,
  localIntegrations, localStats, localTasks, localTimeline,
} from "./data";
import type {
  AnalysisData, Approval, AuditEvent, Clause, Contract, Integration, Stats,
  Task, TimelineItem,
} from "./data";

const BASE = "/api";
const DIRECT_BACKEND = "http://127.0.0.1:4000/api";

// The self-contained dist bundle is opened over file:// with no backend present.
// Skip network calls there so the console stays clean and we render demo data.
const IS_FILE = typeof window !== "undefined" && window.location.protocol === "file:";

export type BackendState = "checking" | "online" | "offline";
export type BackendMode = "postgres" | "in-memory-fallback" | "";

let _backend: BackendState = "checking";
let _mode: BackendMode = "";
let _gemini = false;
let _activeEndpoint = BASE;
const _subs = new Set<() => void>();

function setBackend(state: BackendState, mode: BackendMode = _mode, gemini = _gemini) {
  if (state === _backend && mode === _mode && gemini === _gemini) return;
  _backend = state;
  _mode = mode;
  _gemini = gemini;
  _subs.forEach((fn) => fn());
}

export function getBackend() {
  return { state: _backend, mode: _mode, gemini: _gemini };
}

export function useBackend() {
  const [, force] = useState(0);
  useEffect(() => {
    const fn = () => force((n) => n + 1);
    _subs.add(fn);
    return () => { _subs.delete(fn); };
  }, []);
  return getBackend();
}

async function tryFetch<T>(url: string, init?: RequestInit): Promise<T | null> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as T;
}

async function request<T>(path: string, init?: RequestInit): Promise<T | null> {
  if (IS_FILE) { setBackend("offline", "", false); return null; }

  // 1. Try active endpoint (usually /api proxy)
  try {
    const data = await tryFetch<T>(_activeEndpoint + path, init);
    if (data !== null) {
      setBackend("online");
      return data;
    }
  } catch {}

  // 2. If active was /api and it failed, try direct 127.0.0.1:4000/api
  if (_activeEndpoint !== DIRECT_BACKEND) {
    try {
      const data = await tryFetch<T>(DIRECT_BACKEND + path, init);
      if (data !== null) {
        _activeEndpoint = DIRECT_BACKEND;
        setBackend("online");
        return data;
      }
    } catch {}
  }

  setBackend("offline", "", false);
  return null;
}

export async function checkHealth() {
  if (IS_FILE) { setBackend("offline", "", false); return { online: false, db: false, mode: "", gemini: false }; }

  // Check via proxy or direct backend
  for (const endpoint of [BASE, DIRECT_BACKEND]) {
    try {
      const h = await tryFetch<{ ok: boolean; db: boolean; mode: string; gemini?: boolean }>(endpoint + "/health");
      if (h && h.ok) {
        _activeEndpoint = endpoint;
        const geminiActive = Boolean(h.gemini);
        setBackend("online", h.db ? "postgres" : "in-memory-fallback", geminiActive);
        return { online: true, db: h.db, mode: h.mode, gemini: geminiActive };
      }
    } catch {}
  }

  setBackend("offline", "", false);
  return { online: false, db: false, mode: "", gemini: false };
}

// ---- Read loaders (always resolve to usable data via fallback) ----
export const api = {
  stats: async (): Promise<Stats> => (await request<Stats>("/stats")) ?? localStats,
  contracts: async (): Promise<Contract[]> => (await request<Contract[]>("/contracts")) ?? localContracts,
  clauses: async (): Promise<Clause[]> => (await request<Clause[]>("/clauses")) ?? localClauses,
  tasks: async (): Promise<Task[]> => (await request<Task[]>("/tasks")) ?? localTasks,
  audit: async (): Promise<AuditEvent[]> => (await request<AuditEvent[]>("/audit")) ?? localAudit,
  integrations: async (): Promise<Integration[]> => (await request<Integration[]>("/integrations")) ?? localIntegrations,
  approvals: async (): Promise<Approval[]> => (await request<Approval[]>("/approvals")) ?? localApprovals,
  timeline: async (): Promise<TimelineItem[]> => (await request<TimelineItem[]>("/compliance-timeline")) ?? localTimeline,
  analyze: async (body?: { filename?: string; text?: string }): Promise<AnalysisData> =>
    (await request<AnalysisData>("/analyze", { method: "POST", body: JSON.stringify(body ?? {}) })) ?? localAnalysis,

  // ---- AI Copilot conversational chat ----
  chat: async (body: {
    message: string;
    history?: { role: "user" | "assistant" | "model"; content: string }[];
    contractContext?: string;
  }): Promise<{ reply: string; model?: string; engine: "gemini" | "simulated" }> => {
    const res = await request<{ reply: string; model?: string; engine: "gemini" | "simulated" }>("/copilot/chat", {
      method: "POST",
      body: JSON.stringify(body),
    });
    if (res) return res;
    return {
      reply: `Based on your contract portfolio, I see active obligations for Payment Terms, Security Compliance, and Upcoming Renewals. (Running in offline demo mode).`,
      engine: "simulated",
    };
  },

  // ---- Mutations. Return null when offline so callers can update local state. ----
  completeTask: (id: string) => request<Task>(`/tasks/${id}/complete`, { method: "POST" }),
  assignTask: (id: string, owner: string) => request<Task>(`/tasks/${id}/assign`, { method: "POST", body: JSON.stringify({ owner }) }),
  toggleIntegration: (id: string) => request<Integration>(`/integrations/${id}/toggle`, { method: "POST" }),
  decideApproval: (id: string, decision: "approve" | "reject") => request<Approval>(`/approvals/${id}/decide`, { method: "POST", body: JSON.stringify({ decision }) }),
};

// Generic data hook: seeds with local fallback so the UI renders instantly,
// then upgrades to server data when the request resolves.
export function useApi<T>(loader: () => Promise<T>, initial: T) {
  const [data, setData] = useState<T>(initial);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;
    loader().then((d) => { if (live) { setData(d); setLoading(false); } });
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reload = useCallback(() => {
    setLoading(true);
    loader().then((d) => { setData(d); setLoading(false); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, setData, loading, reload };
}
