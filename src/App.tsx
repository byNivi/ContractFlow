import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity, AlertTriangle, ArrowRight, Bot, CalendarDays, Check,
  CheckCircle2, ChevronRight, CircleDollarSign, ClipboardCheck,
  Clock3, CloudUpload, FileCheck2, FileText, Gauge, GitBranch,
  History, LayoutDashboard, Link2, ListChecks, Loader2, Mail, Menu, MessageSquare,
  Network, Play, Plus, Search, Send, ShieldCheck, Sparkles, UserCheck,
  Users, X, Zap
} from "lucide-react";
import {
  AnimatedCounter, AuroraBackground, GlowButton, Reveal, ToastProvider, useToast,
} from "./ui";
import Hero from "./Hero";
import { api, checkHealth, useApi, useBackend } from "./api";
import {
  localAnalysis, localApprovals, localAudit, localClauses, localContracts,
  localIntegrations, localStats, localTasks, localTimeline,
} from "./data";
import type { AnalysisData, Approval, Clause, Integration, Task } from "./data";

type Page =
  | "Dashboard" | "Contracts" | "AI Analyzer" | "Obligations"
  | "Action Center" | "Approvals" | "Compliance" | "Audit Trail"
  | "Integrations" | "AI Copilot";

const nav: { name: Page; icon: React.ElementType }[] = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Contracts", icon: FileText },
  { name: "AI Analyzer", icon: Sparkles },
  { name: "Obligations", icon: ListChecks },
  { name: "Action Center", icon: ClipboardCheck },
  { name: "Approvals", icon: UserCheck },
  { name: "Compliance", icon: ShieldCheck },
  { name: "Audit Trail", icon: History },
  { name: "Integrations", icon: Link2 },
  { name: "AI Copilot", icon: MessageSquare },
];

const INTEGRATION_ICONS: Record<string, React.ElementType> = {
  "Google Calendar": CalendarDays, Slack: MessageSquare, "Microsoft Teams": Users,
  Email: Mail, CRM: Network, ERP: CircleDollarSign, "REST API": Zap, Webhook: Link2,
};

const SAMPLE_PRESETS = [
  {
    name: "Vendor Master Agreement",
    filename: "vendor-msa-2026.pdf",
    text: `VENDOR MASTER SERVICES AGREEMENT (MSA)
Between: Horizon Enterprise Systems Inc. ("Customer") and CloudPeak Infrastructure Ltd ("Vendor").
Effective Date: October 1, 2026.

1. SCOPE & PAYMENT TERMS:
Customer shall compensate Vendor according to Schedule A. Invoices shall be submitted monthly and paid Net 30 days from receipt by Finance Team. Late payments incur 1.5% interest per month.

2. SECURITY & COMPLIANCE (CRITICAL OBLIGATION):
Vendor must provide an updated SOC 2 Type II compliance audit report and ISO 27001 certification within 30 days of the effective date. Annual re-certification is mandatory.

3. SERVICE LEVEL AGREEMENT (SLA):
Vendor guarantees 99.95% monthly service availability. Vendor Manager must submit monthly uptime and SLA incident reports by the 5th of each calendar month. Penalties of 10% credit apply for uptime below 99.9%.

4. TERM & AUTO-RENEWAL:
This agreement has an initial term of 24 months. It shall automatically renew for successive 12-month periods unless Legal Team issues written notice of non-renewal at least 60 days prior to expiration.

5. LIABILITY & INDEMNIFICATION:
Each party's aggregate liability is capped at 2x total annual fees paid, except for confidentiality breaches, IP infringement, or gross negligence.`,
  },
  {
    name: "Enterprise SaaS SLA",
    filename: "saas-sla-terms.docx",
    text: `ENTERPRISE SOFTWARE-AS-A-SERVICE SERVICE LEVEL AGREEMENT
Provider: DataFlow Cloud Inc. | Subscriber: Global Logistics Group

1. System Uptime: Provider commits to 99.9% availability during business hours. Compliance team to verify evidence quarterly.
2. Support Response: Critical severity incidents require a 1-hour initial response and 4-hour mitigation window.
3. Data Protection: Provider agrees to GDPR and CCPA standard contractual clauses. Security Officer must review sub-processors every 6 months.
4. Termination Notice: Subscriber may terminate for cause if SLA is missed for 3 consecutive months with 30 days written notice.`,
  },
  {
    name: "Mutual Non-Disclosure Agreement",
    filename: "mutual-nda.pdf",
    text: `MUTUAL NON-DISCLOSURE AND CONFIDENTIALITY AGREEMENT
Parties: Alpha Corp & Beta Innovations LLC.

1. Confidential Information: Both parties agree to protect proprietary technical and financial information for a period of 3 years from disclosure.
2. Permitted Use: Information shall only be disclosed to employees with a strict need to know.
3. Return of Materials: Upon written request or termination of talks, all confidential documents and copies must be securely destroyed within 14 days.`,
  }
];

function App() {
  const [entered, setEntered] = useState(false);
  useEffect(() => { checkHealth(); }, []);
  return (
    <ToastProvider>
      <AuroraBackground />
      {entered ? (
        <motion.div
          key="app"
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45 }}
        >
          <Shell onHome={() => setEntered(false)} />
        </motion.div>
      ) : (
        <HeroApp onEnter={() => setEntered(true)} />
      )}
    </ToastProvider>
  );
}

function HeroApp({ onEnter }: { onEnter: () => void }) {
  const toast = useToast();
  return (
    <Hero
      onEnter={onEnter}
      onDemo={() => { onEnter(); toast("Launching AI analysis demo…", "info"); setTimeout(() => demoBus.emit(), 500); }}
    />
  );
}

/* tiny event bus so the hero can trigger the demo after the shell mounts */
const demoBus = {
  _fn: null as null | (() => void),
  set(fn: () => void) { this._fn = fn; },
  emit() { this._fn?.(); },
};

