import type { Approval, AuditEvent, Clause, Contract, Integration, Task } from "./types.js";

export const contracts: Contract[] = [
  { id: "c1", name: "Tata Consultancy Services (TCS) Master Agreement", type: "Vendor MSA", status: "Active", risk: "Low", compliance: 94, updated: "Sep 28, 2026", clauses_detected: 14 },
  { id: "c2", name: "Infosys Cloud Infrastructure & Security SLA", type: "Services SLA", status: "Active", risk: "Medium", compliance: 89, updated: "Sep 27, 2026", clauses_detected: 11 },
  { id: "c3", name: "L&T Metro Civil EPC Construction Contract", type: "FIDIC EPC", status: "Under Amendment", risk: "High", compliance: 84, updated: "Sep 26, 2026", clauses_detected: 18 },
  { id: "c4", name: "Sun Pharma Clinical Trial Research Agreement", type: "Clinical / Regulatory", status: "Active", risk: "Medium", compliance: 96, updated: "Sep 25, 2026", clauses_detected: 16 },
  { id: "c5", name: "Mahindra Automated Assembly Line Supply Agreement", type: "Manufacturing Supply", status: "Active", risk: "Low", compliance: 95, updated: "Sep 24, 2026", clauses_detected: 12 },
  { id: "c6", name: "HDFC Bank Syndicated Term Loan & Credit Facility", type: "Banking Covenant", status: "Active", risk: "High", compliance: 91, updated: "Sep 22, 2026", clauses_detected: 20 },
];

export const clauses: Clause[] = [
  { id: "cl1", contract_id: "c1", type: "Payment Terms (Net 30 GST)", party: "Finance Team", deadline: "10 days", risk: "Low", status: "Active" },
  { id: "cl2", contract_id: "c1", type: "Security Compliance (SOC 2 & DPDP)", party: "Vendor", deadline: "30 days", risk: "High", status: "Pending" },
  { id: "cl3", contract_id: "c1", type: "Monthly Reporting", party: "Vendor Manager", deadline: "5th monthly", risk: "Medium", status: "Active" },
  { id: "cl4", contract_id: "c1", type: "Contract Renewal", party: "Legal Team", deadline: "30 days before expiry", risk: "High", status: "Upcoming" },
];

export const tasks: Task[] = [
  { id: "t1", contract_id: "c1", title: "Submit Monthly Vendor GST Compliance Report", owner: "Ananya Deshmukh", due: "Sep 30", priority: "High", status: "Pending" },
  { id: "t2", contract_id: "c1", title: "Review Contract Renewal & SLA Terms", owner: "Rohan Mukherjee", due: "Oct 15", priority: "High", status: "Awaiting Approval" },
  { id: "t3", contract_id: "c3", title: "Inspect Substructure Piling Quality on Site", owner: "Priya Sharma", due: "Oct 05", priority: "High", status: "Pending" },
  { id: "t4", contract_id: "c1", title: "Process Q3 Software Hosting Invoice via RTGS", owner: "Ananya Deshmukh", due: "Sep 28", priority: "Low", status: "Completed" },
];

export const audit: AuditEvent[] = [
  { id: "a1", time: "09:42", event: "Contract uploaded: L&T Metro Civil EPC Contract", actor: "Priya Sharma", created_at: "2026-09-22T09:42:00Z" },
  { id: "a2", time: "09:43", event: "AI analysis completed (Gemini 3.x Flash)", actor: "ContractFlow AI", created_at: "2026-09-22T09:43:00Z" },
  { id: "a3", time: "09:44", event: "18 obligations & 4 milestone installments extracted (₹2.85 Cr)", actor: "ContractFlow AI", created_at: "2026-09-22T09:44:00Z" },
  { id: "a4", time: "09:45", event: "Tasks assigned to department leads", actor: "ContractFlow AI", created_at: "2026-09-22T09:45:00Z" },
  { id: "a5", time: "09:47", event: "Ananya Deshmukh notified of GST filing deadline", actor: "ContractFlow AI", created_at: "2026-09-22T09:47:00Z" },
  { id: "a6", time: "10:02", event: "Compliance document uploaded", actor: "Ananya Deshmukh", created_at: "2026-09-22T10:02:00Z" },
  { id: "a7", time: "10:03", event: "AI verified evidence against DPDP Act standards", actor: "ContractFlow AI", created_at: "2026-09-22T10:03:00Z" },
  { id: "a8", time: "10:04", event: "Milestone payment of ₹3,50,000 verified", actor: "Ananya Deshmukh", created_at: "2026-09-22T10:04:00Z" },
];

export const integrations: Integration[] = [
  { id: "i1", name: "Google Calendar", kind: "calendar", connected: true },
  { id: "i2", name: "Slack", kind: "chat", connected: true },
  { id: "i3", name: "Microsoft Teams", kind: "chat", connected: false },
  { id: "i4", name: "Email Notifications", kind: "email", connected: true },
  { id: "i5", name: "Zoho / Salesforce CRM", kind: "crm", connected: false },
  { id: "i6", name: "SAP & Tally ERP", kind: "erp", connected: true },
  { id: "i7", name: "REST API Gateway", kind: "api", connected: true },
  { id: "i8", name: "Webhook", kind: "webhook", connected: false },
];

export const approvals: Approval[] = [
  {
    id: "ap1",
    title: "Approve L&T Civil EPC Monsoon Weather EOT Addendum",
    recommendation: "Review before signing — revised force majeure penalty waiver requested.",
    risk: "High",
    reason: "Contractor requested 21 days extension due to extreme monsoons in Mumbai.",
    status: "Awaiting Approval",
  },
];

export const complianceTimeline = [
  { date: "Sep 20", label: "Sun Pharma Milestone 1 Patient Enrollment", status: "Overdue" },
  { date: "Sep 24", label: "Mahindra Assembly FAT Sign-off", status: "Completed" },
  { date: "Sep 28", label: "TCS Q3 GST Invoice Processing", status: "Completed" },
  { date: "Sep 30", label: "Monthly Vendor Compliance Report", status: "Pending" },
  { date: "Oct 15", label: "Infosys Cloud Infrastructure SLA Renewal", status: "Awaiting approval" },
];
