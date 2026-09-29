import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock, Calendar, CheckCircle2, TrendingUp, Plus, User,
  FileText, Activity, AlertCircle, Sparkles, Filter, Search
} from "lucide-react";
import { USERS } from "../data";
import type { WorkProgress, UserProfile, Contract } from "../data";
import { GlowButton, useToast } from "../ui";
import { api } from "../api";

interface WorkProgressSectionProps {
  currentUser: UserProfile;
  workProgress: WorkProgress[];
  contracts: Contract[];
  onUpdateWorkProgress: (updated: WorkProgress[]) => void;
}

export default function WorkProgressSection({
  currentUser,
  workProgress,
  contracts,
  onUpdateWorkProgress,
}: WorkProgressSectionProps) {
  const toast = useToast();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState<string>("All");
  const [search, setSearch] = useState("");

  // Form State
  const now = new Date();
  const currentDateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const currentTimeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const [contractId, setContractId] = useState(contracts[0]?.id || "");
  const [milestone, setMilestone] = useState("");
  const [progressPct, setProgressPct] = useState(50);
  const [hoursSpent, setHoursSpent] = useState(4.5);
  const [updatedDate, setUpdatedDate] = useState(currentDateStr);
  const [updatedTime, setUpdatedTime] = useState(currentTimeStr);
  const [status, setStatus] = useState<"In Progress" | "Completed" | "Review Pending" | "Delayed">("In Progress");
  const [notes, setNotes] = useState("");
  const [employeeId, setEmployeeId] = useState(currentUser.role === "employee" ? currentUser.id : "emp-ananya");

  const isBoss = currentUser.role === "boss";

  // Role-based visibility
  const visibleLogs = isBoss
    ? workProgress
    : workProgress.filter((w) => w.employee_id === currentUser.id);

  const filteredLogs = visibleLogs.filter((w) => {
    const matchesEmp = isBoss && selectedEmp !== "All" ? w.employee_id === selectedEmp : true;
    const matchesSearch =
      w.milestone.toLowerCase().includes(search.toLowerCase()) ||
      w.contract_name.toLowerCase().includes(search.toLowerCase()) ||
      w.employee_name.toLowerCase().includes(search.toLowerCase());
    return matchesEmp && matchesSearch;
  });

  const totalHours = visibleLogs.reduce((acc, w) => acc + w.hours_spent, 0);
  const avgProgress = visibleLogs.length
    ? Math.round(visibleLogs.reduce((acc, w) => acc + w.progress_pct, 0) / visibleLogs.length)
    : 0;
  const completedCount = visibleLogs.filter((w) => w.progress_pct === 100).length;

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!milestone) {
      toast("Please specify the milestone / task title", "warn");
      return;
    }

    const targetContract = contracts.find((c) => c.id === contractId) || contracts[0];
    const targetEmp = USERS.find((u) => u.id === (isBoss ? employeeId : currentUser.id)) || currentUser;

    const newLog = await api.addWorkProgress({
      employee_id: targetEmp.id,
      employee_name: targetEmp.name,
      contract_id: targetContract?.id || "c1",
      contract_name: targetContract?.name || "Contract Agreement",
      milestone,
      progress_pct: Number(progressPct),
      hours_spent: Number(hoursSpent),
      updated_date: updatedDate,
      updated_time: updatedTime,
      status,
      notes: notes || "Work progress recorded and verified.",
    });

    onUpdateWorkProgress([newLog, ...workProgress]);
    setShowAddModal(false);
    setMilestone("");
    setNotes("");
    toast(`Logged work progress: ${milestone} (${progressPct}%) at ${updatedTime}`, "success");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[.2em] text-blue-400 font-semibold mb-1">
            Activity & Productivity Tracker
          </div>
          <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
            Employee Work Progress & Time Logs
            <span className="text-xs font-normal px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300">
              {isBoss ? "Enterprise Overview (All Employees)" : `My Logs (${currentUser.name})`}
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track employee contract milestones, completion percentage, exact update date & time, and logged working hours.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <GlowButton onClick={() => setShowAddModal(true)} icon={<Plus size={16} />}>
            Log Work Progress
          </GlowButton>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass card-hover rounded-2xl p-5 border border-white/10">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Average Progress</span>
            <TrendingUp size={16} className="text-blue-400" />
          </div>
          <div className="font-display text-3xl font-bold text-white mt-2 flex items-baseline gap-1">
            {avgProgress}
            <span className="text-base text-blue-400">%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"
              style={{ width: `${avgProgress}%` }}
            />
          </div>
        </div>

        <div className="glass card-hover rounded-2xl p-5 border border-white/10">
          <div className="flex justify-between items-center text-xs text-emerald-400">
            <span>Completed Milestones</span>
            <CheckCircle2 size={16} className="text-emerald-400" />
          </div>
          <div className="font-display text-3xl font-bold text-emerald-300 mt-2">
            {completedCount}
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-1">100% completion verified</div>
        </div>

        <div className="glass card-hover rounded-2xl p-5 border border-white/10">
          <div className="flex justify-between items-center text-xs text-violet-400">
            <span>Total Hours Logged</span>
            <Clock size={16} className="text-violet-400" />
          </div>
          <div className="font-display text-3xl font-bold text-violet-300 mt-2">
            {totalHours.toFixed(1)} <span className="text-sm font-normal text-slate-400">hrs</span>
          </div>
          <div className="text-[11px] text-violet-400/80 mt-1">Across active contracts</div>
        </div>

        <div className="glass card-hover rounded-2xl p-5 border border-white/10">
          <div className="flex justify-between items-center text-xs text-amber-400">
            <span>Total Active Entries</span>
            <Activity size={16} className="text-amber-400" />
          </div>
          <div className="font-display text-3xl font-bold text-amber-300 mt-2">
            {visibleLogs.length}
          </div>
          <div className="text-[11px] text-amber-400/80 mt-1">Live timestamped updates</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass rounded-2xl p-4 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-3 flex-1 flex-wrap">
          {isBoss && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Filter by Employee:</span>
              <select
                value={selectedEmp}
                onChange={(e) => setSelectedEmp(e.target.value)}
                className="bg-white/5 border border-white/10 text-xs rounded-xl px-3 py-2 text-white outline-none focus:border-blue-400/50"
              >
                <option value="All" className="bg-slate-900">All Employees</option>
                {USERS.filter((u) => u.role === "employee").map((e) => (
                  <option key={e.id} value={e.id} className="bg-slate-900">{e.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 flex-1 min-w-[200px] focus-within:border-blue-400/50">
            <Search size={14} className="text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by milestone, contract, or employee..."
              className="bg-transparent outline-none text-xs w-full text-white placeholder-slate-500"
            />
          </div>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredLogs.map((log, i) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass card-hover rounded-2xl p-5 border border-white/10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 text-blue-300 flex items-center justify-center font-bold text-sm">
                    {log.employee_name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-white">{log.milestone}</h3>
                    <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <User size={11} className="text-blue-400" />
                      <span>{log.employee_name}</span>
                      <span>·</span>
                      <span className="text-slate-500 truncate max-w-[150px]">{log.contract_name}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold border ${
                    log.status === "Completed"
                      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                      : log.status === "Review Pending"
                      ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                      : log.status === "Delayed"
                      ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
                      : "bg-blue-500/15 text-blue-300 border-blue-500/30"
                  }`}
                >
                  {log.status}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-slate-400">Milestone Progress</span>
                  <span className="font-bold font-mono text-blue-300">{log.progress_pct}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${log.progress_pct}%` }}
                    transition={{ duration: 0.8, delay: i * 0.05 }}
                    className={`h-full rounded-full ${
                      log.progress_pct === 100
                        ? "bg-gradient-to-r from-emerald-400 to-teal-400"
                        : log.progress_pct > 70
                        ? "bg-gradient-to-r from-blue-500 to-violet-500"
                        : "bg-gradient-to-r from-amber-500 to-orange-500"
                    }`}
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="text-xs text-slate-300 bg-white/[.02] p-3 rounded-xl border border-white/5 mt-4 leading-relaxed">
                {log.notes}
              </div>
            </div>

            {/* Date, Time and Hours Spent Footer */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/5 text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-slate-400">
                  <Calendar size={12} className="text-blue-400" /> {log.updated_date}
                </span>
                <span className="flex items-center gap-1 text-violet-300">
                  <Clock size={12} /> {log.updated_time}
                </span>
              </div>

              <div className="font-medium text-slate-300 flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg">
                <TrendingUp size={12} className="text-emerald-400" />
                <span>{log.hours_spent} hrs logged</span>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredLogs.length === 0 && (
          <div className="col-span-full glass rounded-2xl p-12 text-center text-slate-500 text-sm">
            No work progress records found.
          </div>
        )}
      </div>

      {/* Add Work Progress Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg glass-strong border border-blue-400/25 rounded-3xl p-6 md:p-8 shadow-2xl relative"
            >
              <h2 className="text-xl font-bold text-white mb-1">Log Work Progress</h2>
              <p className="text-xs text-slate-400 mb-5">
                Record contract task milestone progress, completion percentage, time spent, and exact timestamps.
              </p>

              <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
                {isBoss && (
                  <div>
                    <label className="block text-slate-400 mb-1">Select Employee</label>
                    <select
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-400/50"
                    >
                      {USERS.filter((u) => u.role === "employee").map((e) => (
                        <option key={e.id} value={e.id} className="bg-slate-900">{e.name} ({e.title})</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-slate-400 mb-1">Associated Contract</label>
                  <select
                    value={contractId}
                    onChange={(e) => setContractId(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-400/50"
                  >
                    {contracts.map((c) => (
                      <option key={c.id} value={c.id} className="bg-slate-900">{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Milestone / Deliverable Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Completed Phase-1 Substructure Site Inspection"
                    value={milestone}
                    onChange={(e) => setMilestone(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-400/50"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-slate-400">Completion Percentage: {progressPct}%</label>
                    <span className="text-blue-400 font-bold font-mono">{progressPct}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={progressPct}
                    onChange={(e) => setProgressPct(Number(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Hours Spent</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      required
                      value={hoursSpent}
                      onChange={(e) => setHoursSpent(Number(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-400/50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-400/50"
                    >
                      <option value="In Progress" className="bg-slate-900">In Progress</option>
                      <option value="Review Pending" className="bg-slate-900">Review Pending</option>
                      <option value="Completed" className="bg-slate-900">Completed</option>
                      <option value="Delayed" className="bg-slate-900">Delayed</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Log Date</label>
                    <input
                      type="date"
                      required
                      value={updatedDate}
                      onChange={(e) => setUpdatedDate(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-400/50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Exact Log Time</label>
                    <input
                      type="text"
                      value={updatedTime}
                      onChange={(e) => setUpdatedTime(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-400/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Notes / Evidence Description</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Details of deliverables completed, site findings, or next steps..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-400/50"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                  <GlowButton type="button" variant="ghost" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </GlowButton>
                  <GlowButton type="submit" variant="primary" icon={<CheckCircle2 size={15} />}>
                    Save Progress Log
                  </GlowButton>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
