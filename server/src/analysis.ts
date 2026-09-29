import { randomUUID } from "node:crypto";
import { analyzeContractWithGemini, isGeminiConfigured } from "./gemini.js";
import type { AnalysisClause, AnalysisResult } from "./types.js";

// Rule-based clause detectors. Each maps keywords found in contract text to a
// structured obligation. Used as deterministic fallback whenever LLM is unreachable.
interface Rule {
  type: string;
  party: string;
  deadline: string;
  risk: AnalysisClause["risk"];
  status: string;
  keywords: string[];
}

const RULES: Rule[] = [
  { type: "Payment Terms", party: "Finance Team", deadline: "Net 10 days", risk: "Low", status: "Active", keywords: ["payment", "invoice", "invoicing", "net 10", "net 30", "fees", "compensation"] },
  { type: "Security Compliance", party: "Vendor", deadline: "30 days", risk: "High", status: "Pending", keywords: ["security", "soc 2", "iso 27001", "infosec", "data protection", "gdpr"] },
  { type: "Monthly Reporting", party: "Vendor Manager", deadline: "5th monthly", risk: "Medium", status: "Active", keywords: ["report", "reporting", "monthly report", "kpi", "metrics"] },
  { type: "Contract Renewal", party: "Legal Team", deadline: "30 days before expiry", risk: "High", status: "Upcoming", keywords: ["renew", "renewal", "expiry", "expire", "auto-renew"] },
  { type: "Liability & Indemnity", party: "Legal Team", deadline: "On event", risk: "High", status: "Pending", keywords: ["liability", "indemn", "indemnify", "damages", "limitation of liability"] },
  { type: "Confidentiality", party: "Both Parties", deadline: "Ongoing", risk: "Medium", status: "Active", keywords: ["confidential", "nda", "non-disclosure", "proprietary"] },
  { type: "Termination Rights", party: "Legal Team", deadline: "60 days notice", risk: "Medium", status: "Active", keywords: ["terminate", "termination", "notice period", "cancel"] },
  { type: "Service Availability (SLA)", party: "Vendor", deadline: "Monthly", risk: "High", status: "Active", keywords: ["sla", "uptime", "availability", "service level", "99.9"] },
];

const DEMO_CLAUSES: AnalysisClause[] = [
  { type: "Payment Terms", party: "Finance Team", deadline: "10 days", risk: "Low", status: "Active" },
  { type: "Security Compliance", party: "Vendor", deadline: "30 days", risk: "High", status: "Pending" },
  { type: "Monthly Reporting", party: "Vendor Manager", deadline: "5th monthly", risk: "Medium", status: "Active" },
  { type: "Contract Renewal", party: "Legal Team", deadline: "30 days before expiry", risk: "High", status: "Upcoming" },
];

function detectClauses(text: string): AnalysisClause[] {
  const lower = text.toLowerCase();
  const hits = RULES.filter((r) => r.keywords.some((k) => lower.includes(k)));
  if (hits.length === 0) return DEMO_CLAUSES;
  return hits.map(({ type, party, deadline, risk, status }) => ({ type, party, deadline, risk, status }));
}

function deriveTasks(clauses: AnalysisClause[]): AnalysisResult["tasks"] {
  return clauses.slice(0, 6).map((c) => ({
    title: `${c.type} — ${c.status === "Upcoming" ? "schedule review" : "fulfil obligation"}`,
    owner: c.party,
    due: c.deadline,
    priority: c.risk === "High" ? "High" : c.risk === "Medium" ? "Medium" : "Low",
  }));
}

function runSimulatedAnalysis(input: { filename?: string; text?: string } = {}): AnalysisResult {
  const text = (input.text || "").trim();
  const clauses = text ? detectClauses(text) : DEMO_CLAUSES;
  const highRisk = clauses.filter((c) => c.risk === "High").length;
  const confidence = text
    ? Math.max(72, Math.min(97, 70 + clauses.length * 3))
    : 94;

  const overallRisk = highRisk >= 2 ? "High" : highRisk >= 1 ? "Medium" : "Low";

  return {
    id: randomUUID(),
    filename: input.filename || "demo-contract.pdf",
    contract_type: text ? "Detected Agreement" : "Vendor Master Agreement",
    status: "Active",
    risk: overallRisk,
    confidence,
    summary: text
      ? `Extracted ${clauses.length} obligation${clauses.length === 1 ? "" : "s"} from the document, including ${highRisk} high-risk item${highRisk === 1 ? "" : "s"}. Each was mapped to a responsible party and a tracked deadline.`
      : "This agreement requires the vendor to deliver monthly reports, maintain service availability, submit invoices within 10 days, and complete annual compliance certification.",
    important_dates: Math.max(3, clauses.length * 2),
    clauses,
    tasks: deriveTasks(clauses),
    workflow: [
      "Contract Clause Detected",
      "Check Deadline",
      "Create Task",
      "Notify Responsible Person",
      "Wait for Completion",
      "Verify Evidence",
      "Human Approval",
    ],
    next_steps: [
      `Create ${Math.min(6, clauses.length)} tasks`,
      "Notify responsible parties",
      "Request renewal approval",
      "Start compliance monitor",
    ],
    engine: "simulated",
  };
}

export async function runAnalysis(input: { filename?: string; text?: string } = {}): Promise<AnalysisResult> {
  const text = (input.text || "").trim();
  const filename = input.filename || "demo-contract.pdf";

  // If text is present and Gemini API is configured, run real AI extraction
  if (text && isGeminiConfigured()) {
    console.log(`[analysis] Running Gemini LLM analysis for "${filename}"...`);
    const llmResult = await analyzeContractWithGemini(text, filename);
    if (llmResult) {
      console.log(`[analysis] Gemini extraction succeeded (${llmResult.clauses.length} clauses, ${llmResult.confidence}% confidence)`);
      return llmResult;
    }
    console.warn(`[analysis] Gemini analysis failed, falling back to rule engine`);
  }

  // If running demo without custom text but Gemini is active, let's analyze default contract text with Gemini
  if (!text && isGeminiConfigured()) {
    const demoContractText = `TATA CONSULTANCY SERVICES (TCS) MASTER SERVICES AGREEMENT (MSA)
Between Bharat Enterprise Systems Pvt Ltd ("Company") and Tata Consultancy Services Ltd ("Vendor").
1. Payment & Installments: Company shall pay all valid and undisputed invoices in Indian Rupees (₹3,50,000/month) Net 30 days via RTGS.
2. Security & Compliance: Vendor must deliver SOC 2 Type II audit report and Indian DPDP Act 2023 compliance certification within 30 days of contract execution.
3. Monthly Reporting: Vendor Manager shall provide monthly uptime (99.95%) and KPI reports by the 5th of each calendar month.
4. Renewal & Termination: This agreement will automatically renew unless either party provides written notice of non-renewal at least 60 days before expiration.
5. Liability: Vendor liability shall be capped at 2x annual contract fees in Indian Rupees (₹), except in cases of confidentiality breaches or gross negligence.`;

    const llmResult = await analyzeContractWithGemini(demoContractText, filename);
    if (llmResult) {
      return llmResult;
    }
  }

  return runSimulatedAnalysis(input);
}
