import type { Approval, AuditEvent, Clause, Contract, Integration, Task } from "./types.js";

export const contracts: Contract[] = [
  { id: "c1", name: "Vendor Master Agreement", type: "Vendor", status: "Active", risk: "Low", compliance: 88, updated: "Sep 18, 2026", clauses_detected: 14 },
  { id: "c2", name: "Cloud Services Agreement", type: "Services", status: "Active", risk: "Low", compliance: 89, updated: "Sep 17, 2026", clauses_detected: 14 },
  { id: "c3", name: "Software License", type: "License", status: "Active", risk: "High", compliance: 90, updated: "Sep 16, 2026", clauses_detected: 14 },
  { id: "c4", name: "Facilities Contract", type: "Facilities", status: "Active", risk: "Low", compliance: 91, updated: "Sep 15, 2026", clauses_detected: 14 },
  { id: "c5", name: "Security Services", type: "Services", status: "Active", risk: "Low", compliance: 92, updated: "Sep 14, 2026", clauses_detected: 14 },
  { id: "c6", name: "Marketing Retainer", type: "Retainer", status: "Active", risk: "Low", compliance: 93, updated: "Sep 13, 2026", clauses_detected: 14 },
];

export const clauses: Clause[] = [
  { id: "cl1", contract_id: "c1", type: "Payment Terms", party: "Finance Team", deadline: "10 days", risk: "Low", status: "Active" },
  { id: "cl2", contract_id: "c1", type: "Security Compliance", party: "Vendor", deadline: "30 days", risk: "High", status: "Pending" },
  { id: "cl3", contract_id: "c1", type: "Monthly Reporting", party: "Vendor Manager", deadline: "5th monthly", risk: "Medium", status: "Active" },
  { id: "cl4", contract_id: "c1", type: "Contract Renewal", party: "Legal Team", deadline: "30 days before expiry", risk: "High", status: "Upcoming" },
];

export const tasks: Task[] = [
  { id: "t1", contract_id: "c1", title: "Submit Monthly Compliance Report", owner: "Vendor Manager", due: "Sep 30", priority: "High", status: "Pending" },
  { id: "t2", contract_id: "c1", title: "Review Contract Renewal", owner: "Legal Team", due: "Oct 15", priority: "High", status: "Awaiting Approval" },
  { id: "t3", contract_id: "c1", title: "Verify Service Availability Evidence", owner: "Compliance", due: "Oct 05", priority: "Medium", status: "Pending" },
  { id: "t4", contract_id: "c1", title: "Process Vendor Invoice", owner: "Finance Team", due: "Sep 28", priority: "Low", status: "Completed" },
];

export const audit: AuditEvent[] = [
  { id: "a1", time: "09:42", event: "Contract uploaded", actor: "Ganesh", created_at: "2026-09-22T09:42:00Z" },
  { id: "a2", time: "09:43", event: "AI analysis completed", actor: "ContractFlow AI", created_at: "2026-09-22T09:43:00Z" },
  { id: "a3", time: "09:44", event: "14 obligations extracted", actor: "ContractFlow AI", created_at: "2026-09-22T09:44:00Z" },
  { id: "a4", time: "09:45", event: "6 tasks created", actor: "ContractFlow AI", created_at: "2026-09-22T09:45:00Z" },
  { id: "a5", time: "09:47", event: "Vendor manager notified", actor: "ContractFlow AI", created_at: "2026-09-22T09:47:00Z" },
  { id: "a6", time: "10:02", event: "Compliance document uploaded", actor: "Vendor Manager", created_at: "2026-09-22T10:02:00Z" },
  { id: "a7", time: "10:03", event: "AI verified evidence", actor: "ContractFlow AI", created_at: "2026-09-22T10:03:00Z" },
  { id: "a8", time: "10:04", event: "Task completed", actor: "Vendor Manager", created_at: "2026-09-22T10:04:00Z" },
];

export const integrations: Integration[] = [
  { id: "i1", name: "Google Calendar", kind: "calendar", connected: false },
  { id: "i2", name: "Slack", kind: "chat", connected: false },
  { id: "i3", name: "Microsoft Teams", kind: "chat", connected: false },
  { id: "i4", name: "Email", kind: "email", connected: false },
  { id: "i5", name: "CRM", kind: "crm", connected: false },
  { id: "i6", name: "ERP", kind: "erp", connected: false },
  { id: "i7", name: "REST API", kind: "api", connected: false },
  { id: "i8", name: "Webhook", kind: "webhook", connected: false },
];

export const approvals: Approval[] = [
  {
    id: "ap1",
    title: "Renew Vendor Agreement",
    recommendation: "Review before renewal",
    risk: "High",
    reason: "Contract contains a revised liability clause.",
    status: "Awaiting Approval",
  },
];

export const complianceTimeline = [
  { date: "Sep 18", label: "Monthly reporting", status: "Completed" },
  { date: "Sep 22", label: "Security evidence", status: "Completed" },
  { date: "Sep 28", label: "Vendor invoice", status: "Pending" },
  { date: "Sep 30", label: "Compliance report", status: "Pending" },
  { date: "Oct 15", label: "Renewal approval", status: "Awaiting approval" },
];
