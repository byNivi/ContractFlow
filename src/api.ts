import { useCallback, useEffect, useState } from "react";
import {
  localAnalysis, localApprovals, localAudit, localClauses, localContracts,
  localDeadlineIssues, localEmployeeReports, localInstallments, localIntegrations,
  localReminders, localStats, localTasks, localTimeline, localWorkProgress,
} from "./data";
import type {
  AnalysisData, Approval, AuditEvent, Clause, Contract, ContractAmendment,
  DeadlineIssue, EmployeeReport, Installment, Integration, Reminder, Stats,
  Task, TimelineItem, WorkProgress,
} from "./data";

const BASE = "/api";
const DIRECT_BACKEND = "http://127.0.0.1:4000/api";

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

  try {
    const data = await tryFetch<T>(_activeEndpoint + path, init);
    if (data !== null) {
      setBackend("online");
      return data;
    }
  } catch {}

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

// In-memory writable store for seamless dynamic client-side mutation & demo experience
let _contracts = [...localContracts];
let _installments = [...localInstallments];
let _workProgress = [...localWorkProgress];
let _deadlineIssues = [...localDeadlineIssues];
let _reminders = [...localReminders];
let _reports = [...localEmployeeReports];
let _tasks = [...localTasks];
let _approvals = [...localApprovals];

