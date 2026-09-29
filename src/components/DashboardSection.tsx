import React from "react";
import { motion } from "framer-motion";
import {
  FileText, Activity, AlertTriangle, ShieldCheck, Clock,
  CalendarDays, IndianRupee, TrendingUp, CheckCircle2, Bot,
  ArrowRight, User, AlertCircle, Sparkles
} from "lucide-react";
import type {
  Contract, DeadlineIssue, Installment, Stats, Task, UserProfile, WorkProgress
} from "../data";
import { AnimatedCounter, GlowButton, Reveal } from "../ui";

interface DashboardSectionProps {
  currentUser: UserProfile;
  contracts: Contract[];
  tasks: Task[];
  installments: Installment[];
  workProgress: WorkProgress[];
  deadlineIssues: DeadlineIssue[];
  stats: Stats;
  onNavigate: (page: string) => void;
  onStartDemo: () => void;
}

export default function DashboardSection({
  currentUser,
  contracts,
  tasks,
  installments,
  workProgress,
  deadlineIssues,
  stats,
  onNavigate,
  onStartDemo,
}: DashboardSectionProps) {
  const isBoss = currentUser.role === "boss";

  // Role-isolated datasets
  const visibleContracts = isBoss
    ? contracts
    : contracts.filter((c) => c.assigned_to === currentUser.id);

  const visibleTasks = isBoss
    ? tasks
    : tasks.filter((t) => t.assigned_to === currentUser.id);

  const visibleInstallments = isBoss
    ? installments
    : installments.filter((i) => i.assigned_to === currentUser.id);

  const visibleWorkProgress = isBoss
    ? workProgress
    : workProgress.filter((w) => w.employee_id === currentUser.id);

  const visibleDeadlineIssues = isBoss
    ? deadlineIssues
    : deadlineIssues.filter((di) => di.assigned_to === currentUser.id);

  const pendingTasks = visibleTasks.filter((t) => t.status !== "Completed");
  const criticalIssues = visibleDeadlineIssues.filter((di) => di.risk_level === "Critical" && di.status !== "Resolved");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="text-xs uppercase tracking-[.2em] text-blue-400 font-semibold mb-1">
          {isBoss ? "Enterprise Command Center" : `Welcome back, ${currentUser.name}`}
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
          {isBoss ? "Executive Contract Intelligence" : "My Contract Workspace"}
          <span className="text-xs font-normal px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300">
            {isBoss ? "Boss Mode (All Employees)" : `Employee Mode (${currentUser.title})`}
          </span>
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          {isBoss
            ? "Holistic view across all staff, contracts, milestone installment schedules, and deadline risk mitigations."
            : "Review your active agreements, upcoming milestone deliverables, payment installments, and task deadlines."}
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="glass card-hover rounded-2xl p-5 border border-white/10">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>{isBoss ? "All Contracts" : "My Contracts"}</span>
            <FileText size={16} className="text-blue-400" />
          </div>
          <div className="font-display text-2xl font-bold text-white mt-2">
            <AnimatedCounter to={visibleContracts.length} />
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">
            {visibleContracts.filter((c) => c.status === "Active").length} active agreements
          </div>
        </div>

        <div className="glass card-hover rounded-2xl p-5 border border-white/10">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Pending Tasks</span>
            <Clock size={16} className="text-amber-400" />
          </div>
          <div className="font-display text-2xl font-bold text-amber-300 mt-2">
            <AnimatedCounter to={pendingTasks.length} />
          </div>
          <div className="text-[11px] text-amber-400/80 mt-1">Actions assigned</div>
        </div>

        <div className="glass card-hover rounded-2xl p-5 border border-white/10">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Upcoming Installments</span>
            <IndianRupee size={16} className="text-blue-400" />
          </div>
          <div className="font-display text-2xl font-bold text-blue-300 mt-2">
            <AnimatedCounter to={visibleInstallments.filter((i) => i.status !== "Paid").length} />
          </div>
          <div className="text-[11px] text-blue-400/80 mt-1">Milestones tracked</div>
        </div>

        <div className="glass card-hover rounded-2xl p-5 border border-white/10">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Critical Deadline Issues</span>
            <AlertTriangle size={16} className="text-rose-400" />
          </div>
          <div className="font-display text-2xl font-bold text-rose-300 mt-2">
            <AnimatedCounter to={criticalIssues.length} />
          </div>
          <div className="text-[11px] text-rose-400/80 mt-1">
            {criticalIssues.length > 0 ? "Requires attention" : "All on schedule"}
          </div>
        </div>

        <div className="glass card-hover rounded-2xl p-5 border border-white/10">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Compliance Score</span>
            <ShieldCheck size={16} className="text-emerald-400" />
          </div>
          <div className="font-display text-2xl font-bold text-emerald-300 mt-2">
            <AnimatedCounter to={isBoss ? stats.compliance_score : 93} suffix="%" />
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-1">+4.2% this quarter</div>
        </div>
      </div>

      {/* Main 2-column layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left 2-columns: Upcoming Deadlines & Milestone Installments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Deadlines Widget */}
          <div className="glass rounded-3xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-lg text-white">Upcoming Obligations & Deadlines</h2>
                <p className="text-xs text-slate-400">AI-detected contractual notice periods and tasks</p>
              </div>
              <CalendarDays size={20} className="text-blue-400" />
            </div>

            <div className="space-y-3">
              {visibleTasks.slice(0, 4).map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[.02] hover:bg-white/5 border border-white/5 transition gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-300 flex items-center justify-center shrink-0">
                      <Clock size={17} />
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-white">{t.title}</div>
                      <div className="text-[11px] text-slate-400">
                        {t.owner} · Due: <span className="text-blue-300 font-medium">{t.due}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full uppercase font-semibold ${
                      t.priority === "High"
                        ? "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                        : "bg-blue-500/15 text-blue-300 border border-blue-500/30"
                    }`}
                  >
                    {t.priority} Priority
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Milestone Installments Widget */}
          <div className="glass rounded-3xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-lg text-white">Upcoming Installment Milestones</h2>
                <p className="text-xs text-slate-400">Scheduled financial disbursements with date & exact time</p>
              </div>
              <GlowButton size="sm" variant="ghost" onClick={() => onNavigate("Installments")}>
                View All
              </GlowButton>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              {visibleInstallments.slice(0, 4).map((inst) => (
                <div
                  key={inst.id}
                  className="p-4 rounded-2xl bg-white/[.02] border border-white/5 space-y-1.5 text-xs"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-white truncate max-w-[170px]">{inst.milestone_name}</span>
                    <span className="font-bold font-display text-gradient">{inst.amount}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">{inst.contract_name}</div>
                  <div className="text-[11px] text-blue-300 flex items-center justify-between pt-1">
                    <span>Due: {inst.due_date}</span>
                    <span className="text-violet-300">{inst.due_time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Work Progress & AI Assistant Launch */}
        <div className="space-y-6">
          {/* Employee Work Progress Activity Widget with Date & Time */}
          <div className="glass rounded-3xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-base text-white">Recent Work Progress Logs</h2>
                <p className="text-xs text-slate-400">Time-stamped milestone activity</p>
              </div>
              <GlowButton size="sm" variant="ghost" onClick={() => onNavigate("Work Progress")}>
                Details
              </GlowButton>
            </div>

            <div className="space-y-3.5">
              {visibleWorkProgress.slice(0, 3).map((w) => (
                <div key={w.id} className="p-3 rounded-xl bg-white/[.02] border border-white/5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white truncate">{w.milestone}</span>
                    <span className="font-bold text-blue-300 font-mono">{w.progress_pct}%</span>
                  </div>

                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full"
                      style={{ width: `${w.progress_pct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                    <span>{w.employee_name}</span>
                    <span className="text-violet-300">{w.updated_date} · {w.updated_time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Industry Problem Solver CTA Card */}
          <div className="glass rounded-3xl p-6 border border-violet-500/20 relative overflow-hidden flex flex-col justify-between space-y-4">
            <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full bg-violet-500/15 blur-2xl pointer-events-none" />
            <div>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 text-violet-300 flex items-center justify-center mb-3 shadow-glow">
                <Bot size={22} />
              </div>
              <h3 className="font-bold text-lg text-white">Multi-Industry AI Solver</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Need immediate legal assessment for SLA downtime, Civil rain delay, or Pharma FDA compliance? Ask the domain solver.
              </p>
            </div>

            <GlowButton
              className="w-full"
              variant="primary"
              onClick={() => onNavigate("Problem Solver AI")}
              icon={<ArrowRight size={15} />}
            >
              Open Problem Solver
            </GlowButton>
          </div>
        </div>
      </div>
    </div>
  );
}
