import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle, Clock, Calendar, ShieldAlert, CheckCircle2,
  ArrowUpRight, Bell, FileText, User, ChevronRight, Filter, Search,
  Flame, Sparkles
} from "lucide-react";
import { USERS } from "../data";
import type { DeadlineIssue, UserProfile } from "../data";
import { GlowButton, useToast } from "../ui";
import { api } from "../api";

interface DeadlineIssuesSectionProps {
  currentUser: UserProfile;
  deadlineIssues: DeadlineIssue[];
  onUpdateDeadlineIssues: (updated: DeadlineIssue[]) => void;
  onOpenReminderModal?: (prefill: { title: string; contract_name: string; date: string; time: string }) => void;
}

export default function DeadlineIssuesSection({
  currentUser,
  deadlineIssues,
  onUpdateDeadlineIssues,
  onOpenReminderModal,
}: DeadlineIssuesSectionProps) {
  const toast = useToast();
  const [filterRisk, setFilterRisk] = useState<"All" | "Critical" | "High" | "Medium">("All");
  const [filterStatus, setFilterStatus] = useState<"All" | "Open" | "Escalated" | "Resolved">("All");
  const [search, setSearch] = useState("");

  const isBoss = currentUser.role === "boss";

  // Role-based visibility
  const visibleIssues = isBoss
    ? deadlineIssues
    : deadlineIssues.filter((di) => di.assigned_to === currentUser.id);

  const filtered = visibleIssues.filter((di) => {
    const matchesRisk = filterRisk === "All" ? true : di.risk_level === filterRisk;
    const matchesStatus = filterStatus === "All" ? true : di.status === filterStatus;
    const matchesSearch =
      di.issue_title.toLowerCase().includes(search.toLowerCase()) ||
      di.contract_name.toLowerCase().includes(search.toLowerCase()) ||
      di.category.toLowerCase().includes(search.toLowerCase());
    return matchesRisk && matchesStatus && matchesSearch;
  });

  const criticalCount = visibleIssues.filter((di) => di.risk_level === "Critical" && di.status !== "Resolved").length;
  const highCount = visibleIssues.filter((di) => di.risk_level === "High" && di.status !== "Resolved").length;
  const overdueCount = visibleIssues.filter((di) => di.days_left < 0 && di.status !== "Resolved").length;
  const resolvedCount = visibleIssues.filter((di) => di.status === "Resolved").length;

  const handleResolve = async (issue: DeadlineIssue) => {
    const updated = await api.updateDeadlineIssue(issue.id, { status: "Resolved" });
    if (updated) {
      const next = deadlineIssues.map((di) => (di.id === issue.id ? updated : di));
      onUpdateDeadlineIssues(next);
      toast(`Issue resolved: ${issue.issue_title}`, "success");
    }
  };

  const handleEscalate = async (issue: DeadlineIssue) => {
    const updated = await api.updateDeadlineIssue(issue.id, { status: "Escalated" });
    if (updated) {
      const next = deadlineIssues.map((di) => (di.id === issue.id ? updated : di));
      onUpdateDeadlineIssues(next);
      toast(`Issue escalated to Executive Boss Vikramaditya Singhania`, "warn");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[.2em] text-rose-400 font-semibold mb-1">
            Breach Prevention & Critical Thresholds
          </div>
          <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
            Deadline Issues & Risk Escalations
            <span className="text-xs font-normal px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-400/20 text-rose-300">
              {isBoss ? "Enterprise Risk Matrix" : `Personal Watchlist (${currentUser.name})`}
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Detect contract obligations at risk of missing statutory, regulatory, or SLA deadlines before breaches trigger penalties.
          </p>
        </div>
      </div>

      {/* KPI Severity Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass card-hover rounded-2xl p-5 border border-rose-500/30 bg-rose-500/[.03]">
          <div className="flex justify-between items-center text-xs text-rose-400">
            <span>Critical Severity</span>
            <Flame size={16} className="text-rose-400 animate-pulse" />
          </div>
          <div className="font-display text-3xl font-bold text-rose-300 mt-2">
            {criticalCount}
          </div>
          <div className="text-[11px] text-rose-400/80 mt-1">Imminent regulatory / SLA breach</div>
        </div>

        <div className="glass card-hover rounded-2xl p-5 border border-amber-500/30 bg-amber-500/[.03]">
          <div className="flex justify-between items-center text-xs text-amber-400">
            <span>High Risk Threshold</span>
            <AlertTriangle size={16} className="text-amber-400" />
          </div>
          <div className="font-display text-3xl font-bold text-amber-300 mt-2">
            {highCount}
          </div>
          <div className="text-[11px] text-amber-400/80 mt-1">Notice periods closing soon</div>
        </div>

        <div className="glass card-hover rounded-2xl p-5 border border-red-500/30 bg-red-500/[.03]">
          <div className="flex justify-between items-center text-xs text-red-400">
            <span>Overdue Obligations</span>
            <Clock size={16} className="text-red-400" />
          </div>
          <div className="font-display text-3xl font-bold text-red-300 mt-2">
            {overdueCount}
          </div>
          <div className="text-[11px] text-red-400/80 mt-1">Cure period currently active</div>
        </div>

        <div className="glass card-hover rounded-2xl p-5 border border-emerald-500/20 bg-emerald-500/[.02]">
          <div className="flex justify-between items-center text-xs text-emerald-400">
            <span>Resolved Mitigations</span>
            <CheckCircle2 size={16} className="text-emerald-400" />
          </div>
          <div className="font-display text-3xl font-bold text-emerald-300 mt-2">
            {resolvedCount}
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-1">Successfully mitigated</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass rounded-2xl p-4 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2 flex-wrap items-center">
          <span className="text-xs text-slate-400">Severity:</span>
          {(["All", "Critical", "High", "Medium"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setFilterRisk(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                filterRisk === r
                  ? "bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-glow"
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {r}
            </button>
          ))}

          <span className="text-xs text-slate-400 ml-2">Status:</span>
          {(["All", "Open", "Escalated", "Resolved"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                filterStatus === s
                  ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-glow"
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 flex-1 md:max-w-xs focus-within:border-blue-400/50">
          <Search size={14} className="text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search deadline issues..."
            className="bg-transparent outline-none text-xs w-full text-white placeholder-slate-500"
          />
        </div>
      </div>

      {/* Deadline Issue Cards */}
      <div className="space-y-4">
        {filtered.map((issue, i) => {
          const isCritical = issue.risk_level === "Critical";
          const isOverdue = issue.days_left < 0;
          const isResolved = issue.status === "Resolved";

          return (
            <motion.div
              key={issue.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`glass card-hover rounded-2xl p-6 border transition relative overflow-hidden ${
                isResolved
                  ? "border-emerald-500/20 bg-emerald-500/[.02]"
                  : isCritical || isOverdue
                  ? "border-rose-500/30 bg-rose-500/[.03]"
                  : "border-amber-500/20 bg-amber-500/[.02]"
              }`}
            >
              {/* Left accent bar */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                  isResolved
                    ? "bg-emerald-500"
                    : isCritical || isOverdue
                    ? "bg-rose-500"
                    : "bg-amber-500"
                }`}
              />

              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider font-bold border ${
                        isResolved
                          ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                          : isCritical
                          ? "bg-rose-500/15 text-rose-300 border-rose-500/30 animate-pulse"
                          : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                      }`}
                    >
                      {issue.risk_level} Risk
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                      {issue.category}
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        isResolved
                          ? "text-emerald-400"
                          : issue.status === "Escalated"
                          ? "text-amber-400"
                          : "text-blue-400"
                      }`}
                    >
                      · Status: {issue.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">{issue.issue_title}</h3>

                  <div className="text-xs text-slate-400 flex items-center gap-2 flex-wrap">
                    <span className="flex items-center gap-1 text-blue-300">
                      <FileText size={13} /> {issue.contract_name}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <User size={13} /> Responsible: <b>{issue.assigned_name}</b>
                    </span>
                  </div>

                  {/* Impact Box */}
                  <div className="text-xs bg-white/[.02] p-3 rounded-xl border border-white/5 text-slate-300">
                    <div className="font-semibold text-rose-300 mb-0.5 flex items-center gap-1.5">
                      <AlertTriangle size={13} /> Contractual Impact & Financial Risk:
                    </div>
                    {issue.impact}
                  </div>

                  {/* Mitigation Box */}
                  <div className="text-xs bg-blue-500/[.03] p-3 rounded-xl border border-blue-400/15 text-blue-200">
                    <div className="font-semibold text-blue-300 mb-0.5 flex items-center gap-1.5">
                      <Sparkles size={13} /> Active Mitigation Action Plan:
                    </div>
                    {issue.mitigation_plan}
                  </div>
                </div>

                {/* Right side deadline & actions */}
                <div className="lg:w-64 shrink-0 flex flex-col justify-between gap-4 border-t lg:border-t-0 border-white/5 pt-4 lg:pt-0">
                  <div className="glass rounded-xl p-3 text-center border border-white/10">
                    <div className="text-[11px] text-slate-400">Deadline Threshold</div>
                    <div className="font-display text-base font-bold text-white mt-0.5">
                      {issue.deadline_date}
                    </div>
                    <div className="text-xs text-violet-300 font-mono">{issue.deadline_time}</div>
                    <div
                      className={`text-xs font-bold mt-2 py-1 rounded-lg ${
                        isOverdue
                          ? "bg-rose-500/20 text-rose-300"
                          : issue.days_left <= 3
                          ? "bg-amber-500/20 text-amber-300"
                          : "bg-blue-500/20 text-blue-300"
                      }`}
                    >
                      {isOverdue ? `Overdue by ${Math.abs(issue.days_left)} days` : `${issue.days_left} days remaining`}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {!isResolved && (
                      <>
                        <GlowButton
                          size="sm"
                          className="w-full"
                          variant="success"
                          onClick={() => handleResolve(issue)}
                          icon={<CheckCircle2 size={14} />}
                        >
                          Resolve Issue
                        </GlowButton>

                        {issue.status !== "Escalated" && (
                          <GlowButton
                            size="sm"
                            className="w-full"
                            variant="danger"
                            onClick={() => handleEscalate(issue)}
                            icon={<ShieldAlert size={14} />}
                          >
                            Escalate to Boss
                          </GlowButton>
                        )}
                      </>
                    )}

                    <GlowButton
                      size="sm"
                      className="w-full"
                      variant="ghost"
                      onClick={() => {
                        if (onOpenReminderModal) {
                          onOpenReminderModal({
                            title: `CRITICAL: ${issue.issue_title}`,
                            contract_name: issue.contract_name,
                            date: issue.deadline_date,
                            time: issue.deadline_time,
                          });
                        } else {
                          toast(`Urgent alert set for ${issue.deadline_date}`, "info");
                        }
                      }}
                      icon={<Bell size={14} />}
                    >
                      Set Urgent Reminder
                    </GlowButton>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {filtered.length === 0 && (
          <div className="glass rounded-2xl p-12 text-center text-slate-500 text-sm">
            No deadline issues found matching the selected filters.
          </div>
        )}
      </div>
    </div>
  );
}