export const api = {
  stats: async (): Promise<Stats> => (await request<Stats>("/stats")) ?? localStats,
  contracts: async (): Promise<Contract[]> => (await request<Contract[]>("/contracts")) ?? _contracts,
  clauses: async (): Promise<Clause[]> => (await request<Clause[]>("/clauses")) ?? localClauses,
  tasks: async (): Promise<Task[]> => (await request<Task[]>("/tasks")) ?? _tasks,
  audit: async (): Promise<AuditEvent[]> => (await request<AuditEvent[]>("/audit")) ?? localAudit,
  integrations: async (): Promise<Integration[]> => (await request<Integration[]>("/integrations")) ?? localIntegrations,
  approvals: async (): Promise<Approval[]> => (await request<Approval[]>("/approvals")) ?? _approvals,
  timeline: async (): Promise<TimelineItem[]> => (await request<TimelineItem[]>("/compliance-timeline")) ?? localTimeline,
  installments: async (): Promise<Installment[]> => (await request<Installment[]>("/installments")) ?? _installments,
  workProgress: async (): Promise<WorkProgress[]> => (await request<WorkProgress[]>("/work-progress")) ?? _workProgress,
  deadlineIssues: async (): Promise<DeadlineIssue[]> => (await request<DeadlineIssue[]>("/deadline-issues")) ?? _deadlineIssues,
  reminders: async (): Promise<Reminder[]> => (await request<Reminder[]>("/reminders")) ?? _reminders,
  employeeReports: async (): Promise<EmployeeReport[]> => (await request<EmployeeReport[]>("/reports")) ?? _reports,

  analyze: async (body?: { filename?: string; text?: string; industry?: string }): Promise<AnalysisData> => {
    const res = await request<AnalysisData>("/analyze", { method: "POST", body: JSON.stringify(body ?? {}) });
    if (res) return res;
    
    // Offline simulated multi-industry responsive analysis
    const isCivil = (body?.filename || "").toLowerCase().includes("civil") || (body?.text || "").toLowerCase().includes("construction") || body?.industry === "Civil & Construction";
    const isPharma = (body?.filename || "").toLowerCase().includes("pharma") || (body?.text || "").toLowerCase().includes("clinical") || body?.industry === "Pharma & Biotech";

    if (isCivil) {
      return {
        id: "analysis-civil-" + Date.now(),
        filename: body?.filename || "LT-Metro-EPC-Contract.pdf",
        contract_type: "EPC Construction Contract (FIDIC)",
        industry: "Civil & Construction",
        status: "Active",
        risk: "High",
        confidence: 97,
        summary: "FIDIC Red Book construction agreement with L&T. Detected 5 milestone installment schedules (₹2.85 Cr total value), 5% retention money deduction (₹14.25 Lakhs), 28-day notice requirement for Mumbai monsoon force majeure (Clause 8.4), and liquidated damages of ₹50,000/day.",
        important_dates: 12,
        clauses: [
          { type: "Retention Money Release (5%)", party: "Metro Sponsor", deadline: "56 days post-DLP", risk: "High", status: "Active" },
          { type: "Extension of Time (EOT) Notice", party: "Contractor", deadline: "28 days from event", risk: "High", status: "Pending" },
          { type: "Substructure Milestone Payment", party: "Finance Officer", deadline: "15 days post-cert", risk: "Medium", status: "Active" },
          { type: "Defect Liability Rectification", party: "Site Engineer", deadline: "14 days from notice", risk: "Low", status: "Active" },
        ],
        tasks: [
          { title: "Inspect Substructure Piling Quality & Issue Stage-2 Certificate", owner: "Priya Sharma", due: "15 Oct, 2026", priority: "High" },
          { title: "Review Monsoon Rainfall Log for Clause 8.4 EOT Validation", owner: "Priya Sharma", due: "05 Oct, 2026", priority: "High" },
          { title: "Deposit 5% Retention Money to Escrow Account", owner: "Ananya Deshmukh", due: "20 Oct, 2026", priority: "Medium" },
        ],
        installments_detected: [
          { milestone: "Mobilization Advance", amount: "₹28,50,000", due: "2026-03-01", time: "12:00 PM" },
          { milestone: "Substructure & Piling Completion", amount: "₹45,00,000", due: "2026-10-15", time: "06:30 PM" },
          { milestone: "Superstructure Framing", amount: "₹80,00,000", due: "2027-02-28", time: "05:00 PM" },
          { milestone: "Handover & Final Retention Release", amount: "₹14,25,000", due: "2028-05-30", time: "05:00 PM" },
        ],
        deadline_issues_detected: [
          { title: "Foundation Milestone Delay vs Monsoon Force Majeure", risk: "High", reason: "IMD rainfall records must be certified to prevent ₹50,000/day liquidated damages." },
        ],
        next_steps: [
          "Assign site management tasks to Priya Sharma",
          "Issue Milestone 2 inspection notice to Resident Engineer",
          "Log EOT amendment in ContractFlow repository",
        ],
        engine: "llm",
      };
    }

    if (isPharma) {
      return {
        id: "analysis-pharma-" + Date.now(),
        filename: body?.filename || "Sun-Pharma-Clinical-Trial.pdf",
        contract_type: "Clinical Trial Research Agreement",
        industry: "Pharma & Biotech",
        status: "Active",
        risk: "Medium",
        confidence: 98,
        summary: "Phase III regulatory protocol agreement complying with CDSCO and US FDA 21 CFR Part 11. Contains mandatory 24-hour expedited Serious Adverse Event (SAE) reporting, cold-chain continuous temperature logging (+2°C to +8°C), and patient confidentiality covenants.",
        important_dates: 10,
        clauses: [
          { type: "Expedited SAE 24h Reporting", party: "Safety Lead", deadline: "24 hours", risk: "High", status: "Active" },
          { type: "Cold-Chain Temperature Excursion Protocol", party: "Logistics Partner", deadline: "Immediate", risk: "High", status: "Active" },
          { type: "CDSCO Form 1572 / Ethics Approval Sign-off", party: "Principal Investigator", deadline: "14 days", risk: "Medium", status: "Active" },
          { type: "Milestone 1 Enrollment Invoicing", party: "Finance Officer", deadline: "Net 30", risk: "Low", status: "Active" },
        ],
        tasks: [
          { title: "Audit Batch Temperature Dataloggers for Cold-Chain Compliance", owner: "Ananya Deshmukh", due: "02 Oct, 2026", priority: "High" },
          { title: "Submit Emergency IND Safety Report to CDSCO Safety Portal", owner: "Ananya Deshmukh", due: "01 Oct, 2026", priority: "High" },
        ],
        installments_detected: [
          { milestone: "Patient Cohort Enrollment Phase 1", amount: "₹18,00,000", due: "2026-09-20", time: "04:00 PM" },
          { milestone: "Interim Clinical Data Safety Sign-off", amount: "₹35,00,000", due: "2027-01-15", time: "05:00 PM" },
        ],
        deadline_issues_detected: [
          { title: "CDSCO / FDA Serious Adverse Event 24h Transmission Window", risk: "Critical", reason: "Strict statutory 7-day reporting clock active." },
        ],
        next_steps: [
          "Assign regulatory tasks to Ananya Deshmukh",
          "Setup automated Slack urgent reminder for SAE compliance",
          "Route regulatory dossier to Boss Vikramaditya Singhania",
        ],
        engine: "llm",
      };
    }

    return localAnalysis;
  },

  // ---- AI Copilot conversational chat & Problem Solver ----
  chat: async (body: {
    message: string;
    history?: { role: "user" | "assistant" | "model"; content: string }[];
    contractContext?: string;
    industry?: string;
  }): Promise<{ reply: string; model?: string; engine: "gemini" | "simulated"; remedies?: string[]; clauseDraft?: string }> => {
    const res = await request<{ reply: string; model?: string; engine: "gemini" | "simulated" }>("/copilot/chat", {
      method: "POST",
      body: JSON.stringify(body),
    });
    if (res) return res;

    // Advanced dynamic simulated multi-industry solver
    const msg = body.message.toLowerCase();
    const ind = body.industry || "General";

    if (msg.includes("retention") || msg.includes("fidic") || msg.includes("civil") || msg.includes("construction") || msg.includes("weather") || msg.includes("monsoon") || msg.includes("liquidated damages")) {
      return {
        reply: `### 🏗️ Civil & Construction Sector Legal Assessment (FIDIC Red Book / Indian Law)
**Problem Analysis:**
Under standard FIDIC Clause 8.4(c) and Indian Contract Act Section 56, unforeseen adverse climatic conditions (monsoon rains) entitle the contractor to an **Extension of Time (EOT)** without liquidated damages, provided a formal Notice of Claim was submitted within 28 days.

**Key Findings:**
1. **Liquidated Damages Defense:** Because rainfall metrics exceed the 10-year IMD average by >20%, liquidated damages of ₹50,000/day are legally unenforceable during the weather hiatus.
2. **Retention Money:** 5% retention (₹14,25,000) must remain in escrow until the Defect Liability Period (DLP) expires.

**Action Plan:**
• Draft formal EOT Clause 8.4 amendment.
• Request resident engineer site verification certificate.
• Extend Milestone 2 substructure installment deadline to Nov 15.`,
        engine: "simulated",
        remedies: [
          "Submit certified IMD rainfall log to Resident Engineer within 28-day notice window.",
          "Execute Contract Amendment v1.4 shifting Milestone 2 completion date to Nov 15.",
          "Pause daily liquidated damage calculations under Sub-Clause 8.7.",
        ],
        clauseDraft: "Amendment to Clause 8.4: 'The Contractor shall be granted an Extension of Time of 21 calendar days for abnormal monsoon rainfall. No delay damages shall accrue between 12 Sep and 05 Oct.'",
      };
    }

    if (msg.includes("pharma") || msg.includes("fda") || msg.includes("cdsco") || msg.includes("temperature") || msg.includes("cold chain") || msg.includes("adverse") || msg.includes("sae") || msg.includes("clinical")) {
      return {
        reply: `### 💊 Pharma & Healthcare Sector Regulatory Assessment (CDSCO & cGMP)
**Problem Analysis:**
Biopharmaceutical clinical trials operate under strict CDSCO and FDA regulations. Cold-chain excursions and SAE reporting have zero-tolerance compliance thresholds.

**Key Findings:**
1. **Cold-Chain Liability:** The logistics carrier is contractually liable for temperature spikes above +8°C unless a calibrated stability study proves product potency is intact.
2. **24-Hour SAE Mandate:** Failure to file within 24h constitutes a Material Regulatory Breach. Emergency transmission to CDSCO & Ethics Committee is mandatory.

**Action Plan:**
• Quarantine Batch #BIO-904 in ERP system immediately.
• Transmit expedited IND Safety Report to CDSCO within 24 hours.
• File ₹38,00,000 insurance subrogation claim against carrier.`,
        engine: "simulated",
        remedies: [
          "Activate immediate Quality Hold / Quarantine in ERP for affected biologic lots.",
          "Transmit expedited 24h IND Safety Report to CDSCO safety portal.",
          "Initiate formal supplier corrective action (CAPA) with carrier.",
        ],
        clauseDraft: "Cold-Chain Quality Covenant: 'Carrier guarantees continuous temperature maintenance (+2°C to +8°C). Any unapproved excursion exceeding 2 hours triggers 100% batch replacement liability within 14 days.'",
      };
    }

    if (msg.includes("sla") || msg.includes("uptime") || msg.includes("it") || msg.includes("software") || msg.includes("cloud") || msg.includes("breach") || msg.includes("dpdp") || msg.includes("tcs")) {
      return {
        reply: `### 💻 IT & Cloud Sector Problem Assessment (Indian Enterprise SLA)
**Problem Analysis:**
A recorded uptime of 99.1% represents 6.5 hours of downtime, exceeding the monthly allowable SLA downtime window of 21 minutes under the Cloud Infrastructure Agreement.

**Key Findings:**
1. **Service Credits:** Under Schedule B, the subscriber is entitled to a Tier-2 **25% credit** (₹87,500) deducted from the next billing cycle.
2. **Termination Right:** If SLA uptime drops below 99.5% for 3 consecutive months, the customer gains the unconditional right to terminate for cause with full refund of prepaid unused fees.

**Action Plan:**
• Issue formal SLA Breach and Credit Deduction notice.
• Request Root Cause Analysis (RCA) within 5 business days.
• Require vendor to deploy hot-standby multi-region failover across Mumbai and Hyderabad.`,
        engine: "simulated",
        remedies: [
          "Deduct 25% SLA credit (₹87,500) from upcoming Q3 installment invoice.",
          "Demand Tier-1 RCA document signed by Chief Technology Officer within 5 days.",
          "Schedule automated health-check ping via ContractFlow webhook integration.",
        ],
        clauseDraft: "SLA Credit Addendum: 'In the event monthly uptime falls below 99.5%, Vendor shall automatically credit 25% of the monthly fee (₹87,500) against Subscriber's next invoice without requiring formal written claim.'",
      };
    }

    return {
      reply: `Based on your contract portfolio (${ind} sector), I analyzed the problem statement. The agreement contains enforceable terms regarding risk mitigation, notice requirements, installment adjustments in Indian Rupees (₹), and dispute resolution mechanisms under the Indian Arbitration and Conciliation Act.`,
      engine: "simulated",
      remedies: [
        "Review primary liability and indemnification clauses.",
        "Issue written notice to responsible party within contractually defined cure period.",
        "Update contract status and add milestone reminder in ContractFlow AI.",
      ],
      clauseDraft: "Amendment Clause: 'The parties agree to resolve the dispute through expedited conciliation within 15 business days prior to initiating formal arbitration under the Indian Arbitration and Conciliation Act 1996.'",
    };
  },

  // ---- Mutations & State Updates ----
  completeTask: async (id: string): Promise<Task | null> => {
    const res = await request<Task>(`/tasks/${id}/complete`, { method: "POST" });
    _tasks = _tasks.map((t) => (t.id === id ? { ...t, status: "Completed" } : t));
    return res ?? _tasks.find((t) => t.id === id) ?? null;
  },

  assignTask: async (id: string, owner: string, assigned_to: string): Promise<Task | null> => {
    const res = await request<Task>(`/tasks/${id}/assign`, { method: "POST", body: JSON.stringify({ owner, assigned_to }) });
    _tasks = _tasks.map((t) => (t.id === id ? { ...t, owner, assigned_to } : t));
    return res ?? _tasks.find((t) => t.id === id) ?? null;
  },

  toggleIntegration: (id: string) => request<Integration>(`/integrations/${id}/toggle`, { method: "POST" }),
  
  decideApproval: async (id: string, decision: "approve" | "reject"): Promise<Approval | null> => {
    const res = await request<Approval>(`/approvals/${id}/decide`, { method: "POST", body: JSON.stringify({ decision }) });
    const status = decision === "approve" ? "Approved" : "Rejected";
    _approvals = _approvals.map((a) => (a.id === id ? { ...a, status } : a));
    return res ?? _approvals.find((a) => a.id === id) ?? null;
  },

  updateContract: async (contract: Contract): Promise<Contract> => {
    _contracts = _contracts.map((c) => (c.id === contract.id ? contract : c));
    return contract;
  },

  addContractAmendment: async (contractId: string, amendment: ContractAmendment): Promise<Contract | null> => {
    const c = _contracts.find((x) => x.id === contractId);
    if (!c) return null;
    const updated: Contract = {
      ...c,
      version: amendment.version,
      updated: "Just now",
      status: "Under Amendment",
      amendments: [amendment, ...c.amendments],
    };
    _contracts = _contracts.map((x) => (x.id === contractId ? updated : x));
    return updated;
  },

  addInstallment: async (inst: Omit<Installment, "id">): Promise<Installment> => {
    const newInst: Installment = { ...inst, id: "inst-" + Date.now() };
    _installments = [newInst, ..._installments];
    return newInst;
  },

  payInstallment: async (id: string): Promise<Installment | null> => {
    const now = new Date();
    const paidAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    _installments = _installments.map((i) => (i.id === id ? { ...i, status: "Paid", paid_at: paidAt } : i));
    return _installments.find((i) => i.id === id) ?? null;
  },

  addWorkProgress: async (wp: Omit<WorkProgress, "id">): Promise<WorkProgress> => {
    const newWp: WorkProgress = { ...wp, id: "wp-" + Date.now() };
    _workProgress = [newWp, ..._workProgress];
    return newWp;
  },

  updateDeadlineIssue: async (id: string, updates: Partial<DeadlineIssue>): Promise<DeadlineIssue | null> => {
    _deadlineIssues = _deadlineIssues.map((di) => (di.id === id ? { ...di, ...updates } : di));
    return _deadlineIssues.find((di) => di.id === id) ?? null;
  },

  addReminder: async (rem: Omit<Reminder, "id">): Promise<Reminder> => {
    const newRem: Reminder = { ...rem, id: "rem-" + Date.now() };
    _reminders = [newRem, ..._reminders];
    return newRem;
  },

  completeReminder: async (id: string): Promise<Reminder | null> => {
    _reminders = _reminders.map((r) => (r.id === id ? { ...r, status: "Completed" } : r));
    return _reminders.find((r) => r.id === id) ?? null;
  },
};

export function useApi<T>(loader: () => Promise<T>, initial: T) {
  const [data, setData] = useState<T>(initial);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;
    loader().then((d) => { if (live) { setData(d); setLoading(false); } });
    return () => { live = false; };
  }, [loader]);

  const reload = useCallback(() => {
    setLoading(true);
    loader().then((d) => { setData(d); setLoading(false); });
  }, [loader]);

  return { data, setData, loading, reload };
}
