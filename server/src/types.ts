export interface Contract {
  id: string;
  name: string;
  type: string;
  status: string;
  risk: string;
  compliance: number;
  updated: string;
  clauses_detected: number;
}

export interface Clause {
  id: string;
  contract_id: string | null;
  type: string;
  party: string;
  deadline: string;
  risk: string;
  status: string;
}

export interface Task {
  id: string;
  contract_id: string | null;
  title: string;
  owner: string;
  due: string;
  priority: string;
  status: string;
}

export interface AuditEvent {
  id: string;
  time: string;
  event: string;
  actor: string;
  created_at: string;
}

export interface Integration {
  id: string;
  name: string;
  kind: string;
  connected: boolean;
}

export interface Approval {
  id: string;
  title: string;
  recommendation: string;
  risk: string;
  reason: string;
  status: string;
}

export interface Stats {
  contracts: number;
  active_contracts: number;
  pending_actions: number;
  overdue_actions: number;
  compliance_score: number;
  completed_obligations: number;
  pending_obligations: number;
  high_risk: number;
}

export interface AnalysisClause {
  type: string;
  party: string;
  deadline: string;
  risk: string;
  status: string;
}

export interface AnalysisResult {
  id: string;
  filename: string;
  contract_type: string;
  status: string;
  risk: string;
  confidence: number;
  summary: string;
  important_dates: number;
  clauses: AnalysisClause[];
  tasks: { title: string; owner: string; due: string; priority: string }[];
  workflow: string[];
  next_steps: string[];
  engine: "llm" | "simulated";
}

export interface ChatMessage {
  role: "user" | "assistant" | "model";
  content: string;
}

export interface CopilotChatRequest {
  message: string;
  history?: ChatMessage[];
  contractContext?: string;
}

export interface CopilotChatResponse {
  reply: string;
  model?: string;
  engine: "gemini" | "simulated";
}

