import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity, AlertTriangle, ArrowRight, Bot, CalendarDays, Check,
  CheckCircle2, ChevronRight, CircleDollarSign, ClipboardCheck,
  Clock3, CloudUpload, IndianRupee, FileCheck2, FileText, Gauge,
  GitBranch, LayoutDashboard, Link2, ListChecks, Loader2, LogOut,
  Mail, Menu, MessageSquare, Network, Play, Plus, Search, Send,
  Shield, ShieldCheck, Sparkles, TrendingUp, User, UserCheck,
  Users, X, Zap, Bell, BarChart3, AlertCircle
} from "lucide-react";
import {
  AnimatedCounter, AuroraBackground, GlowButton, Reveal, ToastProvider, useToast,
} from "./ui";
import Hero from "./Hero";
import { api, checkHealth, useApi, useBackend } from "./api";
import {
  localContracts, localTasks, localApprovals, localStats, localIntegrations,
  localInstallments, localWorkProgress, localDeadlineIssues, localReminders,
  localEmployeeReports, USERS
} from "./data";
import type {
  UserProfile, Contract, Installment, WorkProgress,
  DeadlineIssue, Reminder, Task, Approval, EmployeeReport
} from "./data";

import LoginModal from "./components/LoginModal";
import AIProviderBadge from "./components/AIProviderBadge";
import DashboardSection from "./components/DashboardSection";
import ContractsSection from "./components/ContractsSection";
import AIAnalyzerSection from "./components/AIAnalyzerSection";
import InstallmentsSection from "./components/InstallmentsSection";
import WorkProgressSection from "./components/WorkProgressSection";
import DeadlineIssuesSection from "./components/DeadlineIssuesSection";
import RemindersSection from "./components/RemindersSection";
import EmployeeReportsSection from "./components/EmployeeReportsSection";
import ProblemSolverChatbot from "./components/ProblemSolverChatbot";

type Page =
  | "Dashboard"
  | "Contracts"
  | "AI Analyzer"
  | "Installments"
  | "Work Progress"
  | "Deadline Issues"
  | "Action Center"
  | "Approvals"
  | "Reminders"
  | "Reports & Progress"
  | "Problem Solver AI"
  | "Integrations";

