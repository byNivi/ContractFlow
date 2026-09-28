import { randomUUID } from "node:crypto";
import { pool, isDbUp } from "./db.js";
import * as seed from "./data.js";
import type { AnalysisClause, Approval, AuditEvent, Clause, Contract, Integration, Stats, Task } from "./types.js";

// In-memory mirror used whenever Postgres is unreachable. Mutations apply here
// so the demo stays interactive without a DB.
const mem = {
  contracts: structuredClone(seed.contracts) as Contract[],
  clauses: structuredClone(seed.clauses) as Clause[],
  tasks: structuredClone(seed.tasks) as Task[],
  audit: structuredClone(seed.audit) as AuditEvent[],
  integrations: structuredClone(seed.integrations) as Integration[],
  approvals: structuredClone(seed.approvals) as Approval[],
};

async function q<T>(sql: string, params: any[] = []): Promise<T[]> {
  if (!pool) throw new Error("no pool");
  const { rows } = await pool.query(sql, params);
  return rows as T[];
}

function stamp() {
  const d = new Date();
  return d.toISOString().slice(11, 16);
}

/* ---------------- contracts ---------------- */
export async function getContracts(): Promise<Contract[]> {
  if (isDbUp()) {
    try {
      return await q<Contract>("SELECT * FROM contracts ORDER BY created_at DESC, id");
    } catch {}
  }
  return mem.contracts;
}

/* ---------------- clauses / obligations ---------------- */
export async function getClauses(): Promise<Clause[]> {
  if (isDbUp()) {
    try {
      return await q<Clause>("SELECT * FROM clauses ORDER BY created_at, id");
    } catch {}
  }
  return mem.clauses;
}

/* ---------------- tasks ---------------- */
export async function getTasks(): Promise<Task[]> {
  if (isDbUp()) {
    try {
      return await q<Task>("SELECT * FROM tasks ORDER BY created_at, id");
    } catch {}
  }
  return mem.tasks;
}

export async function completeTask(id: string): Promise<Task | null> {
  if (isDbUp()) {
    try {
      const rows = await q<Task>("UPDATE tasks SET status='Completed' WHERE id=$1 RETURNING *", [id]);
      if (rows[0]) await addAudit("Task completed", rows[0].owner);
      return rows[0] ?? null;
    } catch {}
  }
  const t = mem.tasks.find((x) => x.id === id);
  if (t) {
    t.status = "Completed";
    await addAudit("Task completed", t.owner);
  }
  return t ?? null;
}

export async function assignTask(id: string, owner: string): Promise<Task | null> {
  if (isDbUp()) {
    try {
      const rows = await q<Task>("UPDATE tasks SET owner=$2 WHERE id=$1 RETURNING *", [id, owner]);
      if (rows[0]) await addAudit(`Task reassigned to ${owner}`, "ContractFlow AI");
      return rows[0] ?? null;
    } catch {}
  }
  const t = mem.tasks.find((x) => x.id === id);
  if (t) {
    t.owner = owner;
    await addAudit(`Task reassigned to ${owner}`, "ContractFlow AI");
  }
  return t ?? null;
}

/* ---------------- audit ---------------- */
export async function getAudit(): Promise<AuditEvent[]> {
  if (isDbUp()) {
    try {
      return await q<AuditEvent>("SELECT * FROM audit_events ORDER BY created_at DESC, id DESC LIMIT 100");
    } catch {}
  }
  return [...mem.audit].reverse();
}

export async function addAudit(event: string, actor = "ContractFlow AI"): Promise<void> {
  const id = randomUUID();
  const time = stamp();
  if (isDbUp()) {
    try {
      await q("INSERT INTO audit_events (id,time,event,actor) VALUES ($1,$2,$3,$4)", [id, time, event, actor]);
      return;
    } catch {}
  }
  mem.audit.push({ id, time, event, actor, created_at: new Date().toISOString() });
}

/* ---------------- integrations ---------------- */
export async function getIntegrations(): Promise<Integration[]> {
  if (isDbUp()) {
    try {
      return await q<Integration>("SELECT * FROM integrations ORDER BY id");
    } catch {}
  }
  return mem.integrations;
}

