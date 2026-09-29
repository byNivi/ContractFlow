// Shared types + local fallback data for ContractFlow AI
// Configured with Indian Enterprise Names, Indian Rupee (₹) Currency, and Multi-Industry Domain Context.

export type UserRole = "boss" | "employee";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  department: string;
  avatarBg: string;
  avatarText: string;
  phone?: string;
}

export const USERS: UserProfile[] = [
  {
    id: "rajesh-boss",
    name: "Vikramaditya Singhania",
    email: "vikramaditya.singhania@enterprise.in",
    role: "boss",
    title: "Executive Director & Chief Legal Counsel",
    department: "Executive Board",
    avatarBg: "from-amber-500 to-orange-600",
    avatarText: "VS",
    phone: "+91 98201 44521",
  },
  {
    id: "emp-ananya",
    name: "Ananya Deshmukh",
    email: "ananya.deshmukh@enterprise.in",
    role: "employee",
    title: "Head of Procurement & Vendor Management",
    department: "Finance & Sourcing",
    avatarBg: "from-blue-500 to-cyan-500",
    avatarText: "AD",
    phone: "+91 98450 88219",
  },
  {
    id: "emp-rohan",
    name: "Rohan Mukherjee",
    email: "rohan.mukherjee@enterprise.in",
    role: "employee",
    title: "Lead Legal & Corporate Compliance Officer",
    department: "Legal & Regulatory Affairs",
    avatarBg: "from-violet-500 to-purple-600",
    avatarText: "RM",
    phone: "+91 97112 33490",
  },
  {
    id: "emp-priya",
    name: "Priya Sharma",
    email: "priya.sharma@enterprise.in",
    role: "employee",
    title: "Senior Operations & Infrastructure SLA Manager",
    department: "Projects & Operations",
    avatarBg: "from-emerald-500 to-teal-600",
    avatarText: "PS",
    phone: "+91 99304 55182",
  },
];

export interface ContractAmendment {
  version: string;
  date: string;
  time: string;
  note: string;
  updatedBy: string;
}

export interface Contract {
  id: string;
  name: string;
  type: string;
  status: "Active" | "Under Amendment" | "Pending Review" | "Terminated" | "Expired";
  risk: "Low" | "Medium" | "High";
  compliance: number;
  updated: string;
  clauses_detected: number;
  assigned_to: string; // user id
  assigned_name: string;
  value: string;
  industry: "IT & Cloud" | "Civil & Construction" | "Pharma & Biotech" | "Manufacturing" | "Finance & Banking";
  version: string;
  effective_date: string;
  expiry_date: string;
  summary?: string;
  amendments: ContractAmendment[];
}

export interface Clause {
  id: string;
  contract_id: string | null;
  type: string;
  party: string;
  deadline: string;
  risk: string;
  status: string;
  assigned_to?: string;
}