export default function App() {
  const [entered, setEntered] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile>(USERS[0]); // Defaults to Boss Vikramaditya Singhania
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    checkHealth();
  }, []);

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
          <Shell
            currentUser={currentUser}
            onHome={() => setEntered(false)}
            onSwitchUser={() => setShowLoginModal(true)}
            onLogout={() => {
              setEntered(false);
              setShowLoginModal(true);
            }}
          />
        </motion.div>
      ) : (
        <HeroApp
          onEnter={() => {
            setShowLoginModal(true);
          }}
          onDemo={() => {
            setCurrentUser(USERS[0]);
            setEntered(true);
          }}
        />
      )}

      {/* Login & Role Switcher Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <LoginModal
            currentUser={currentUser}
            isInitial={!entered}
            onSelectUser={(user) => {
              setCurrentUser(user);
              setEntered(true);
              setShowLoginModal(false);
            }}
            onClose={() => setShowLoginModal(false)}
          />
        )}
      </AnimatePresence>
    </ToastProvider>
  );
}

function HeroApp({ onEnter, onDemo }: { onEnter: () => void; onDemo: () => void }) {
  const toast = useToast();
  return (
    <Hero
      onEnter={onEnter}
      onDemo={() => {
        onDemo();
        toast("Entering Boss Mode with Enterprise Contract Intelligence…", "info");
      }}
    />
  );
}

function Shell({
  currentUser,
  onHome,
  onSwitchUser,
  onLogout,
}: {
  currentUser: UserProfile;
  onHome: () => void;
  onSwitchUser: () => void;
  onLogout: () => void;
}) {
  const [page, setPage] = useState<Page>("Dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [customContractForAnalysis, setCustomContractForAnalysis] = useState<{
    filename: string;
    text: string;
    industry?: string;
  } | null>(null);

  const [reminderPrefill, setReminderPrefill] = useState<{
    title: string;
    contract_name: string;
    date: string;
    time: string;
  } | null>(null);

  const toast = useToast();
  const isBoss = currentUser.role === "boss";

  // Data hooks with reactive state
  const { data: contracts, setData: setContracts } = useApi(api.contracts, localContracts);
  const { data: tasks, setData: setTasks } = useApi(api.tasks, localTasks);
  const { data: approvals, setData: setApprovals } = useApi(api.approvals, localApprovals);
  const { data: installments, setData: setInstallments } = useApi(api.installments, localInstallments);
  const { data: workProgress, setData: setWorkProgress } = useApi(api.workProgress, localWorkProgress);
  const { data: deadlineIssues, setData: setDeadlineIssues } = useApi(api.deadlineIssues, localDeadlineIssues);
  const { data: reminders, setData: setReminders } = useApi(api.reminders, localReminders);
  const { data: reports } = useApi(api.employeeReports, localEmployeeReports);
  const { data: stats } = useApi(api.stats, localStats);
  const { data: integrations, setData: setIntegrations } = useApi(api.integrations, localIntegrations);

  // Dynamic Navigation based on role (Employee sees Dashboard, Contract, Approvals, Task, etc.)
  const navItems: { name: Page; label: string; icon: React.ElementType; badge?: number }[] = [
    { name: "Dashboard", label: "Dashboard", icon: LayoutDashboard },
    {
      name: "Contracts",
      label: isBoss ? "All Contracts" : "My Contracts",
      icon: FileText,
      badge: isBoss ? contracts.length : contracts.filter((c) => c.assigned_to === currentUser.id).length,
    },
    { name: "AI Analyzer", label: "AI Analyzer (PDF)", icon: Sparkles },
    {
      name: "Installments",
      label: "Installments & Time",
      icon: IndianRupee,
      badge: (isBoss ? installments : installments.filter((i) => i.assigned_to === currentUser.id)).filter(
        (i) => i.status === "Pending" || i.status === "Overdue"
      ).length,
    },
    {
      name: "Work Progress",
      label: isBoss ? "Employee Work Progress" : "My Work Progress",
      icon: TrendingUp,
    },
    {
      name: "Deadline Issues",
      label: "Deadline Issues",
      icon: AlertTriangle,
      badge: (isBoss ? deadlineIssues : deadlineIssues.filter((di) => di.assigned_to === currentUser.id)).filter(
        (di) => di.risk_level === "Critical" && di.status !== "Resolved"
      ).length,
    },
    {
      name: "Action Center",
      label: isBoss ? "Action Center" : "My Tasks",
      icon: ClipboardCheck,
      badge: (isBoss ? tasks : tasks.filter((t) => t.assigned_to === currentUser.id)).filter(
        (t) => t.status !== "Completed"
      ).length,
    },
    {
      name: "Approvals",
      label: "Approvals",
      icon: UserCheck,
      badge: approvals.filter((a) => a.status === "Awaiting Approval").length,
    },
    {
      name: "Reminders",
      label: "Reminders",
      icon: Bell,
      badge: reminders.filter((r) => r.status === "Active").length,
    },
    {
      name: "Reports & Progress",
      label: isBoss ? "Performance Reports" : "My Progress Report",
      icon: BarChart3,
    },
    { name: "Problem Solver AI", label: "Problem Solver AI", icon: Bot },
    ...(isBoss ? [{ name: "Integrations" as Page, label: "Integrations", icon: Link2 }] : []),
  ];

  const handleOpenReminderFromAction = (prefillData: {
    title: string;
    contract_name: string;
    date: string;
    time: string;
  }) => {
    setReminderPrefill(prefillData);
    setPage("Reminders");
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col">
      {/* Sidebar */}
      <aside
        className={`fixed z-50 inset-y-0 left-0 w-72 glass-strong border-r border-white/10 p-4 transition-transform lg:translate-x-0 flex flex-col justify-between ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 px-3 py-4 mb-4">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-glow">
              <GitBranch size={22} className="text-white" />
            </div>
            <div>
              <div className="font-display font-bold text-lg leading-tight text-white">
                ContractFlow <span className="text-blue-400">AI</span>
              </div>
              <div className="text-[10px] uppercase tracking-[.22em] text-slate-400">
                Enterprise Lifecycle
              </div>
            </div>
          </div>

          {/* User Profile Card with Role Switcher Button */}
          <div className="glass rounded-2xl p-3 mb-4 border border-white/10 relative overflow-hidden">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentUser.avatarBg} text-white font-bold text-sm flex items-center justify-center shrink-0 shadow`}
              >
                {currentUser.avatarText}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-xs text-white truncate">{currentUser.name}</div>
                <div className="text-[10px] text-slate-400 truncate">{currentUser.title}</div>
                <div
                  className={`text-[9px] uppercase font-bold tracking-wider inline-block px-2 py-0.5 rounded-full mt-0.5 ${
                    isBoss
                      ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                      : "bg-blue-400/20 text-blue-300 border border-blue-400/30"
                  }`}
                >
                  {isBoss ? "Boss (Main)" : "Employee (User)"}
                </div>
              </div>
            </div>

            <button
              onClick={onSwitchUser}
              className="mt-2.5 w-full text-[11px] py-1.5 px-2.5 rounded-lg bg-white/5 hover:bg-blue-500/15 text-blue-300 hover:text-white border border-white/5 transition flex items-center justify-center gap-1.5"
            >
              <User size={12} /> Switch Role / User
            </button>
          </div>

          {/* Nav List */}
          <div className="space-y-1 max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
            {navItems.map(({ name, label, icon: Icon, badge }) => (
              <motion.button
                key={name}
                whileHover={{ x: 3 }}
                onClick={() => {
                  setPage(name);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                  page === name
                    ? "bg-gradient-to-r from-blue-500/25 to-violet-500/15 text-white border border-blue-400/30 shadow-glow"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={16} className={page === name ? "text-blue-400" : "text-slate-400"} />
                <span className="truncate">{label}</span>
                {badge != null && badge > 0 && (
                  <span
                    className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      name === "Deadline Issues"
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        : "bg-blue-500/15 text-blue-300 border border-blue-500/20"
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-3 border-t border-white/10 space-y-2">
          <button
            onClick={onLogout}
            className="w-full text-xs text-slate-400 hover:text-rose-300 transition flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5"
          >
            <LogOut size={14} /> Log Out / Change Account
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="lg:pl-72 flex-1 flex flex-col">
        {/* Sticky Header */}
        <header className="sticky top-0 z-40 h-16 border-b border-white/10 bg-[#070b17]/80 backdrop-blur-xl flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-xl hover:bg-white/5 text-slate-300"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:block text-xs text-slate-400">
              Workspace / <span className="text-white font-semibold">{page}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* AI Provider Abstraction Badge (Hides API Key from Frontend) */}
            <AIProviderBadge />

            <GlowButton
              size="sm"
              variant="ghost"
              onClick={() => setPage("Problem Solver AI")}
              icon={<Bot size={15} />}
            >
              AI Problem Solver
            </GlowButton>
          </div>
        </header>

        {/* Dynamic Page Views */}
        <main className="p-4 md:p-8 max-w-[1600px] w-full mx-auto flex-1 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={page + currentUser.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {page === "Dashboard" && (
                <DashboardSection
                  currentUser={currentUser}
                  contracts={contracts}
                  tasks={tasks}
                  installments={installments}
                  workProgress={workProgress}
                  deadlineIssues={deadlineIssues}
                  stats={stats}
                  onNavigate={(p) => setPage(p as Page)}
                  onStartDemo={() => {
                    setPage("AI Analyzer");
                    setCustomContractForAnalysis(null);
                  }}
                />
              )}

              {page === "Contracts" && (
                <ContractsSection
                  currentUser={currentUser}
                  contracts={contracts}
                  onUpdateContracts={setContracts}
                  onSelectForAnalysis={(c) => {
                    setCustomContractForAnalysis(c);
                    setPage("AI Analyzer");
                  }}
                />
              )}

              {page === "AI Analyzer" && (
                <AIAnalyzerSection
                  currentUser={currentUser}
                  customContract={customContractForAnalysis}
                  onAnalysisCompleted={(c) => {
                    setContracts([c, ...contracts]);
                    setPage("Contracts");
                    toast(`Contract “${c.name}” added to repository`, "success");
                  }}
                />
              )}

              {page === "Installments" && (
                <InstallmentsSection
                  currentUser={currentUser}
                  installments={installments}
                  contracts={contracts}
                  onUpdateInstallments={setInstallments}
                  onOpenReminderModal={handleOpenReminderFromAction}
                />
              )}

              {page === "Work Progress" && (
                <WorkProgressSection
                  currentUser={currentUser}
                  workProgress={workProgress}
                  contracts={contracts}
                  onUpdateWorkProgress={setWorkProgress}
                />
              )}

              {page === "Deadline Issues" && (
                <DeadlineIssuesSection
                  currentUser={currentUser}
                  deadlineIssues={deadlineIssues}
                  onUpdateDeadlineIssues={setDeadlineIssues}
                  onOpenReminderModal={handleOpenReminderFromAction}
                />
              )}

              {page === "Action Center" && (
                <ActionCenterView
                  currentUser={currentUser}
                  tasks={tasks}
                  onUpdateTasks={setTasks}
                />
              )}

              {page === "Approvals" && (
                <ApprovalsView
                  currentUser={currentUser}
                  approvals={approvals}
                  onUpdateApprovals={setApprovals}
                />
              )}

              {page === "Reminders" && (
                <RemindersSection
                  currentUser={currentUser}
                  reminders={reminders}
                  contracts={contracts}
                  onUpdateReminders={setReminders}
                  prefill={reminderPrefill}
                  onClearPrefill={() => setReminderPrefill(null)}
                />
              )}

              {page === "Reports & Progress" && (
                <EmployeeReportsSection
                  currentUser={currentUser}
                  reports={reports}
                />
              )}

              {page === "Problem Solver AI" && (
                <ProblemSolverChatbot
                  currentUser={currentUser}
                  onOpenReminderModal={handleOpenReminderFromAction}
                />
              )}

              {page === "Integrations" && isBoss && (
                <IntegrationsView
                  integrations={integrations}
                  onUpdateIntegrations={setIntegrations}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Sub-Views: Action Center, Approvals, Integrations
// -------------------------------------------------------------

function ActionCenterView({
  currentUser,
  tasks,
  onUpdateTasks,
}: {
  currentUser: UserProfile;
  tasks: Task[];
  onUpdateTasks: (tasks: Task[]) => void;
}) {
  const toast = useToast();
  const [filter, setFilter] = useState("All");
  const isBoss = currentUser.role === "boss";

  const visibleTasks = isBoss
    ? tasks
    : tasks.filter((t) => t.assigned_to === currentUser.id);

  const complete = async (t: Task) => {
    const updated = await api.completeTask(t.id);
    if (updated) {
      onUpdateTasks(tasks.map((x) => (x.id === t.id ? updated : x)));
      toast(`Task “${t.title}” marked as complete`, "success");
    }
  };

  const shown = visibleTasks.filter((t) =>
    filter === "All"
      ? true
      : filter === "Completed"
      ? t.status === "Completed"
      : filter === "Pending"
      ? t.status === "Pending"
      : filter === "High Priority"
      ? t.priority === "High"
      : filter === "Awaiting Approval"
      ? t.status === "Awaiting Approval"
      : true
  );

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-[.2em] text-blue-400 font-semibold mb-1">
          Execution Engine
        </div>
        <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
          {isBoss ? "Enterprise Action Center & Tasks" : "My Assigned Tasks"}
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Actionable contract requirements and fulfillment tasks mapped from clauses.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap glass p-3 rounded-2xl border border-white/10">
        {["All", "Pending", "Completed", "High Priority", "Awaiting Approval"].map((x) => (
          <button
            onClick={() => setFilter(x)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition ${
              filter === x
                ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-glow"
                : "bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
            key={x}
          >
            {x}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {shown.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass card-hover rounded-2xl p-5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-300 flex items-center justify-center shrink-0">
                <ListChecks size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-white">{t.title}</h3>
                <div className="text-xs text-slate-400 mt-1">
                  Contract: <span className="text-slate-200">{t.contract_name || "General Agreement"}</span> · Owner: <b className="text-blue-300">{t.owner}</b> · Due: {t.due}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`text-[10px] px-2.5 py-0.5 rounded-full uppercase font-semibold ${
                  t.priority === "High"
                    ? "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                    : "bg-blue-500/15 text-blue-300 border border-blue-500/30"
                }`}
              >
                {t.priority}
              </span>

              <span
                className={`text-xs font-medium ${
                  t.status === "Completed" ? "text-emerald-400" : "text-slate-400"
                }`}
              >
                {t.status}
              </span>

              {t.status !== "Completed" && (
                <GlowButton size="sm" variant="success" onClick={() => complete(t)} icon={<Check size={14} />}>
                  Complete
                </GlowButton>
              )}
            </div>
          </motion.div>
        ))}

        {shown.length === 0 && (
          <div className="glass rounded-2xl p-12 text-center text-slate-500 text-sm">
            No tasks under “{filter}”.
          </div>
        )}
      </div>
    </div>
  );
}

function ApprovalsView({
  currentUser,
  approvals,
  onUpdateApprovals,
}: {
  currentUser: UserProfile;
  approvals: Approval[];
  onUpdateApprovals: (approvals: Approval[]) => void;
}) {
  const toast = useToast();
  const isBoss = currentUser.role === "boss";

  const decide = async (ap: Approval, decision: "approve" | "reject") => {
    const updated = await api.decideApproval(ap.id, decision);
    if (updated) {
      onUpdateApprovals(approvals.map((a) => (a.id === ap.id ? updated : a)));
      toast(
        decision === "approve"
          ? `Approved: ${ap.title}`
          : `Rejected: ${ap.title}`,
        decision === "approve" ? "success" : "warn"
      );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-[.2em] text-orange-400 font-semibold mb-1">
          Human-in-the-Loop Governance
        </div>
        <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
          Approval Gateway
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          High-risk contractual decisions and liability amendments routed to authorized executives.
        </p>
      </div>

      <div className="space-y-4">
        {approvals.map((ap) => {
          const decided = ap.status !== "Awaiting Approval";
          return (
            <motion.div
              key={ap.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-3xl p-6 md:p-8 border border-orange-400/25 relative overflow-hidden"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-orange-400/10 text-orange-300">
                  <AlertTriangle size={24} />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-widest text-orange-400 font-bold">
                      {ap.status}
                    </span>
                    <span className="text-xs text-slate-500">· Due: {ap.due_date || "Oct 15, 2026"}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">{ap.title}</h2>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    AI Recommendation: <b className="text-blue-300">{ap.recommendation}</b>
                  </p>
                  <p className="text-xs text-slate-400">Reason: {ap.reason}</p>

                  <div className="flex gap-2 pt-4 flex-wrap">
                    {!decided ? (
                      <>
                        <GlowButton size="sm" variant="success" onClick={() => decide(ap, "approve")} icon={<Check size={14} />}>
                          Approve Decision
                        </GlowButton>
                        <GlowButton size="sm" variant="danger" onClick={() => decide(ap, "reject")} icon={<X size={14} />}>
                          Reject
                        </GlowButton>
                      </>
                    ) : (
                      <span
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${
                          ap.status === "Approved"
                            ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                            : "bg-rose-500/15 text-rose-300 border-rose-500/30"
                        }`}
                      >
                        Status: {ap.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function IntegrationsView({
  integrations,
  onUpdateIntegrations,
}: {
  integrations: typeof localIntegrations;
  onUpdateIntegrations: (it: typeof localIntegrations) => void;
}) {
  const toast = useToast();

  const toggle = async (it: (typeof localIntegrations)[0]) => {
    const next = !it.connected;
    const updated = integrations.map((x) => (x.id === it.id ? { ...x, connected: next } : x));
    onUpdateIntegrations(updated);
    await api.toggleIntegration(it.id);
    toast(`${it.name} ${next ? "connected" : "disconnected"} successfully`, next ? "success" : "warn");
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-[.2em] text-blue-400 font-semibold mb-1">
          Enterprise Integration Layer
        </div>
        <h1 className="font-display text-3xl font-bold text-white">Integrations & Webhooks</h1>
        <p className="text-sm text-slate-400 mt-1">
          Connect contract event triggers with calendars, Slack, Microsoft Teams, and ERP systems.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {integrations.map((it) => (
          <div key={it.id} className="glass card-hover rounded-2xl p-5 border border-white/10 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-300 flex items-center justify-center mb-3">
                <Link2 size={18} />
              </div>
              <h3 className="font-bold text-white text-sm">{it.name}</h3>
              <p className="text-[11px] text-slate-400 mt-1">Trigger alerts and milestone synchronizations.</p>
            </div>

            <GlowButton
              className="w-full mt-4"
              size="sm"
              variant={it.connected ? "outline" : "primary"}
              onClick={() => toggle(it)}
            >
              {it.connected ? "Connected" : "Connect"}
            </GlowButton>
          </div>
        ))}
      </div>
    </div>
  );
}