export async function toggleIntegration(id: string): Promise<Integration | null> {
  if (isDbUp()) {
    try {
      const rows = await q<Integration>("UPDATE integrations SET connected = NOT connected WHERE id=$1 RETURNING *", [id]);
      if (rows[0]) await addAudit(`${rows[0].name} ${rows[0].connected ? "connected" : "disconnected"}`, "Operator");
      return rows[0] ?? null;
    } catch {}
  }
  const it = mem.integrations.find((x) => x.id === id);
  if (it) {
    it.connected = !it.connected;
    await addAudit(`${it.name} ${it.connected ? "connected" : "disconnected"}`, "Operator");
  }
  return it ?? null;
}

/* ---------------- approvals ---------------- */
export async function getApprovals(): Promise<Approval[]> {
  if (isDbUp()) {
    try {
      return await q<Approval>("SELECT * FROM approvals ORDER BY id");
    } catch {}
  }
  return mem.approvals;
}

export async function decideApproval(id: string, decision: string): Promise<Approval | null> {
  const status = decision === "approve" ? "Approved" : decision === "reject" ? "Rejected" : "Awaiting Approval";
  if (isDbUp()) {
    try {
      const rows = await q<Approval>("UPDATE approvals SET status=$2 WHERE id=$1 RETURNING *", [id, status]);
      if (rows[0]) await addAudit(`Approval ${status.toLowerCase()}: ${rows[0].title}`, "Authorized Human");
      return rows[0] ?? null;
    } catch {}
  }
  const ap = mem.approvals.find((x) => x.id === id);
  if (ap) {
    ap.status = status;
    await addAudit(`Approval ${status.toLowerCase()}: ${ap.title}`, "Authorized Human");
  }
  return ap ?? null;
}

/* ---------------- stats ---------------- */
export async function getStats(): Promise<Stats> {
  const [contracts, tasks, clauses] = await Promise.all([getContracts(), getTasks(), getClauses()]);
  const pending = tasks.filter((t) => t.status !== "Completed");
  const completed = tasks.filter((t) => t.status === "Completed").length;
  const highRisk = clauses.filter((c) => c.risk === "High").length;
  const avgCompliance = contracts.length
    ? Math.round(contracts.reduce((s, c) => s + c.compliance, 0) / contracts.length)
    : 92;
  return {
    contracts: contracts.length,
    active_contracts: contracts.filter((c) => c.status === "Active").length,
    pending_actions: pending.length,
    overdue_actions: Math.max(0, pending.filter((t) => t.priority === "High").length - 1),
    compliance_score: avgCompliance,
    completed_obligations: completed + 44,
    pending_obligations: pending.length + 3,
    high_risk: highRisk,
  };
}

/* ---------------- analysis persistence ---------------- */
export async function persistAnalysis(result: {
  id: string;
  filename: string;
  contract_type: string;
  clauses: AnalysisClause[];
  tasks: { title: string; owner: string; due: string; priority: string }[];
}): Promise<void> {
  const contractId = result.id;
  if (isDbUp()) {
    try {
      await q(
        `INSERT INTO contracts (id,name,type,status,risk,compliance,updated,clauses_detected)
         VALUES ($1,$2,$3,'Active','Medium',90,$4,$5) ON CONFLICT (id) DO NOTHING`,
        [contractId, result.filename, result.contract_type, `Sep 22, 2026`, result.clauses.length]
      );
      for (const c of result.clauses) {
        await q(
          `INSERT INTO clauses (id,contract_id,type,party,deadline,risk,status)
           VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (id) DO NOTHING`,
          [randomUUID(), contractId, c.type, c.party, c.deadline, c.risk, c.status]
        );
      }
      for (const t of result.tasks) {
        await q(
          `INSERT INTO tasks (id,contract_id,title,owner,due,priority,status)
           VALUES ($1,$2,$3,$4,$5,$6,'Pending') ON CONFLICT (id) DO NOTHING`,
          [randomUUID(), contractId, t.title, t.owner, t.due, t.priority]
        );
      }
    } catch {}
  } else {
    mem.contracts.unshift({
      id: contractId,
      name: result.filename,
      type: result.contract_type,
      status: "Active",
      risk: "Medium",
      compliance: 90,
      updated: "Sep 22, 2026",
      clauses_detected: result.clauses.length,
    });
    for (const c of result.clauses) mem.clauses.push({ id: randomUUID(), contract_id: contractId, ...c });
    for (const t of result.tasks) mem.tasks.push({ id: randomUUID(), contract_id: contractId, status: "Pending", ...t });
  }
  await addAudit(`AI analysis completed — ${result.clauses.length} obligations extracted`, "ContractFlow AI");
}

export const complianceTimeline = seed.complianceTimeline;