function BackendBadge() {
  const { state, mode, gemini } = useBackend();
  const online = state === "online";
  const label =
    state === "checking"
      ? "Connecting…"
      : online
      ? `${mode === "postgres" ? "API · Postgres" : "API · Live"}${gemini ? " · Gemini AI" : ""}`
      : "Demo data";

  return (
    <span
      title={
        online
          ? `Connected to Express backend (${mode}) — ${gemini ? "Gemini AI active" : "Rule-based engine"}`
          : "Backend offline — showing bundled demo data"
      }
      className={`hidden sm:inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full border transition ${
        online
          ? "border-emerald-400/25 text-emerald-300 bg-emerald-400/10"
          : "border-white/10 text-slate-400 bg-white/5"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${online ? "bg-emerald-400 pulse-dot" : "bg-slate-500"}`} />
      {label}
      {gemini && <Sparkles size={11} className="text-violet-300 ml-0.5" />}
    </span>
  );
}

function Shell({ onHome }: { onHome: () => void }) {
  const [page, setPage] = useState<Page>("Dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [demoRunning, setDemoRunning] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [customContract, setCustomContract] = useState<{ filename: string; text: string } | null>(null);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const toast = useToast();
  const { data: stats } = useApi(api.stats, localStats);

  const runDemo = (contract?: { filename: string; text: string }) => {
    if (contract) setCustomContract(contract);
    else setCustomContract(null);
    setPage("AI Analyzer");
    setDemoRunning(true);
    setDemoStep(0);
    toast(`ContractFlow AI is analyzing ${contract?.filename || "demo-contract.pdf"}`, "info");
    const timers = [800, 1600, 2400, 3200, 4000, 4800];
    timers.forEach((ms, i) => setTimeout(() => setDemoStep(i + 1), ms));
    setTimeout(() => {
      setDemoRunning(false);
      toast("Analysis complete — obligations extracted", "success");
    }, 5400);
  };

  demoBus.set(() => runDemo());

  return (
    <div className="min-h-screen text-slate-100">
      <aside className={`fixed z-50 inset-y-0 left-0 w-72 glass border-r border-white/10 p-4 transition-transform lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center gap-3 px-3 py-4 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-electric to-violet flex items-center justify-center shadow-glow">
            <GitBranch size={23} />
          </div>
          <div>
            <div className="font-display font-bold text-lg">ContractFlow <span className="text-blue-400">AI</span></div>
            <div className="text-[10px] uppercase tracking-[.22em] text-slate-500">Contract → Action</div>
          </div>
        </div>
        <div className="space-y-1">
          {nav.map(({ name, icon: Icon }) => (
            <motion.button
              key={name}
              whileHover={{ x: 4 }}
              onClick={() => { setPage(name); setMobileOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition ${page === name ? "bg-gradient-to-r from-blue-500/20 to-violet-500/10 text-blue-200 border border-blue-400/25 shadow-glow" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
            >
              <Icon size={17} /><span>{name}</span>
              {name === "Action Center" && <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-orange-400/10 text-orange-300">{stats.pending_actions}</span>}
            </motion.button>
          ))}
        </div>
        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <button onClick={onHome} className="w-full text-xs text-slate-500 hover:text-blue-300 transition flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5">
            <ArrowRight size={14} className="rotate-180" /> Back to landing
          </button>
          <div className="glass rounded-2xl p-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 pulse-dot" />
              <span>AI Agent: Online</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">Monitoring {stats.contracts} contracts</div>
          </div>
        </div>
      </aside>

      {mobileOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-40 h-16 border-b border-white/10 bg-[#070b17]/70 backdrop-blur-xl flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 rounded-lg hover:bg-white/5" onClick={() => setMobileOpen(!mobileOpen)}><Menu size={20} /></button>
            <div className="hidden sm:block text-sm text-slate-500">Workspace / <span className="text-slate-200">{page}</span></div>
          </div>
          <div className="flex items-center gap-2">
            <BackendBadge />
            <GlowButton variant="ghost" size="sm" className="hidden md:inline-flex" onClick={() => setCopilotOpen(true)} icon={<MessageSquare size={16} />}>Ask Copilot</GlowButton>
            <GlowButton size="sm" onClick={() => runDemo()} icon={<Play size={15} />}>Try Demo</GlowButton>
          </div>
        </header>

        <main className="p-4 md:p-8 max-w-[1600px] mx-auto relative z-10">
          <AnimatePresence mode="wait">
            <motion.div key={page} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .25 }}>
              {page === "Dashboard" && <Dashboard onDemo={() => runDemo()} />}
              {page === "Contracts" && <Contracts onDemo={() => runDemo()} onSelectContract={(c) => runDemo(c)} />}
              {page === "AI Analyzer" && <Analyzer demoRunning={demoRunning} demoStep={demoStep} customContract={customContract} onStartAnalysis={(c) => runDemo(c)} />}
              {page === "Obligations" && <Obligations />}
              {page === "Action Center" && <ActionCenter />}
              {page === "Approvals" && <Approvals />}
              {page === "Compliance" && <Compliance />}
              {page === "Audit Trail" && <AuditTrail />}
              {page === "Integrations" && <Integrations />}
              {page === "AI Copilot" && <Copilot />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {copilotOpen && <CopilotDrawer close={() => setCopilotOpen(false)} />}
      </AnimatePresence>

      {/* Floating copilot FAB */}
      <motion.button
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6, type: "spring" }}
        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
        onClick={() => setCopilotOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-glow-lg"
        aria-label="Open Copilot"
      >
        <Bot size={24} />
        <span className="absolute inset-0 rounded-2xl border border-blue-400/40 animate-pulse-ring" />
      </motion.button>
    </div>
  );
}

function Header({ eyebrow, title, desc }: { eyebrow: string; title: string; desc?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .4 }} className="mb-7">
      <div className="text-xs uppercase tracking-[.2em] text-blue-400 font-semibold mb-2">{eyebrow}</div>
      <h1 className="font-display text-3xl md:text-4xl font-bold text-gradient">{title}</h1>
      {desc && <p className="text-slate-400 mt-2 max-w-3xl">{desc}</p>}
    </motion.div>
  );
}

function Stat({ icon: Icon, label, value, sub, numeric }: { icon: React.ElementType; label: string; value: string; sub: string; numeric?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -4 }} className="glass card-hover rounded-2xl p-5">
      <div className="flex justify-between"><div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500/15 to-violet-500/15 text-blue-300"><Icon size={19} /></div><span className="text-[11px] text-slate-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />LIVE</span></div>
      <div className="mt-5 font-display text-2xl font-bold">{numeric != null ? <AnimatedCounter to={numeric} suffix={value.replace(String(numeric), "")} /> : value}</div>
      <div className="text-sm text-slate-400">{label}</div><div className="text-xs text-emerald-400 mt-2">{sub}</div>
    </motion.div>
  );
}

function Dashboard({ onDemo }: { onDemo: () => void }) {
  const { data: stats } = useApi(api.stats, localStats);
  const { data: tasks } = useApi(api.tasks, localTasks);
  const { data: audit } = useApi(api.audit, localAudit);
  const { data: contracts } = useApi(api.contracts, localContracts);
  const low = contracts.filter((c) => c.risk === "Low").length;
  const med = contracts.filter((c) => c.risk === "Medium").length;
  const high = contracts.filter((c) => c.risk === "High").length;
  const pct = Math.max(1, Math.min(100, stats.compliance_score));
  return (
    <div>
      <Header eyebrow="Workspace Overview" title="Turn Contracts Into Actions." desc="AI that reads your contracts, understands your obligations, and turns them into executable workflows." />
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Stat icon={FileText} label="Contracts" value={String(stats.contracts)} numeric={stats.contracts} sub="+3 this month" />
        <Stat icon={Activity} label="Active Contracts" value={String(stats.active_contracts)} numeric={stats.active_contracts} sub={`${Math.round((stats.active_contracts / Math.max(1, stats.contracts)) * 100)}% active`} />
        <Stat icon={ListChecks} label="Pending Actions" value={String(stats.pending_actions)} numeric={stats.pending_actions} sub="5 high priority" />
        <Stat icon={AlertTriangle} label="Overdue Actions" value={String(stats.overdue_actions)} numeric={stats.overdue_actions} sub="Needs attention" />
        <Stat icon={ShieldCheck} label="Compliance Score" value={`${stats.compliance_score}%`} numeric={stats.compliance_score} sub="+4.2% this month" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mt-5">
        <Reveal className="lg:col-span-2">
          <section className="glass rounded-2xl p-5 h-full">
            <div className="flex items-center justify-between mb-5"><div><h2 className="font-semibold text-lg">Upcoming Deadlines</h2><p className="text-xs text-slate-500">AI-detected contractual dates</p></div><CalendarDays size={20} className="text-blue-300" /></div>
            {tasks.slice(0, 3).map((t, i) => (
              <motion.div key={t.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="flex items-center gap-4 py-4 border-t border-white/5 hover:bg-white/[.02] rounded-lg px-2 transition">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center"><Clock3 size={18} className="text-slate-400" /></div>
                <div className="flex-1"><div className="text-sm font-medium">{t.title}</div><div className="text-xs text-slate-500">{t.owner} · Due {t.due}</div></div>
                <Badge text={t.priority} tone={t.priority} />
              </motion.div>
            ))}
          </section>
        </Reveal>
        <Reveal delay={0.1}>
          <section className="glass rounded-2xl p-5 h-full">
            <h2 className="font-semibold text-lg">Contract Risk Overview</h2>
            <div className="flex items-center justify-center py-7">
              <motion.div initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ duration: 1 }} className="relative w-36 h-36">
                <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(91,140,255,.15)" strokeWidth="12" />
                  <motion.circle
                    cx="60" cy="60" r="50" fill="none" stroke="url(#g1)" strokeWidth="12" strokeLinecap="round"
                    strokeDasharray={314} initial={{ strokeDashoffset: 314 }} animate={{ strokeDashoffset: 314 - 314 * (pct / 100) }} transition={{ duration: 1.4, delay: .3 }}
                  />
                  <defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#5b8cff" /><stop offset="100%" stopColor="#8b5cf6" /></linearGradient></defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center"><div className="font-display text-3xl font-bold"><AnimatedCounter to={stats.compliance_score} suffix="%" /></div><div className="text-xs text-slate-500">compliance</div></div>
              </motion.div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs"><div><b className="text-emerald-400">{low}</b><div className="text-slate-500">Low</div></div><div><b className="text-yellow-400">{med}</b><div className="text-slate-500">Medium</div></div><div><b className="text-red-400">{high}</b><div className="text-slate-500">High</div></div></div>
          </section>
        </Reveal>
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mt-5">
        <Reveal className="lg:col-span-2">
          <section className="glass rounded-2xl p-5 h-full">
            <div className="flex justify-between items-center mb-4"><h2 className="font-semibold text-lg">Recent AI Actions</h2><Sparkles size={18} className="text-violet-300" /></div>
            <div className="space-y-3">{audit.slice(0, 5).map((a, i) => <motion.div className="flex items-center gap-3" key={a.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}><div className="text-xs text-slate-600 w-12">{a.time}</div><div className="w-2 h-2 rounded-full bg-blue-400 shadow-glow" /><div className="text-sm">{a.event}</div><div className="ml-auto text-xs text-slate-500">{a.actor}</div></motion.div>)}</div>
          </section>
        </Reveal>
        <Reveal delay={0.1}>
          <section className="glass rounded-2xl p-5 flex flex-col justify-between h-full relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-violet-500/20 blur-2xl animate-aurora" />
            <div className="relative"><motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: .2 }} className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 w-fit"><Bot size={24} className="text-blue-300" /></motion.div><h2 className="font-semibold text-xl mt-4">See the agent work</h2><p className="text-sm text-slate-400 mt-2">Run the full contract-to-action pipeline against the live backend.</p></div>
            <GlowButton className="mt-6 w-full" variant="success" onClick={onDemo} icon={<ArrowRight size={16} />}>Run Demo Contract</GlowButton>
          </section>
        </Reveal>
      </div>
    </div>
  );
}

function Analyzer({
  demoRunning,
  demoStep,
  customContract,
  onStartAnalysis
}: {
  demoRunning: boolean;
  demoStep: number;
  customContract: { filename: string; text: string } | null;
  onStartAnalysis: (contract: { filename: string; text: string }) => void;
}) {
  const stages = [
    "Reading document & extracting text",
    "Identifying obligations with Google Gemini",
    "Categorizing risk & compliance signals",
    "Detecting critical deadlines & notice periods",
    "Mapping responsible parties & owners",
    "Generating executable action workflow",
  ];
  const [result, setResult] = useState<AnalysisData | null>(null);
  const [activeTab, setActiveTab] = useState<"upload" | "paste">("upload");
  const [pastedText, setPastedText] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  useEffect(() => {
    if (demoRunning) {
      const payload = customContract
        ? { filename: customContract.filename, text: customContract.text }
        : { filename: "demo-contract.pdf" };
      api.analyze(payload).then(setResult);
    }
  }, [demoRunning, customContract]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        onStartAnalysis({ filename: file.name, text });
      } else {
        toast("Unable to read text from file. Please try pasting text directly.", "warn");
      }
    };
    reader.readAsText(file);
  };

  const handleAnalyzePasted = () => {
    if (!pastedText.trim()) {
      toast("Please paste contract text before analyzing", "warn");
      return;
    }
    onStartAnalysis({
      filename: customTitle.trim() ? `${customTitle.trim()}.pdf` : "custom-contract.pdf",
      text: pastedText.trim(),
    });
  };

  const done = demoStep >= 6;

  return (
    <div>
      <Header
        eyebrow="Generative + Agentic AI"
        title="Contract Intelligence"
        desc="Upload a contract or paste legal terms to transform them into structured obligations, deadlines, and executable tasks with Google Gemini."
      />

      {!demoRunning && !done && (
        <div className="space-y-6">
          <div className="glass rounded-3xl p-6 md:p-8">
            <div className="flex gap-2 border-b border-white/10 pb-4 mb-6">
              <button
                onClick={() => setActiveTab("upload")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  activeTab === "upload"
                    ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-glow"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Upload Document
              </button>
              <button
                onClick={() => setActiveTab("paste")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  activeTab === "paste"
                    ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-glow"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Paste Contract Text
              </button>
            </div>

            {activeTab === "upload" ? (
              <motion.div
                initial={{ opacity: 0, scale: .98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border-dashed border-2 border-blue-400/25 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden bg-gradient-to-b from-blue-500/5 to-transparent"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".txt,.md,.json,.pdf,.docx"
                  className="hidden"
                />
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 text-blue-300 flex items-center justify-center mb-4"
                >
                  <CloudUpload size={30} />
                </motion.div>
                <h3 className="text-xl font-semibold">Upload Your Agreement</h3>
                <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
                  Drag and drop any contract text or select a file to run AI clause extraction.
                </p>
                <div className="flex flex-wrap gap-3 justify-center mt-6">
                  <GlowButton onClick={() => fileInputRef.current?.click()} icon={<CloudUpload size={16} />}>
                    Choose File (.txt, .md, .pdf)
                  </GlowButton>
                  <GlowButton
                    variant="ghost"
                    onClick={() => onStartAnalysis(SAMPLE_PRESETS[0])}
                    icon={<Play size={15} />}
                  >
                    Load Sample MSA
                  </GlowButton>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <input
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Contract Title (e.g. Master Vendor Agreement 2026)"
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-blue-400/50"
                />
                <textarea
                  rows={8}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste contract text, clauses, SLA terms, or payment conditions here..."
                  className="w-full rounded-xl bg-white/5 border border-white/10 p-4 text-sm font-mono outline-none focus:border-blue-400/50 text-slate-200"
                />
                <div className="flex justify-between items-center flex-wrap gap-3">
                  <div className="flex gap-2">
                    {SAMPLE_PRESETS.map((p) => (
                      <button
                        key={p.name}
                        onClick={() => {
                          setCustomTitle(p.name);
                          setPastedText(p.text);
                        }}
                        className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 transition"
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                  <GlowButton onClick={handleAnalyzePasted} icon={<Sparkles size={16} />}>
                    Analyze with Gemini AI
                  </GlowButton>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {demoRunning && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-7">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Sparkles className="text-blue-300 animate-spin-slow" />
            </div>
            <div>
              <h2 className="font-semibold">ContractFlow AI is analyzing…</h2>
              <p className="text-xs text-slate-500">
                {customContract ? customContract.filename : "Vendor Agreement · demo-contract.pdf"}
              </p>
            </div>
          </div>
          <div className="mb-6 h-1.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-violet-500"
              animate={{ width: `${(demoStep / 6) * 100}%` }}
              transition={{ duration: .6 }}
            />
          </div>
          <div className="space-y-4">
            {stages.map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition ${
                    demoStep > i
                      ? "bg-emerald-500/15 text-emerald-300"
                      : demoStep === i
                      ? "bg-blue-500/15 text-blue-300 animate-pulse"
                      : "bg-white/5 text-slate-600"
                  }`}
                >
                  {demoStep > i ? <Check size={14} /> : i + 1}
                </div>
                <span className={demoStep >= i ? "text-slate-200" : "text-slate-600"}>{s}...</span>
                {demoStep === i && <span className="ml-auto text-xs text-blue-300">processing</span>}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {done && <AnalysisResult data={result ?? localAnalysis} onReset={() => setResult(null)} />}
    </div>
  );
}

function AnalysisResult({ data, onReset }: { data: AnalysisData; onReset?: () => void }) {
  const highRisk = data.clauses.filter((c) => c.risk === "High").length;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      <div className="flex justify-between items-center bg-white/[.02] p-4 rounded-2xl border border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/15 text-blue-300">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="text-sm font-semibold">{data.filename}</div>
            <div className="text-xs text-slate-400">
              Engine: <span className="text-blue-300 font-medium">{data.engine === "llm" ? "Google Gemini AI" : "Simulated Rule Engine"}</span>
            </div>
          </div>
        </div>
        {onReset && (
          <GlowButton variant="ghost" size="sm" onClick={onReset}>
            Analyze Another Document
          </GlowButton>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat icon={FileCheck2} label="Contract Type" value={data.contract_type} sub="Agreement" />
        <Stat icon={Activity} label="Status" value={data.status} sub="Monitoring" />
        <Stat icon={AlertTriangle} label="Risk Level" value={data.risk} sub={`${highRisk} high-risk items`} />
        <Stat icon={CalendarDays} label="Important Dates" value={String(data.important_dates)} numeric={data.important_dates} sub="AI detected" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <section className="glass rounded-2xl p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">AI Executive Summary</h2>
            <span className="text-sm text-blue-300 flex items-center gap-1">
              <Sparkles size={14} /> AI Confidence: {data.confidence}%
            </span>
          </div>
          <p className="text-slate-300 leading-7 mt-4">{data.summary}</p>
          <div className="mt-5 h-2 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${data.confidence}%` }}
              transition={{ duration: 1.2, delay: .2 }}
              className="h-full bg-gradient-to-r from-blue-500 to-violet-500"
            />
          </div>
          <div className="mt-3 text-[11px] text-slate-500">
            Source: {data.filename} · AI Model: {data.engine === "llm" ? "Gemini 3.x Flash" : "Rule Matching Engine"}
          </div>
        </section>
        <section className="glass rounded-2xl p-5">
          <h2 className="font-semibold">Agent Next Steps</h2>
          <div className="space-y-3 mt-4">
            {data.next_steps.map((x, i) => (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 text-sm"
                key={x}
              >
                <CheckCircle2 size={17} className="text-emerald-400 shrink-0" />
                <span>{x}</span>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
      <ClauseTable clauses={data.clauses} />
      <Workflow nodes={data.workflow} />
    </motion.div>
  );
}

type ClauseRow = { type: string; party: string; deadline: string; risk: string; status: string };

function ClauseTable({ clauses }: { clauses: ClauseRow[] }) {
  const [sel, setSel] = useState<string | null>(null);
  return (
    <section className="glass rounded-2xl overflow-hidden">
      <div className="p-5 border-b border-white/5 flex items-center justify-between">
        <h2 className="font-semibold">Extracted Obligations & Clauses</h2>
        <span className="text-xs text-slate-500">Click a row to inspect</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase text-slate-500 bg-white/[.02]">
            <tr>
              {["Clause", "Responsible Party", "Deadline", "Risk", "Status"].map((x) => (
                <th className="text-left p-4" key={x}>{x}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clauses.map((c, i) => (
              <tr
                key={c.type + i}
                onClick={() => setSel(sel === c.type ? null : c.type)}
                className={`border-t border-white/5 cursor-pointer transition ${sel === c.type ? "bg-blue-500/10" : "hover:bg-white/[.03]"}`}
              >
                <td className="p-4 font-medium flex items-center gap-2">
                  {sel === c.type && <ChevronRight size={14} className="text-blue-300" />}
                  {c.type}
                </td>
                <td className="p-4 text-slate-400">{c.party}</td>
                <td className="p-4 text-slate-400">{c.deadline}</td>
                <td className="p-4"><Badge text={c.risk} tone={c.risk} /></td>
                <td className="p-4"><span className="text-slate-300">{c.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AnimatePresence>
        {sel && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-white/5 bg-blue-500/[.04]">
            <div className="p-5 text-sm text-slate-300">
              Inspecting <b className="text-blue-300">{sel}</b> — AI mapped this clause to its responsible party and generated a tracked obligation with an automated reminder schedule.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Workflow({ nodes }: { nodes: string[] }) {
  return (
    <section className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-5">
        <Network size={18} className="text-violet-300" />
        <h2 className="font-semibold">AI Execution Workflow</h2>
      </div>
      <div className="grid md:grid-cols-7 gap-2 items-center">
        {nodes.map((n, i) => (
          <div key={n} className="contents">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ scale: 1.05, y: -3 }}
              className="rounded-xl p-3 min-h-20 bg-gradient-to-br from-white/[.04] to-white/[.01] border border-white/10 flex flex-col justify-between hover:border-blue-400/40 transition"
            >
              <span className="text-[10px] text-blue-300">0{i + 1}</span>
              <span className="text-xs">{n}</span>
            </motion.div>
            {i < nodes.length - 1 && <ChevronRight className="hidden md:block text-slate-600" />}
          </div>
        ))}
      </div>
    </section>
  );
}

function Contracts({ onDemo, onSelectContract }: { onDemo: () => void; onSelectContract?: (c: { filename: string; text: string }) => void }) {
  const toast = useToast();
  const { data: contracts } = useApi(api.contracts, localContracts);
  const [q, setQ] = useState("");
  const list = contracts.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <Header eyebrow="Contract Repository" title="Contracts" desc="A single workspace for active agreements, AI risk signals and upcoming renewals." />
      <div className="glass rounded-2xl p-4 mb-5 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 flex-1 min-w-48 border border-white/5 focus-within:border-blue-400/40 transition">
          <Search size={16} className="text-slate-500" />
          <input value={q} onChange={(e) => setQ(e.target.value)} className="bg-transparent outline-none text-sm w-full" placeholder="Search contracts..." />
        </div>
        <GlowButton variant="ghost" size="sm" onClick={onDemo}>Try Demo Contract</GlowButton>
        <GlowButton size="sm" onClick={() => onSelectContract ? onSelectContract(SAMPLE_PRESETS[0]) : toast("Upload flow ready", "info")} icon={<Plus size={15} />}>
          Analyze New
        </GlowButton>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {list.map((c, i) => (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -6 }}
            key={c.id}
            className="glass card-hover rounded-2xl p-5 cursor-pointer"
            onClick={() => onSelectContract?.({ filename: `${c.name}.pdf`, text: `Contract: ${c.name}\nType: ${c.type}\nStatus: ${c.status}` })}
          >
            <div className="flex justify-between">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/15 to-violet-500/15 text-blue-300">
                <FileText size={19} />
              </div>
              <Badge text={c.risk === "High" ? "High Risk" : c.status} tone={c.risk} />
            </div>
            <h3 className="font-semibold mt-5">{c.name}</h3>
            <p className="text-xs text-slate-500 mt-1">Updated {c.updated} · {c.clauses_detected} clauses detected</p>
            <div className="flex justify-between mt-5 text-xs"><span className="text-slate-400">Compliance</span><span>{c.compliance}%</span></div>
            <div className="h-1.5 bg-white/5 rounded mt-2">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${c.compliance}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: i * 0.05 }}
                className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded"
              />
            </div>
          </motion.div>
        ))}
        {list.length === 0 && <div className="col-span-full text-center text-slate-500 py-12 text-sm">No contracts match “{q}”.</div>}
      </div>
    </div>
  );
}

function Obligations() {
  const { data: clauses } = useApi(api.clauses, localClauses);
  return (
    <div>
      <Header eyebrow="Clause Intelligence" title="Obligations" desc="Every extracted contractual requirement, mapped to an owner and deadline." />
      <ClauseTable clauses={clauses} />
    </div>
  );
}

function ActionCenter() {
  const { data: tasks, setData } = useApi(api.tasks, localTasks);
  const [filter, setFilter] = useState("All");
  const toast = useToast();
  const complete = async (t: Task) => {
    setData(tasks.map((x) => (x.id === t.id ? { ...x, status: "Completed" } : x)));
    const res = await api.completeTask(t.id);
    if (res) setData((prev) => prev.map((x) => (x.id === t.id ? res : x)));
    toast("Task marked complete & logged to audit trail", "success");
  };
  const shown = tasks.filter((t) =>
    filter === "All"
      ? true
      : filter === "Completed"
      ? t.status === "Completed"
      : filter === "Pending"
      ? t.status === "Pending"
      : filter === "High Risk"
      ? t.priority === "High"
      : filter === "Overdue"
      ? t.status === "Pending"
      : filter === "Awaiting Approval"
      ? t.status === "Awaiting Approval"
      : true
  );
  return (
    <div>
      <Header eyebrow="Agentic Execution" title="AI Action Center" desc="Tasks generated from contract obligations. Routine actions can be automated; high-risk actions can be routed for approval." />
      <div className="flex gap-2 flex-wrap mb-5">
        {["All", "Pending", "Completed", "Overdue", "High Risk", "Awaiting Approval"].map((x) => (
          <button
            onClick={() => setFilter(x)}
            className={`px-3 py-2 rounded-xl text-xs transition ${
              filter === x ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-glow" : "bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
            key={x}
          >
            {x}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        <AnimatePresence>
          {shown.map((t) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="glass card-hover rounded-2xl p-5 flex flex-col md:flex-row md:items-center gap-4"
              key={t.id}
            >
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/15 to-violet-500/15 text-blue-300"><ListChecks size={20} /></div>
              <div className="flex-1"><h3 className="font-semibold">{t.title}</h3><p className="text-xs text-slate-500 mt-1">Responsible: {t.owner} · Due: {t.due}</p></div>
              <Badge text={t.priority} tone={t.priority} />
              <span className={`text-xs ${t.status === "Completed" ? "text-emerald-400" : "text-slate-400"}`}>{t.status}</span>
              <div className="flex gap-2">
                {t.status !== "Completed" && <GlowButton size="sm" variant="success" onClick={() => complete(t)}>Complete</GlowButton>}
                <GlowButton size="sm" variant="ghost" onClick={() => toast(`Reassignment UI for “${t.title}”`, "info")}>Assign</GlowButton>
                <GlowButton size="sm" variant="outline" onClick={() => toast("Routed to approval gateway", "info")}>Approval</GlowButton>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {shown.length === 0 && <div className="text-center text-slate-500 py-12 text-sm">No tasks under “{filter}”.</div>}
      </div>
    </div>
  );
}

function Approvals() {
  const { data: approvals, setData } = useApi(api.approvals, localApprovals);
  const toast = useToast();
  const ap = approvals[0];
  if (!ap) return (
    <div>
      <Header eyebrow="Human-in-the-Loop" title="Approval Gateway" desc="AI handles routine actions while high-risk or uncertain decisions are routed to authorized humans." />
      <div className="text-center text-slate-500 py-12 text-sm">No pending approvals.</div>
    </div>
  );
  const decided = ap.status !== "Awaiting Approval";
  const decide = async (decision: "approve" | "reject") => {
    const status = decision === "approve" ? "Approved" : "Rejected";
    const res = await api.decideApproval(ap.id, decision);
    setData(approvals.map((a) => (a.id === ap.id ? (res ?? { ...a, status }) : a)));
    toast(decision === "approve" ? "Renewal approved — legal team notified" : "Renewal rejected — vendor notified", decision === "approve" ? "success" : "warn");
  };
  return (
    <div>
      <Header eyebrow="Human-in-the-Loop" title="Approval Gateway" desc="AI handles routine actions while high-risk or uncertain decisions are routed to authorized humans." />
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-7 max-w-3xl border border-orange-400/20 relative overflow-hidden">
        {decided && <div className={`absolute inset-0 ${ap.status === "Approved" ? "bg-emerald-500/5" : "bg-red-500/5"} pointer-events-none`} />}
        <div className="relative flex items-start gap-4">
          <motion.div animate={!decided ? { rotate: [0, -6, 6, 0] } : {}} transition={{ duration: 2, repeat: !decided ? Infinity : 0 }} className="p-3 rounded-2xl bg-orange-400/10 text-orange-300">
            <AlertTriangle size={25} />
          </motion.div>
          <div>
            <div className="text-xs uppercase tracking-widest text-orange-300">Approval Required</div>
            <h2 className="font-display text-2xl font-bold mt-2">{ap.title}</h2>
            <p className="text-slate-400 mt-2">AI Recommendation: {ap.recommendation}</p>
          </div>
        </div>
        <div className="relative grid sm:grid-cols-2 gap-4 mt-7">
          <div className="rounded-xl bg-white/[.03] p-4 border border-white/5"><div className="text-xs text-slate-500">Risk Level</div><div className="mt-1 text-red-300 font-semibold">{ap.risk}</div></div>
          <div className="rounded-xl bg-white/[.03] p-4 border border-white/5"><div className="text-xs text-slate-500">Reason</div><div className="mt-1 text-sm">{ap.reason}</div></div>
        </div>
        <div className="relative flex flex-wrap gap-3 mt-7 items-center">
          <GlowButton variant="success" onClick={() => decide("approve")} icon={<Check size={16} />}>{ap.status === "Approved" ? "Approved" : "Approve"}</GlowButton>
          <GlowButton variant="danger" onClick={() => decide("reject")} icon={<X size={16} />}>Reject</GlowButton>
          <GlowButton variant="ghost" onClick={() => toast("Opening contract preview…", "info")}>Review Contract</GlowButton>
          {decided && <motion.span initial={{ opacity: 0, scale: .8 }} animate={{ opacity: 1, scale: 1 }} className={`text-sm font-semibold ${ap.status === "Approved" ? "text-emerald-400" : "text-red-400"}`}>· Decision: {ap.status}</motion.span>}
        </div>
      </motion.div>
    </div>
  );
}

function Compliance() {
  const { data: stats } = useApi(api.stats, localStats);
  const { data: timeline } = useApi(api.timeline, localTimeline);
  return (
    <div>
      <Header eyebrow="Continuous Monitoring" title="Contract Compliance Monitor" desc="Track obligation completion and exceptions across your contract portfolio." />
      <div className="grid lg:grid-cols-4 gap-4">
        <Stat icon={Gauge} label="Overall Compliance" value={`${stats.compliance_score}%`} numeric={stats.compliance_score} sub="+4.2% this month" />
        <Stat icon={CheckCircle2} label="Completed Obligations" value={String(stats.completed_obligations)} numeric={stats.completed_obligations} sub="On schedule" />
        <Stat icon={Clock3} label="Pending Obligations" value={String(stats.pending_obligations)} numeric={stats.pending_obligations} sub="Being monitored" />
        <Stat icon={AlertTriangle} label="Overdue / High Risk" value={String(stats.high_risk)} numeric={stats.high_risk} sub="Needs attention" />
      </div>
      <section className="glass rounded-2xl p-6 mt-5">
        <h2 className="font-semibold">Compliance Timeline</h2>
        <div className="mt-6 space-y-5">
          {timeline.map((x, i) => (
            <motion.div initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex items-center gap-4" key={x.date + x.label}>
              <div className="w-20 text-xs text-slate-500">{x.date}</div>
              <div className={`w-3 h-3 rounded-full ${x.status === "Completed" ? "bg-emerald-400" : "bg-blue-400"} shadow-glow`} />
              <div className="flex-1"><div className="text-sm">{x.label}</div><div className="text-xs text-slate-500">{x.status}</div></div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

function AuditTrail() {
  const { data: audit } = useApi(api.audit, localAudit);
  return (
    <div>
      <Header eyebrow="Governance" title="Immutable Audit Trail" desc="A chronological record of AI analysis, human actions and evidence verification." />
      <section className="glass rounded-2xl p-5">
        {audit.map((a, i) => (
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex gap-4 py-4 border-b border-white/5 last:border-0 hover:bg-white/[.02] rounded-lg px-2 transition" key={a.id}>
            <div className="font-mono text-xs text-slate-500 w-12">{a.time}</div>
            <div className="mt-1 w-2 h-2 rounded-full bg-blue-400 shrink-0 shadow-glow" />
            <div className="flex-1"><div className="text-sm">{a.event}</div><div className="text-xs text-slate-500 mt-1">Actor: {a.actor}</div></div>
            <CheckCircle2 size={16} className="text-emerald-400" />
          </motion.div>
        ))}
      </section>
    </div>
  );
}

function Integrations() {
  const toast = useToast();
  const { data: integrations, setData } = useApi(api.integrations, localIntegrations);
  const toggle = async (it: Integration) => {
    const next = !it.connected;
    setData(integrations.map((x) => (x.id === it.id ? { ...x, connected: next } : x)));
    const res = await api.toggleIntegration(it.id);
    if (res) setData((prev) => prev.map((x) => (x.id === it.id ? res : x)));
    toast(`${it.name} ${next ? "connected" : "disconnected"} successfully`, next ? "success" : "warn");
  };
  return (
    <div>
      <Header eyebrow="Automation Layer" title="Integrations" desc="Connect contract events to calendars, collaboration tools, enterprise systems and custom APIs." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {integrations.map((it, i) => {
          const Icon = INTEGRATION_ICONS[it.name] ?? Link2;
          return (
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="glass card-hover rounded-2xl p-5" key={it.id}>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500/15 to-violet-500/15 flex items-center justify-center text-blue-300"><Icon /></div>
              <h3 className="font-semibold mt-4">{it.name}</h3>
              <p className="text-xs text-slate-500 mt-1">Trigger workflows from detected contract events.</p>
              {it.connected && <div className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1"><CheckCircle2 size={12} />Connected</div>}
              <GlowButton className="w-full mt-5" size="sm" variant={it.connected ? "outline" : "primary"} onClick={() => toggle(it)}>
                {it.connected ? "Disconnect" : "Connect"}
              </GlowButton>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function Copilot() {
  const [msgs, setMsgs] = useState<{ q: string; a: string; model?: string }[]>([
    {
      q: "Which obligations are due this month?",
      a: "There are 3 tracked obligations due this month: the monthly compliance report (Sep 30), vendor invoice processing (Sep 28), and security evidence verification. The monthly compliance report is marked high priority.",
      model: "gemini",
    },
  ]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const { gemini } = useBackend();

  const send = async () => {
    if (!q.trim() || loading) return;
    const query = q.trim();
    setQ("");
    setLoading(true);

    const history = msgs.slice(-4).flatMap((m) => [
      { role: "user" as const, content: m.q },
      { role: "assistant" as const, content: m.a },
    ]);

    try {
      const res = await api.chat({ message: query, history });
      setMsgs((m) => [...m, { q: query, a: res.reply, model: res.model }]);
    } catch {
      setMsgs((m) => [
        ...m,
        {
          q: query,
          a: `Based on your contract portfolio, I see tracked items for payment terms, SLA availability, and renewal notices.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    "What are our highest risk contract clauses?",
    "When is the Vendor Agreement renewal notice due?",
    "What penalties exist for SLA downtime?",
    "Summarize payment terms across active agreements",
  ];

  return (
    <div>
      <Header
        eyebrow="AI Assistant"
        title="ContractFlow Copilot"
        desc="Ask questions about obligations, deadlines, risk signals, and legal terms powered by Google Gemini AI."
      />
      <div className="glass rounded-3xl max-w-4xl mx-auto p-5 md:p-7">
        <div className="flex items-center justify-between p-3 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center text-blue-300">
              <Bot size={22} />
            </div>
            <div>
              <div className="font-semibold flex items-center gap-2">
                ContractFlow Copilot
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-400/10 text-violet-300 border border-violet-400/20">
                  {gemini ? "Gemini 3.x Flash" : "Demo Mode"}
                </span>
              </div>
              <div className="text-xs text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
                Active contract portfolio context loaded
              </div>
            </div>
          </div>
        </div>

        {/* Suggestion Chips */}
        <div className="flex gap-2 flex-wrap my-4">
          {sampleQuestions.map((sq) => (
            <button
              key={sq}
              onClick={() => {
                setQ(sq);
              }}
              className="text-xs px-3 py-1.5 rounded-xl bg-white/5 hover:bg-blue-500/15 text-slate-300 hover:text-blue-200 border border-white/5 transition"
            >
              {sq}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="space-y-4 my-6 max-h-[48vh] overflow-y-auto pr-2">
          {msgs.map((m, i) => (
            <div key={i} className="space-y-2">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="ml-auto max-w-lg p-4 rounded-2xl bg-gradient-to-r from-blue-500/20 to-violet-500/15 border border-blue-400/20 text-sm text-blue-100"
              >
                {m.q}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: .08 }}
                className="max-w-2xl p-4 rounded-2xl bg-white/5 border border-white/5 text-sm text-slate-200 leading-relaxed"
              >
                <div className="flex items-center gap-1.5 text-[11px] text-violet-300 font-semibold mb-1">
                  <Sparkles size={12} /> Copilot Intelligence
                </div>
                {m.a}
              </motion.div>
            </div>
          ))}

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-sm text-slate-400 p-4 rounded-2xl bg-white/5 w-fit">
              <Loader2 size={16} className="animate-spin text-blue-400" />
              Thinking with Gemini AI…
            </motion.div>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-2 pt-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-blue-400/50 transition text-sm text-white"
            placeholder="Ask about contract obligations, SLA risks, renewals..."
          />
          <GlowButton onClick={send} disabled={loading} icon={loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}>
            Send
          </GlowButton>
        </div>
      </div>
    </div>
  );
}

function CopilotDrawer({ close }: { close: () => void }) {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [msgs, setMsgs] = useState<{ q: string; a: string }[]>([]);

  const send = async () => {
    if (!q.trim() || loading) return;
    const query = q.trim();
    setQ("");
    setLoading(true);

    try {
      const res = await api.chat({ message: query });
      setMsgs((m) => [...m, { q: query, a: res.reply }]);
    } catch {
      setMsgs((m) => [
        ...m,
        {
          q: query,
          a: `Based on your contracts, I found relevant obligations for “${query}”.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm" onClick={close}>
      <motion.div
        initial={{ x: 420 }} animate={{ x: 0 }} exit={{ x: 420 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="absolute right-0 top-0 bottom-0 w-full max-w-md glass-strong border-l border-white/10 p-5 shadow-2xl flex flex-col"
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center">
              <Bot className="text-blue-300" size={18} />
            </div>
            <div>
              <b className="text-sm">ContractFlow Copilot</b>
              <div className="text-[10px] text-emerald-400">Gemini AI Connected</div>
            </div>
          </div>
          <button onClick={close} className="p-2 rounded-lg hover:bg-white/5 transition"><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto mt-4 space-y-3 pr-1">
          {msgs.length === 0 && (
            <div className="rounded-2xl bg-white/5 p-4 text-sm text-slate-400 space-y-2">
              <div className="font-semibold text-slate-200">How can I help with your contracts?</div>
              <p className="text-xs">Ask anything about contract terms, risks, owners, or approvals.</p>
              <div className="flex flex-col gap-1.5 pt-2">
                {["What contracts are high risk?", "What obligations are due next?", "Explain our SLA liability terms"].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setQ(suggestion);
                    }}
                    className="text-left text-xs p-2 rounded-lg bg-white/5 hover:bg-white/10 text-blue-200 transition"
                  >
                    👉 {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence>
            {msgs.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                <div className="ml-auto max-w-[85%] p-3 rounded-2xl bg-gradient-to-r from-blue-500/20 to-violet-500/15 border border-blue-400/20 text-xs w-fit text-blue-100">
                  {m.q}
                </div>
                <div className="max-w-[92%] p-3 rounded-2xl bg-white/5 border border-white/5 text-xs text-slate-200 leading-relaxed">
                  {m.a}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 p-3 rounded-2xl bg-white/5 w-fit">
              <Loader2 size={14} className="animate-spin text-blue-400" />
              Thinking with Gemini…
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-4 border-t border-white/10">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 outline-none focus:border-blue-400/50 transition text-xs"
            placeholder="Ask about your contracts..."
          />
          <GlowButton size="sm" onClick={send} disabled={loading} icon={loading ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}>
            Send
          </GlowButton>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Badge({ text, tone }: { text: string; tone: string }) {
  const cls =
    tone === "High"
      ? "text-red-300 bg-red-400/10 border-red-400/20"
      : tone === "Medium"
      ? "text-yellow-300 bg-yellow-400/10 border-yellow-400/20"
      : tone === "Completed"
      ? "text-emerald-300 bg-emerald-400/10 border-emerald-400/20"
      : "text-blue-300 bg-blue-400/10 border-blue-400/20";
  return <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] border ${cls}`}>{text}</span>;
}

export default App;