export interface Task {
  id: string;
  contract_id: string | null;
  contract_name?: string;
  title: string;
  owner: string;
  assigned_to: string; // user id
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
  contract_id?: string;
  assigned_to?: string;
  assigned_name?: string;
  due_date?: string;
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

export interface TimelineItem {
  date: string;
  label: string;
  status: string;
}

export interface Installment {
  id: string;
  contract_id: string;
  contract_name: string;
  milestone_name: string;
  amount: string;
  due_date: string;
  due_time: string;
  status: "Paid" | "Pending" | "Upcoming" | "Overdue";
  invoice_no: string;
  assigned_to: string;
  assigned_name: string;
  paid_at?: string;
  notes?: string;
}

export interface WorkProgress {
  id: string;
  employee_id: string;
  employee_name: string;
  contract_id: string;
  contract_name: string;
  milestone: string;
  progress_pct: number;
  hours_spent: number;
  updated_date: string;
  updated_time: string;
  status: "In Progress" | "Completed" | "Review Pending" | "Delayed";
  notes: string;
}

export interface DeadlineIssue {
  id: string;
  contract_id: string;
  contract_name: string;
  assigned_to: string;
  assigned_name: string;
  issue_title: string;
  deadline_date: string;
  deadline_time: string;
  days_left: number;
  risk_level: "Critical" | "High" | "Medium";
  category: "Vendor SLA Breach" | "Regulatory Filing" | "Payment Overdue" | "Renewal Notice Expiry" | "Compliance Evidence Missing";
  impact: string;
  status: "Open" | "Escalated" | "Resolved";
  mitigation_plan: string;
}

export interface Reminder {
  id: string;
  title: string;
  contract_id?: string;
  contract_name?: string;
  target_date: string;
  target_time: string;
  priority: "High" | "Medium" | "Low";
  recipient_role: "employee" | "boss" | "all";
  recipient_id?: string;
  recipient_name?: string;
  channel: "In-App & Email" | "Slack Alert" | "Teams Ping" | "SMS Urgent";
  status: "Active" | "Snoozed" | "Completed";
}

export interface EmployeeReport {
  employee_id: string;
  employee_name: string;
  title: string;
  department: string;
  total_contracts: number;
  completed_milestones: number;
  pending_milestones: number;
  on_time_rate_pct: number;
  compliance_score: number;
  total_hours: number;
  grade: "A+" | "A" | "B+" | "B";
  recent_activity: string;
}

export interface AnalysisClause {
  type: string;
  party: string;
  deadline: string;
  risk: string;
  status: string;
}

export interface AnalysisData {
  id: string;
  filename: string;
  contract_type: string;
  industry?: string;
  status: string;
  risk: string;
  confidence: number;
  summary: string;
  important_dates: number;
  clauses: AnalysisClause[];
  tasks: { title: string; owner: string; due: string; priority: string }[];
  installments_detected?: { milestone: string; amount: string; due: string; time: string }[];
  deadline_issues_detected?: { title: string; risk: string; reason: string }[];
  next_steps: string[];
  engine: "llm" | "simulated";
}

// -------------------------------------------------------------
// Seed Initial Data with Indian Context & INR (₹)
// -------------------------------------------------------------

export const localContracts: Contract[] = [
  {
    id: "c1",
    name: "Tata Consultancy Services (TCS) Master Agreement",
    type: "Vendor MSA",
    status: "Active",
    risk: "Low",
    compliance: 94,
    updated: "28 Sep, 2026",
    clauses_detected: 14,
    assigned_to: "emp-ananya",
    assigned_name: "Ananya Deshmukh",
    value: "₹42,50,000",
    industry: "IT & Cloud",
    version: "v1.3",
    effective_date: "2026-01-01",
    expiry_date: "2027-12-31",
    summary: "Comprehensive multi-year enterprise software MSA covering cloud hosting, Net 30 GST invoicing, quarterly SOC 2 reports, and 99.95% uptime SLA.",
    amendments: [
      { version: "v1.1", date: "2026-03-15", time: "11:20 AM", note: "Adjusted Net 30 payment schedule and monthly SLA penalty credit terms.", updatedBy: "Ananya Deshmukh" },
      { version: "v1.2", date: "2026-06-20", time: "03:45 PM", note: "Added Indian Digital Personal Data Protection (DPDP) Act compliance annexure.", updatedBy: "Vikramaditya Singhania" },
      { version: "v1.3", date: "2026-09-18", time: "02:15 PM", note: "Updated annual SOC 2 Type II audit delivery timeline.", updatedBy: "Rohan Mukherjee" },
    ],
  },
  {
    id: "c2",
    name: "Infosys Cloud Infrastructure & Security SLA",
    type: "Services SLA",
    status: "Active",
    risk: "Medium",
    compliance: 89,
    updated: "27 Sep, 2026",
    clauses_detected: 11,
    assigned_to: "emp-rohan",
    assigned_name: "Rohan Mukherjee",
    value: "₹68,00,000",
    industry: "IT & Cloud",
    version: "v2.0",
    effective_date: "2025-10-01",
    expiry_date: "2027-09-30",
    summary: "Cloud service SLA guaranteeing 99.95% availability across Mumbai & Hyderabad data centers with quarterly CERT-In vulnerability audits.",
    amendments: [
      { version: "v2.0", date: "2026-07-10", time: "10:00 AM", note: "Upgraded SLA target from 99.9% to 99.95% with active-active disaster recovery failover.", updatedBy: "Rohan Mukherjee" }
    ],
  },
  {
    id: "c3",
    name: "L&T Metro Civil EPC Construction Contract",
    type: "FIDIC EPC Contract",
    status: "Under Amendment",
    risk: "High",
    compliance: 84,
    updated: "26 Sep, 2026",
    clauses_detected: 18,
    assigned_to: "emp-priya",
    assigned_name: "Priya Sharma",
    value: "₹2,85,00,000",
    industry: "Civil & Construction",
    version: "v1.4",
    effective_date: "2026-02-15",
    expiry_date: "2028-05-30",
    summary: "FIDIC-based engineering, procurement, and construction contract with milestone installment payments, 5% retention money, and defect liability period.",
    amendments: [
      { version: "v1.4", date: "2026-09-12", time: "04:30 PM", note: "Granted 21 days Extension of Time (EOT) for Mumbai monsoon weather force majeure.", updatedBy: "Priya Sharma" }
    ],
  },
  {
    id: "c4",
    name: "Sun Pharma Clinical Trial Research Agreement",
    type: "Clinical / Regulatory",
    status: "Active",
    risk: "Medium",
    compliance: 96,
    updated: "25 Sep, 2026",
    clauses_detected: 16,
    assigned_to: "emp-ananya",
    assigned_name: "Ananya Deshmukh",
    value: "₹1,35,00,000",
    industry: "Pharma & Biotech",
    version: "v1.1",
    effective_date: "2026-03-01",
    expiry_date: "2027-08-31",
    summary: "Phase III regulatory clinical study complying with CDSCO and US FDA 21 CFR standards. Includes strict 24h SAE notifications and cold-chain logging.",
    amendments: [
      { version: "v1.1", date: "2026-08-04", time: "01:10 PM", note: "Added expedited 24-hour Serious Adverse Event reporting protocol.", updatedBy: "Ananya Deshmukh" }
    ],
  },
  {
    id: "c5",
    name: "Mahindra Automated Assembly Line Supply Agreement",
    type: "Manufacturing Supply",
    status: "Active",
    risk: "Low",
    compliance: 95,
    updated: "24 Sep, 2026",
    clauses_detected: 12,
    assigned_to: "emp-priya",
    assigned_name: "Priya Sharma",
    value: "₹92,00,000",
    industry: "Manufacturing",
    version: "v1.0",
    effective_date: "2026-04-10",
    expiry_date: "2027-04-09",
    summary: "Robotics supply agreement with Incoterms 2020 DDP Pune delivery, ISO 2859-1 quality inspection, and 24-month OEM warranty.",
    amendments: [],
  },
  {
    id: "c6",
    name: "HDFC Bank Syndicated Term Loan & Credit Facility",
    type: "Banking Covenant",
    status: "Active",
    risk: "High",
    compliance: 91,
    updated: "22 Sep, 2026",
    clauses_detected: 20,
    assigned_to: "emp-rohan",
    assigned_name: "Rohan Mukherjee",
    value: "₹5,00,00,000",
    industry: "Finance & Banking",
    version: "v1.2",
    effective_date: "2025-11-15",
    expiry_date: "2030-11-14",
    summary: "Corporate syndicated loan agreement with quarterly DSCR ratio certification (1.25x minimum) and cross-default covenants.",
    amendments: [
      { version: "v1.2", date: "2026-05-18", time: "09:15 AM", note: "Updated RBI Repo rate benchmark spread calculation.", updatedBy: "Rohan Mukherjee" }
    ],
  },
];

export const localClauses: Clause[] = [
  { id: "cl1", contract_id: "c1", type: "Payment Terms (Net 30 GST)", party: "Finance Team", deadline: "10 days", risk: "Low", status: "Active", assigned_to: "emp-ananya" },
  { id: "cl2", contract_id: "c1", type: "Security Compliance (SOC 2)", party: "Vendor", deadline: "30 days", risk: "High", status: "Pending", assigned_to: "emp-ananya" },
  { id: "cl3", contract_id: "c1", type: "Monthly Uptime Reporting", party: "Vendor Manager", deadline: "5th monthly", risk: "Medium", status: "Active", assigned_to: "emp-ananya" },
  { id: "cl4", contract_id: "c1", type: "Contract Renewal Notice", party: "Legal Team", deadline: "30 days before expiry", risk: "High", status: "Upcoming", assigned_to: "emp-rohan" },
  { id: "cl5", contract_id: "c3", type: "Retention Money Release (5%)", party: "Metro Sponsor", deadline: "56 days post-DLP", risk: "High", status: "Pending", assigned_to: "emp-priya" },
  { id: "cl6", contract_id: "c4", type: "CDSCO / FDA Batch Compliance", party: "QA Lead", deadline: "15 days post-batch", risk: "High", status: "Active", assigned_to: "emp-ananya" },
];

export const localTasks: Task[] = [
  { id: "t1", contract_id: "c1", contract_name: "Tata Consultancy Services (TCS) Master Agreement", title: "Submit Monthly Vendor GST Compliance Report", owner: "Ananya Deshmukh", assigned_to: "emp-ananya", due: "30 Sep, 2026", priority: "High", status: "Pending" },
  { id: "t2", contract_id: "c1", contract_name: "Tata Consultancy Services (TCS) Master Agreement", title: "Review Annual SLA Renewal & Indemnity Terms", owner: "Rohan Mukherjee", assigned_to: "emp-rohan", due: "15 Oct, 2026", priority: "High", status: "Awaiting Approval" },
  { id: "t3", contract_id: "c3", contract_name: "L&T Metro Civil EPC Construction Contract", title: "Inspect Substructure Piling & Issue Stage-2 Certificate", owner: "Priya Sharma", assigned_to: "emp-priya", due: "05 Oct, 2026", priority: "High", status: "Pending" },
  { id: "t4", contract_id: "c1", contract_name: "Tata Consultancy Services (TCS) Master Agreement", title: "Process Q3 Software Hosting Invoice via NEFT/RTGS", owner: "Ananya Deshmukh", assigned_to: "emp-ananya", due: "28 Sep, 2026", priority: "Low", status: "Completed" },
  { id: "t5", contract_id: "c4", contract_name: "Sun Pharma Clinical Trial Research Agreement", title: "Submit Biologics Cold-Chain Temperature Logs to CDSCO", owner: "Ananya Deshmukh", assigned_to: "emp-ananya", due: "08 Oct, 2026", priority: "High", status: "Pending" },
  { id: "t6", contract_id: "c2", contract_name: "Infosys Cloud Infrastructure & Security SLA", title: "Audit Multi-Region Mumbai/Hyderabad Cloud Failover Logs", owner: "Rohan Mukherjee", assigned_to: "emp-rohan", due: "12 Oct, 2026", priority: "Medium", status: "Pending" },
  { id: "t7", contract_id: "c5", contract_name: "Mahindra Automated Assembly Line Supply Agreement", title: "Complete Pune Factory Acceptance Test (FAT) Sign-off", owner: "Priya Sharma", assigned_to: "emp-priya", due: "24 Sep, 2026", priority: "Medium", status: "Completed" },
];

export const localApprovals: Approval[] = [
  {
    id: "ap1",
    title: "Approve L&T Civil EPC Monsoon Weather EOT Addendum",
    recommendation: "Review before signing — revised force majeure penalty waiver requested.",
    risk: "High",
    reason: "Contractor requested 21 days extension due to extreme monsoons in Mumbai. Foundation milestone shifted to Nov 15.",
    status: "Awaiting Approval",
    contract_id: "c3",
    assigned_to: "emp-priya",
    assigned_name: "Priya Sharma",
    due_date: "02 Oct, 2026",
  },
  {
    id: "ap2",
    title: "Renew Infosys Cloud Infrastructure Security SLA",
    recommendation: "Approve renewal with updated 99.95% uptime guarantee.",
    risk: "Medium",
    reason: "Annual cloud SLA renewal with revised ₹1,50,000 performance penalty credit clause.",
    status: "Awaiting Approval",
    contract_id: "c2",
    assigned_to: "emp-rohan",
    assigned_name: "Rohan Mukherjee",
    due_date: "15 Oct, 2026",
  },
  {
    id: "ap3",
    title: "TCS Q4 Rate Card & GST Indexation Adjustment",
    recommendation: "Approved by Boss Vikramaditya Singhania.",
    risk: "Low",
    reason: "Standard 3.5% inflation indexation in accordance with Schedule B.",
    status: "Approved",
    contract_id: "c1",
    assigned_to: "emp-ananya",
    assigned_name: "Ananya Deshmukh",
    due_date: "20 Sep, 2026",
  },
];

export const localInstallments: Installment[] = [
  {
    id: "inst-1",
    contract_id: "c1",
    contract_name: "Tata Consultancy Services (TCS) Master Agreement",
    milestone_name: "Q3 Software Hosting & Cloud SLA Fee",
    amount: "₹3,50,000",
    due_date: "2026-09-30",
    due_time: "05:00 PM",
    status: "Pending",
    invoice_no: "TCS-GST-2026-089",
    assigned_to: "emp-ananya",
    assigned_name: "Ananya Deshmukh",
    notes: "Requires vendor monthly uptime report sign-off before RTGS transfer.",
  },
  {
    id: "inst-2",
    contract_id: "c1",
    contract_name: "Tata Consultancy Services (TCS) Master Agreement",
    milestone_name: "Q2 Software Hosting & Cloud SLA Fee",
    amount: "₹3,50,000",
    due_date: "2026-06-30",
    due_time: "05:00 PM",
    status: "Paid",
    paid_at: "2026-06-29 02:40 PM",
    invoice_no: "TCS-GST-2026-042",
    assigned_to: "emp-ananya",
    assigned_name: "Ananya Deshmukh",
    notes: "Disbursed on schedule via Corporate NetBanking.",
  },
  {
    id: "inst-3",
    contract_id: "c3",
    contract_name: "L&T Metro Civil EPC Construction Contract",
    milestone_name: "Substructure & Deep Piling Completion (Milestone 2)",
    amount: "₹45,00,000",
    due_date: "2026-10-15",
    due_time: "06:30 PM",
    status: "Upcoming",
    invoice_no: "LT-EPC-MST-002",
    assigned_to: "emp-priya",
    assigned_name: "Priya Sharma",
    notes: "Contingent on Chief Structural Engineer site physical inspection certificate.",
  },
  {
    id: "inst-4",
    contract_id: "c3",
    contract_name: "L&T Metro Civil EPC Construction Contract",
    milestone_name: "Mobilization Advance (Milestone 1)",
    amount: "₹28,50,000",
    due_date: "2026-03-01",
    due_time: "12:00 PM",
    status: "Paid",
    paid_at: "2026-02-28 11:15 AM",
    invoice_no: "LT-EPC-MST-001",
    assigned_to: "emp-priya",
    assigned_name: "Priya Sharma",
    notes: "Advance Bank Guarantee (ABG) from SBI verified.",
  },
  {
    id: "inst-5",
    contract_id: "c4",
    contract_name: "Sun Pharma Clinical Trial Research Agreement",
    milestone_name: "Patient Cohort Enrollment Phase 1",
    amount: "₹18,00,000",
    due_date: "2026-09-20",
    due_time: "04:00 PM",
    status: "Overdue",
    invoice_no: "SUN-CT-904",
    assigned_to: "emp-ananya",
    assigned_name: "Ananya Deshmukh",
    notes: "Awaiting pending Institutional Ethics Committee (IEC) approval copy.",
  },
  {
    id: "inst-6",
    contract_id: "c2",
    contract_name: "Infosys Cloud Infrastructure & Security SLA",
    milestone_name: "Annual Cloud Reserved Instance Billing",
    amount: "₹22,00,000",
    due_date: "2026-10-31",
    due_time: "11:59 PM",
    status: "Upcoming",
    invoice_no: "INFY-CLOUD-8841",
    assigned_to: "emp-rohan",
    assigned_name: "Rohan Mukherjee",
    notes: "Scheduled for direct RTGS wire transfer at month-end.",
  },
];

export const localWorkProgress: WorkProgress[] = [
  {
    id: "wp-1",
    employee_id: "emp-ananya",
    employee_name: "Ananya Deshmukh",
    contract_id: "c1",
    contract_name: "Tata Consultancy Services (TCS) Master Agreement",
    milestone: "TCS SOC 2 & DPDP Act Compliance Audit Verification",
    progress_pct: 85,
    hours_spent: 14.5,
    updated_date: "2026-09-29",
    updated_time: "03:45 PM",
    status: "In Progress",
    notes: "Received updated SOC 2 Type II audit certificate. Cross-checking DPDP Act data fiduciary liability annexure.",
  },
  {
    id: "wp-2",
    employee_id: "emp-ananya",
    employee_name: "Ananya Deshmukh",
    contract_id: "c4",
    contract_name: "Sun Pharma Clinical Trial Research Agreement",
    milestone: "CDSCO Electronic Records & GCP Protocol Setup",
    progress_pct: 100,
    hours_spent: 22.0,
    updated_date: "2026-09-28",
    updated_time: "05:15 PM",
    status: "Completed",
    notes: "Audit trail and electronic signature controls validated with sponsor quality assurance.",
  },
  {
    id: "wp-3",
    employee_id: "emp-rohan",
    employee_name: "Rohan Mukherjee",
    contract_id: "c2",
    contract_name: "Infosys Cloud Infrastructure & Security SLA",
    milestone: "Quarterly Multi-Region SLA Uptime Audit (Mumbai/Hyderabad)",
    progress_pct: 90,
    hours_spent: 18.0,
    updated_date: "2026-09-29",
    updated_time: "02:30 PM",
    status: "In Progress",
    notes: "Verified 99.98% recorded uptime against 99.95% target. Drafting executive certification for management.",
  },
  {
    id: "wp-4",
    employee_id: "emp-rohan",
    employee_name: "Rohan Mukherjee",
    contract_id: "c6",
    contract_name: "HDFC Bank Syndicated Term Loan & Credit Facility",
    milestone: "Quarterly DSCR Covenant Financial Certificate",
    progress_pct: 65,
    hours_spent: 12.0,
    updated_date: "2026-09-27",
    updated_time: "04:10 PM",
    status: "Review Pending",
    notes: "Financial ratios calculated with statutory auditors. Awaiting CFO sign-off.",
  },
  {
    id: "wp-5",
    employee_id: "emp-priya",
    employee_name: "Priya Sharma",
    contract_id: "c3",
    contract_name: "L&T Metro Civil EPC Construction Contract",
    milestone: "Civil Piling & Deep Excavation Site Audit",
    progress_pct: 70,
    hours_spent: 31.5,
    updated_date: "2026-09-29",
    updated_time: "01:20 PM",
    status: "In Progress",
    notes: "Site inspection completed with Chief Engineer. 88 out of 110 piles cast. Monsoon rainfall delays recorded under FIDIC clause 8.4.",
  },
  {
    id: "wp-6",
    employee_id: "emp-priya",
    employee_name: "Priya Sharma",
    contract_id: "c5",
    contract_name: "Mahindra Automated Assembly Line Supply Agreement",
    milestone: "Factory Acceptance Test (FAT) Sign-off at Pune Plant",
    progress_pct: 100,
    hours_spent: 16.0,
    updated_date: "2026-09-24",
    updated_time: "11:00 AM",
    status: "Completed",
    notes: "Assembly line throughput tested at 120 units/min without error. Final acceptance certificate signed.",
  },
];

export const localDeadlineIssues: DeadlineIssue[] = [
  {
    id: "di-1",
    contract_id: "c4",
    contract_name: "Sun Pharma Clinical Trial Research Agreement",
    assigned_to: "emp-ananya",
    assigned_name: "Ananya Deshmukh",
    issue_title: "CDSCO / FDA Serious Adverse Event (SAE) Filing Deadline",
    deadline_date: "2026-10-01",
    deadline_time: "11:59 PM",
    days_left: 2,
    risk_level: "Critical",
    category: "Regulatory Filing",
    impact: "Failure to report within 7 days risks CDSCO warning notice and temporary clinical trial stay order.",
    status: "Escalated",
    mitigation_plan: "Assigned emergency regulatory drafter; medical monitor expedited report ready for transmission.",
  },
  {
    id: "di-2",
    contract_id: "c3",
    contract_name: "L&T Metro Civil EPC Construction Contract",
    assigned_to: "emp-priya",
    assigned_name: "Priya Sharma",
    issue_title: "Foundation Milestone 2 Delay — Liquidated Damages Risk",
    deadline_date: "2026-10-05",
    deadline_time: "05:00 PM",
    days_left: 6,
    risk_level: "High",
    category: "Vendor SLA Breach",
    impact: "Contractual liquidated damages of ₹50,000 per day of delay under Clause 8.7.",
    status: "Open",
    mitigation_plan: "Submitted formal Clause 8.4 Extension of Time (EOT) notice citing continuous Mumbai monsoons; approval in progress.",
  },
  {
    id: "di-3",
    contract_id: "c1",
    contract_name: "Tata Consultancy Services (TCS) Master Agreement",
    assigned_to: "emp-ananya",
    assigned_name: "Ananya Deshmukh",
    issue_title: "Annual SOC 2 Type II Recertification Overdue by 3 Days",
    deadline_date: "2026-09-26",
    deadline_time: "05:00 PM",
    days_left: -3,
    risk_level: "High",
    category: "Compliance Evidence Missing",
    impact: "Enterprise security governance breach; automated payment hold placed on invoice.",
    status: "Open",
    mitigation_plan: "Vendor provided bridge letter today; full audit report arriving Oct 2.",
  },
  {
    id: "di-4",
    contract_id: "c6",
    contract_name: "HDFC Bank Syndicated Term Loan & Credit Facility",
    assigned_to: "emp-rohan",
    assigned_name: "Rohan Mukherjee",
    issue_title: "Quarterly Compliance Certificate Delivery to HDFC Syndicate Agent",
    deadline_date: "2026-10-15",
    deadline_time: "05:00 PM",
    days_left: 16,
    risk_level: "Medium",
    category: "Payment Overdue",
    impact: "Covenant default threshold if not cured within 15 business days.",
    status: "Open",
    mitigation_plan: "Drafting certificate with treasury team; internal review scheduled for Oct 10.",
  },
];

export const localReminders: Reminder[] = [
  {
    id: "rem-1",
    title: "Review L&T Metro Civil EPC Monsoon EOT Addendum before Boss Approval",
    contract_id: "c3",
    contract_name: "L&T Metro Civil EPC Construction Contract",
    target_date: "2026-10-01",
    target_time: "09:30 AM",
    priority: "High",
    recipient_role: "boss",
    recipient_id: "rajesh-boss",
    recipient_name: "Vikramaditya Singhania",
    channel: "In-App & Email",
    status: "Active",
  },
  {
    id: "rem-2",
    title: "Verify Q3 TCS Invoicing and Release RTGS Wire Transfer",
    contract_id: "c1",
    contract_name: "Tata Consultancy Services (TCS) Master Agreement",
    target_date: "2026-09-30",
    target_time: "02:00 PM",
    priority: "Medium",
    recipient_role: "employee",
    recipient_id: "emp-ananya",
    recipient_name: "Ananya Deshmukh",
    channel: "In-App & Email",
    status: "Active",
  },
  {
    id: "rem-3",
    title: "Submit CDSCO Biologics Clinical Trial Protocol Temperature Logs",
    contract_id: "c4",
    contract_name: "Sun Pharma Clinical Trial Research Agreement",
    target_date: "2026-10-02",
    target_time: "11:00 AM",
    priority: "High",
    recipient_role: "employee",
    recipient_id: "emp-ananya",
    recipient_name: "Ananya Deshmukh",
    channel: "Slack Alert",
    status: "Active",
  },
  {
    id: "rem-4",
    title: "Audit Infosys Cloud Multi-Region Failover Architecture Logs",
    contract_id: "c2",
    contract_name: "Infosys Cloud Infrastructure & Security SLA",
    target_date: "2026-10-10",
    target_time: "04:30 PM",
    priority: "Medium",
    recipient_role: "employee",
    recipient_id: "emp-rohan",
    recipient_name: "Rohan Mukherjee",
    channel: "Teams Ping",
    status: "Active",
  },
  {
    id: "rem-5",
    title: "Executive Quarterly Contract Compliance & Financial Risk Review",
    target_date: "2026-10-05",
    target_time: "10:00 AM",
    priority: "High",
    recipient_role: "boss",
    recipient_id: "rajesh-boss",
    recipient_name: "Vikramaditya Singhania",
    channel: "In-App & Email",
    status: "Active",
  },
];

export const localEmployeeReports: EmployeeReport[] = [
  {
    employee_id: "emp-ananya",
    employee_name: "Ananya Deshmukh",
    title: "Head of Procurement & Vendor Management",
    department: "Finance & Sourcing",
    total_contracts: 2,
    completed_milestones: 8,
    pending_milestones: 2,
    on_time_rate_pct: 95,
    compliance_score: 94,
    total_hours: 68.5,
    grade: "A+",
    recent_activity: "Completed CDSCO regulatory setup; currently auditing TCS SOC 2 Type II report.",
  },
  {
    employee_id: "emp-rohan",
    employee_name: "Rohan Mukherjee",
    title: "Lead Legal & Corporate Compliance Officer",
    department: "Legal & Regulatory Affairs",
    total_contracts: 2,
    completed_milestones: 6,
    pending_milestones: 3,
    on_time_rate_pct: 91,
    compliance_score: 90,
    total_hours: 54.0,
    grade: "A",
    recent_activity: "Validated 99.98% Infosys cloud uptime; drafting HDFC loan compliance certificate.",
  },
  {
    employee_id: "emp-priya",
    employee_name: "Priya Sharma",
    title: "Senior Operations & Infrastructure SLA Manager",
    department: "Projects & Operations",
    total_contracts: 2,
    completed_milestones: 9,
    pending_milestones: 1,
    on_time_rate_pct: 89,
    compliance_score: 91,
    total_hours: 76.5,
    grade: "A",
    recent_activity: "Inspected 88 metro piles on site; finalized Mahindra assembly line FAT sign-off.",
  },
];

export const localAudit: AuditEvent[] = [
  { id: "a1", time: "09:42", event: "Contract uploaded: L&T Metro Civil EPC Contract", actor: "Priya Sharma", created_at: "2026-09-29T09:42:00Z" },
  { id: "a2", time: "09:43", event: "AI analysis completed (Gemini 3.x Flash)", actor: "ContractFlow AI", created_at: "2026-09-29T09:43:00Z" },
  { id: "a3", time: "09:44", event: "18 obligations & 4 milestone installments extracted (₹2.85 Cr)", actor: "ContractFlow AI", created_at: "2026-09-29T09:44:00Z" },
  { id: "a4", time: "10:15", event: "Contract Amendment v1.4 created with Monsoon EOT note", actor: "Priya Sharma", created_at: "2026-09-29T10:15:00Z" },
  { id: "a5", time: "11:30", event: "Installment payment of ₹3,50,000 verified via RTGS", actor: "Ananya Deshmukh", created_at: "2026-09-29T11:30:00Z" },
  { id: "a6", time: "14:20", event: "Work progress logged: 85% on TCS SOC 2 review", actor: "Ananya Deshmukh", created_at: "2026-09-29T14:20:00Z" },
  { id: "a7", time: "15:10", event: "Deadline Issue escalated to Boss: Sun Pharma CDSCO filing", actor: "Ananya Deshmukh", created_at: "2026-09-29T15:10:00Z" },
];

export const localIntegrations: Integration[] = [
  { id: "i1", name: "Google Calendar", kind: "calendar", connected: true },
  { id: "i2", name: "Slack", kind: "chat", connected: true },
  { id: "i3", name: "Microsoft Teams", kind: "chat", connected: false },
  { id: "i4", name: "Email Notifications", kind: "email", connected: true },
  { id: "i5", name: "Zoho / Salesforce CRM", kind: "crm", connected: false },
  { id: "i6", name: "SAP & Tally ERP", kind: "erp", connected: true },
  { id: "i7", name: "REST API Gateway", kind: "api", connected: true },
  { id: "i8", name: "Webhook", kind: "webhook", connected: false },
];

export const localTimeline: TimelineItem[] = [
  { date: "20 Sep", label: "Sun Pharma Milestone 1 Patient Enrollment", status: "Overdue" },
  { date: "24 Sep", label: "Mahindra Assembly FAT Sign-off", status: "Completed" },
  { date: "28 Sep", label: "TCS Q3 GST Invoice Processing", status: "Completed" },
  { date: "30 Sep", label: "Monthly Vendor Compliance Report", status: "Pending" },
  { date: "01 Oct", label: "CDSCO SAE Emergency Regulatory Filing", status: "Pending" },
  { date: "05 Oct", label: "L&T Metro Foundation Site Inspection", status: "Pending" },
  { date: "15 Oct", label: "Infosys Cloud Infrastructure SLA Renewal", status: "Awaiting approval" },
];

export const localStats: Stats = {
  contracts: 6,
  active_contracts: 5,
  pending_actions: 5,
  overdue_actions: 1,
  compliance_score: 93,
  completed_obligations: 48,
  pending_obligations: 6,
  high_risk: 3,
};

const DEMO_CLAUSES: AnalysisClause[] = [
  { type: "Payment Terms (Net 30 GST)", party: "Finance Team", deadline: "10 days", risk: "Low", status: "Active" },
  { type: "Security Compliance (SOC 2 & DPDP)", party: "Vendor", deadline: "30 days", risk: "High", status: "Pending" },
  { type: "Monthly Uptime SLA Reporting", party: "Vendor Manager", deadline: "5th monthly", risk: "Medium", status: "Active" },
  { type: "Contract Renewal Notice", party: "Legal Team", deadline: "30 days before expiry", risk: "High", status: "Upcoming" },
];

export const localAnalysis: AnalysisData = {
  id: "local-demo",
  filename: "tcs-master-agreement-2026.pdf",
  contract_type: "Master Services Agreement (MSA)",
  industry: "IT & Cloud",
  status: "Active",
  risk: "Medium",
  confidence: 96,
  summary: "Comprehensive Indian enterprise vendor MSA requiring monthly uptime certification (99.95%), SOC 2 Type II and DPDP Act compliance audit within 30 days, Net 30 milestone installment invoicing (₹3,50,000/quarter), and mandatory 60-day renewal notice.",
  important_dates: 8,
  clauses: DEMO_CLAUSES,
  tasks: DEMO_CLAUSES.map((c) => ({ title: `${c.type} — fulfill contractual obligation`, owner: c.party, due: c.deadline, priority: c.risk })),
  installments_detected: [
    { milestone: "Initial Setup & Onboarding Advance", amount: "₹2,50,000", due: "2026-10-15", time: "05:00 PM" },
    { milestone: "Q4 Infrastructure Hosting Fee", amount: "₹3,50,000", due: "2026-12-31", time: "05:00 PM" },
  ],
  deadline_issues_detected: [
    { title: "Annual SOC 2 Type II Renewal Notice", risk: "High", reason: "Mandatory 30-day compliance delivery window from effective date." },
    { title: "Non-Renewal Written Notice Window", risk: "Medium", reason: "Must issue notice 60 days before expiration to avoid auto-renewal." },
  ],
  next_steps: [
    "Assign tasks to Procurement Lead (Ananya Deshmukh)",
    "Schedule Q4 Installment payment reminder",
    "Monitor SOC 2 Type II compliance audit deadline",
    "Route liability cap review to Legal Team",
  ],
  engine: "llm",
};

// -------------------------------------------------------------
// Multi-Industry Problem Solver Presets with Indian Context & INR (₹)
// -------------------------------------------------------------

export interface IndustrySector {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  color: string;
  borderColor: string;
  badgeBg: string;
  commonIssues: {
    title: string;
    scenario: string;
    query: string;
    solution: string;
    actionableRemedies: string[];
    clauseRecommendation: string;
  }[];
}

export const INDUSTRY_SECTORS: IndustrySector[] = [
  {
    id: "it",
    name: "IT & Software Sector",
    icon: "Code",
    tagline: "SLA breaches, cloud uptime credits, DPDP Act 2023, SOC 2, and software IP escrow.",
    color: "from-blue-500 to-indigo-600",
    borderColor: "border-blue-500/30",
    badgeBg: "bg-blue-500/15 text-blue-300",
    commonIssues: [
      {
        title: "Cloud SLA Downtime Penalty & Service Credit",
        scenario: "Cloud SaaS provider recorded 99.1% uptime for the month against an agreed 99.95% SLA target.",
        query: "Provider delivered 99.1% monthly uptime instead of 99.95% SLA. What penalties, service credits (₹), or remedies can we legally enforce?",
        solution: "Under standard Indian enterprise IT contracts, an uptime of 99.1% represents an outage of ~6.5 hours exceeding the 21-minute allowable window. The customer is entitled to: (1) Tier 2 Service Credits of 25% of the monthly fee (₹87,500), (2) Root Cause Analysis (RCA) within 5 business days, and (3) Right to terminate for cause if SLA is missed for 3 consecutive months.",
        actionableRemedies: [
          "Issue formal SLA Default Notice within 14 days of calendar month-end.",
          "Deduct 25% credit (₹87,500) from next scheduled installment invoice (TCS-GST-2026-089).",
          "Demand Tier-1 Disaster Recovery Failover Architecture Audit report.",
        ],
        clauseRecommendation: "Add Addendum: 'In the event Monthly Uptime falls below 99.5%, Vendor shall automatically apply a 25% Service Credit to Subscriber's next billing cycle without requiring written claim.'",
      },
      {
        title: "Data Protection Breach & DPDP Act 2023 Liability",
        scenario: "A 3rd-party database vendor employed by our software vendor suffered an unauthorized credential leak.",
        query: "Our software vendor had a security leak. What are our liability caps and Data Protection Board of India notification obligations?",
        solution: "Under the Digital Personal Data Protection (DPDP) Act 2023, the Data Fiduciary must notify the Data Protection Board of India and affected data principals immediately upon confirmation. Aggregate liability caps typically do NOT apply to breaches of Data Protection and Confidentiality under Indian Contract Law.",
        actionableRemedies: [
          "Demand complete Forensic Incident Assessment and affected PII telemetry.",
          "File mandatory incident report to CERT-In / Data Protection Board of India.",
          "Trigger immediate Right-to-Audit clause against vendor's cloud environment.",
        ],
        clauseRecommendation: "Clause Amendment: 'Vendor agrees that liability for Data Protection, DPDP Act violations, and Gross Negligence shall be uncapped.'",
      },
    ],
  },
  {
    id: "civil",
    name: "Civil & Construction Sector",
    icon: "HardHat",
    tagline: "FIDIC contracts, defect liability period (DLP), 5% retention money, monsoon weather delays, liquidated damages.",
    color: "from-amber-500 to-orange-600",
    borderColor: "border-amber-500/30",
    badgeBg: "bg-amber-500/15 text-amber-300",
    commonIssues: [
      {
        title: "Monsoon Weather Delay vs Liquidated Damages (FIDIC 8.4)",
        scenario: "Subcontractor delayed metro foundation piling by 21 days due to abnormal monsoon rainfall in Mumbai. Employer threatens liquidated damages of ₹50,000/day.",
        query: "Subcontractor delayed foundation by 21 days due to severe monsoon rain. Can Employer enforce liquidated damages or can contractor claim Extension of Time (EOT)?",
        solution: "Under FIDIC Red Book Clause 8.4(c) and Indian Contract Act Section 56 (Force Majeure / Frustration), Exceptionally Adverse Climatic Conditions entitle the Contractor to an Extension of Time (EOT) without financial penalty, provided the Contractor issued Notice of Claim within 28 days along with IMD (India Meteorological Department) certified rainfall data.",
        actionableRemedies: [
          "Submit formal Notice of Claim under FIDIC Sub-Clause 20.1 within 28 days.",
          "Attach certified IMD rainfall logs comparing against 10-year historical baseline.",
          "Request Project Engineer to adjust Milestone 2 completion date to Nov 15.",
        ],
        clauseRecommendation: "Amended EOT Clause: 'Contractor shall be entitled to extension of the Time for Completion for abnormal rainfall exceeding 120% of 10-year IMD average, pausing Liquidated Damages.'",
      },
      {
        title: "Retention Money Release (₹14.25 Lakhs) Post-DLP",
        scenario: "Project achieved Substantial Completion 12 months ago. Employer is withholding 5% retention money (₹14,25,000) past the Defect Liability Period.",
        query: "Employer refusing to release 5% retention money (₹14.25 Lakhs) 12 months after handover. What legal steps ensure immediate release?",
        solution: "Upon expiration of the 12-month Defect Liability Period (DLP) and rectification of all punch-list items, the Employer is legally obligated under FIDIC Clause 14.9 to release the second half of retention money within 56 days of the Performance Certificate.",
        actionableRemedies: [
          "Issue Final Punch-List Clearance Certificate signed by Resident Engineer.",
          "Send 14-day statutory demand letter for release of ₹14,25,000 retention balance.",
          "Charge contractual late payment interest (RBI Repo + 3%) for period past 56 days.",
        ],
        clauseRecommendation: "Retention Clause: 'The second half of Retention Money shall be paid to Contractor within 28 days after the expiration of the Defects Notification Period.'",
      },
    ],
  },
  {
    id: "pharma",
    name: "Pharma & Healthcare Sector",
    icon: "Activity",
    tagline: "CDSCO & US FDA 21 CFR Part 11, cGMP compliance, clinical trial agreements, cold-chain temperature excursion disputes.",
    color: "from-rose-500 to-pink-600",
    borderColor: "border-rose-500/30",
    badgeBg: "bg-rose-500/15 text-rose-300",
    commonIssues: [
      {
        title: "Cold-Chain Temperature Excursion During Transit",
        scenario: "Biologic vaccine batch shipment was exposed to +14°C for 6 hours (required +2°C to +8°C). Carrier claims domestic air cargo liability.",
        query: "Cold-chain shipment exceeded +8°C during transit. Who bears financial loss (₹38,00,000) and how to handle CDSCO batch disposition?",
        solution: "Under cGMP and Good Distribution Practice (GDP), the Logistics Provider bears primary liability for temperature excursion unless a pre-agreed Stability Study proves zero efficacy degradation. The batch must be placed on immediate Quality Quarantine in ERP.",
        actionableRemedies: [
          "Place Batch #BIO-904 on immediate Quality Quarantine / Hold in SAP/ERP.",
          "Request calibrated USB DataLogger telemetry from transit provider.",
          "File insurance subrogation claim against carrier within contractual 14-day window.",
        ],
        clauseRecommendation: "Cold-Chain Covenant: 'Carrier guarantees continuous temperature maintenance between +2°C and +8°C with dual calibrated loggers. Any excursion exceeding 2 hours triggers 100% replacement liability.'",
      },
      {
        title: "Expedited Serious Adverse Event (SAE) 24h Reporting Failure",
        scenario: "CRO failed to notify sponsor of a patient hospitalization within the required 24-hour window.",
        query: "CRO reported a Serious Adverse Event on Day 4 instead of 24 hours. What are the CDSCO regulatory and contractual breach consequences?",
        solution: "CDSCO and US FDA guidelines mandate 24-hour expedited SAE reporting to Ethics Committee and Licensing Authority. The CRO's delay creates severe risk of regulatory sanction, constituting a Material Breach of the Master Clinical Research Agreement.",
        actionableRemedies: [
          "File emergency IND Safety Report to CDSCO & Ethics Committee immediately.",
          "Issue Formal Notice of Material Breach to CRO with 7-day cure requirement.",
          "Initiate independent Good Clinical Practice (GCP) quality audit of CRO trial site.",
        ],
        clauseRecommendation: "Safety Protocol Clause: 'CRO shall notify Sponsor Safety Officer of all SAEs within 24 hours of first knowledge, under penalty of immediate trial termination for cause.'",
      },
    ],
  },
  {
    id: "mfg",
    name: "Manufacturing & Supply Chain",
    icon: "PackageCheck",
    tagline: "Incoterms 2020 DDP/FOB, GST e-way bill compliance, AQL 1.5 defect rates, assembly line OEM warranty.",
    color: "from-cyan-500 to-blue-600",
    borderColor: "border-cyan-500/30",
    badgeBg: "bg-cyan-500/15 text-cyan-300",
    commonIssues: [
      {
        title: "Defect Rate Exceeding AQL 1.5 Quality Standard",
        scenario: "Shipped shipment of 50,000 precision auto parts showed a 4.2% failure rate against an agreed Acceptable Quality Level (AQL) of 1.5%.",
        query: "Received batch of parts with 4.2% defects vs agreed 1.5% AQL. What is our right of batch rejection and replacement costs (₹)?",
        solution: "Under ISO 2859-1 sampling standards and Indian Sale of Goods Act 1930, a 4.2% defect rate constitutes batch failure. The Buyer has the legal right to: (1) Reject the entire batch, (2) Demand expedited replacement at Supplier's expense, and (3) Claim assembly downtime damages.",
        actionableRemedies: [
          "Issue Formal Rejection Notice within 10 business days of incoming inspection.",
          "Demand Supplier provide Corrective and Preventive Action (CAPA) plan within 7 days.",
          "Offset replacement costs against unpaid Supplier invoices in ERP.",
        ],
        clauseRecommendation: "Quality Warranty: 'In the event incoming inspection indicates defects exceeding AQL 1.5, Supplier shall replace defective lot via expedited freight within 10 business days at zero cost to Buyer.'",
      },
    ],
  },
  {
    id: "finance",
    name: "Finance & Banking Sector",
    icon: "Landmark",
    tagline: "RBI DSCR guidelines, syndicated loans, corporate debt covenants, equity cure rights, cross-default defense.",
    color: "from-emerald-500 to-teal-600",
    borderColor: "border-emerald-500/30",
    badgeBg: "bg-emerald-500/15 text-emerald-300",
    commonIssues: [
      {
        title: "Temporary DSCR Ratio Dip Below 1.25x Covenant",
        scenario: "Borrower's Q3 Debt Service Coverage Ratio dipped to 1.18x due to delayed customer receivables.",
        query: "DSCR fell from required 1.25x to 1.18x this quarter. How can we cure the breach without triggering syndicated loan acceleration?",
        solution: "Most corporate syndicated loan agreements in India include an Equity Cure Right, allowing promoters/shareholders to infuse funds into the Debt Service Reserve Account (DSRA) within 15 business days of financial statement delivery to cure the ratio.",
        actionableRemedies: [
          "Exercise Equity Cure Right by infusing funds into DSRA Account.",
          "Deliver compliance calculation certificate with Equity Cure adjustment.",
          "Request HDFC Syndicate Agent for temporary 1-quarter waiver letter.",
        ],
        clauseRecommendation: "Cure Mechanism: 'Borrower shall have the right within 20 days of delivery of compliance certificate to apply Equity Cure contributions directly to EBITDA for DSCR calculations.'",
      },
    ],
  },
];
