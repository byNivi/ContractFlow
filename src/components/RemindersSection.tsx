import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, Plus, Calendar, Clock, CheckCircle2, AlertTriangle,
  User, Shield, Mail, MessageSquare, Send, Check, X, Search
} from "lucide-react";
import { USERS } from "../data";
import type { Reminder, UserProfile, Contract } from "../data";
import { GlowButton, useToast } from "../ui";
import { api } from "../api";

interface RemindersSectionProps {
  currentUser: UserProfile;
  reminders: Reminder[];
  contracts: Contract[];
  onUpdateReminders: (updated: Reminder[]) => void;
  prefill?: { title: string; contract_name: string; date: string; time: string } | null;
  onClearPrefill?: () => void;
}

export default function RemindersSection({
  currentUser,
  reminders,
  contracts,
  onUpdateReminders,
  prefill,
  onClearPrefill,
}: RemindersSectionProps) {
  const toast = useToast();
  const [showAddModal, setShowAddModal] = useState(Boolean(prefill));
  const [filter, setFilter] = useState<"All" | "Active" | "Completed">("Active");
  const [search, setSearch] = useState("");

  const isBoss = currentUser.role === "boss";

  // Form State
  const now = new Date();
  const defaultDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate() + 1).padStart(2, "0")}`;

  const [title, setTitle] = useState(prefill?.title || "");
  const [contractId, setContractId] = useState(contracts[0]?.id || "");
  const [targetDate, setTargetDate] = useState(prefill?.date || defaultDate);
  const [targetTime, setTargetTime] = useState(prefill?.time || "10:00 AM");
  const [priority, setPriority] = useState<"High" | "Medium" | "Low">("High");
  const [channel, setChannel] = useState<"In-App & Email" | "Slack Alert" | "Teams Ping" | "SMS Urgent">("In-App & Email");
  const [recipientId, setRecipientId] = useState(isBoss ? "all" : currentUser.id);

  // Filter based on role
  const visibleReminders = isBoss
    ? reminders
    : reminders.filter(
        (r) =>
          r.recipient_role === "all" ||
          r.recipient_id === currentUser.id ||
          r.recipient_role === "employee"
      );

  const filtered = visibleReminders.filter((r) => {
    const matchesFilter = filter === "All" ? true : r.status === filter;
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      (r.contract_name && r.contract_name.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleComplete = async (rem: Reminder) => {
    const updated = await api.completeReminder(rem.id);
    if (updated) {
      const next = reminders.map((r) => (r.id === rem.id ? updated : r));
      onUpdateReminders(next);
      toast(`Reminder “${rem.title}” marked as completed`, "success");
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast("Please enter a reminder title", "warn");
      return;
    }

    const targetContract = contracts.find((c) => c.id === contractId) || contracts[0];
    const targetUser = USERS.find((u) => u.id === recipientId);

    const newRem = await api.addReminder({
      title: title.trim(),
      contract_id: targetContract?.id,
      contract_name: targetContract?.name,
      target_date: targetDate,
      target_time: targetTime,
      priority,
      channel,
      recipient_role: recipientId === "all" ? "all" : isBoss ? "employee" : "employee",
      recipient_id: recipientId === "all" ? undefined : targetUser?.id,
      recipient_name: recipientId === "all" ? "All Team Members" : targetUser?.name || currentUser.name,
      status: "Active",
    });

    onUpdateReminders([newRem, ...reminders]);
    setShowAddModal(false);
    setTitle("");
    onClearPrefill?.();
    toast(`Automated reminder set for ${targetDate} at ${targetTime} via ${channel}`, "success");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[.2em] text-blue-400 font-semibold mb-1">
            Automated Notification Gateway
          </div>
          <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
            Contract Reminders & Alerts
            <span className="text-xs font-normal px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300">
              {isBoss ? "Enterprise Notification Hub" : `My Alerts (${currentUser.name})`}
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure multi-channel reminders (In-App, Email, Slack, Teams) for contract renewals, milestone installments, and critical deadlines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <GlowButton onClick={() => setShowAddModal(true)} icon={<Plus size={16} />}>
            Create Reminder
          </GlowButton>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass rounded-2xl p-4 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2">
          {(["Active", "Completed", "All"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition ${
                filter === st
                  ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-glow"
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 flex-1 md:max-w-xs focus-within:border-blue-400/50">
          <Search size={14} className="text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reminders..."
            className="bg-transparent outline-none text-xs w-full text-white placeholder-slate-500"
          />
        </div>
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {filtered.map((rem, i) => {
          const isCompleted = rem.status === "Completed";
          const isHigh = rem.priority === "High";

          return (
            <motion.div
              key={rem.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`glass card-hover rounded-2xl p-5 border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isCompleted
                  ? "border-white/5 bg-white/[.01] opacity-70"
                  : isHigh
                  ? "border-rose-500/25 bg-rose-500/[.02]"
                  : "border-blue-500/20 bg-blue-500/[.02]"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                    isCompleted
                      ? "bg-white/5 text-slate-500"
                      : isHigh
                      ? "bg-rose-500/15 text-rose-300"
                      : "bg-blue-500/15 text-blue-300"
                  }`}
                >
                  <Bell size={20} />
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={`font-semibold text-sm ${isCompleted ? "line-through text-slate-400" : "text-white"}`}>
                      {rem.title}
                    </h3>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold border ${
                        isHigh
                          ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
                          : "bg-blue-500/15 text-blue-300 border-blue-500/30"
                      }`}
                    >
                      {rem.priority} Priority
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                      {rem.channel}
                    </span>
                  </div>

                  {rem.contract_name && (
                    <div className="text-xs text-slate-400 mt-1">
                      Target Contract: <span className="text-slate-200">{rem.contract_name}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-xs text-slate-400 mt-2 flex-wrap">
                    <span className="flex items-center gap-1 text-blue-300 font-medium">
                      <Calendar size={12} /> {rem.target_date}
                    </span>
                    <span className="flex items-center gap-1 text-violet-300 font-medium">
                      <Clock size={12} /> {rem.target_time}
                    </span>
                    {rem.recipient_name && (
                      <span className="flex items-center gap-1 text-slate-400">
                        <User size={12} /> Recipient: {rem.recipient_name}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!isCompleted ? (
                  <GlowButton
                    size="sm"
                    variant="success"
                    onClick={() => handleComplete(rem)}
                    icon={<CheckCircle2 size={14} />}
                  >
                    Acknowledge / Done
                  </GlowButton>
                ) : (
                  <span className="text-xs text-emerald-400 flex items-center gap-1">
                    <Check size={14} /> Completed
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}

        {filtered.length === 0 && (
          <div className="glass rounded-2xl p-12 text-center text-slate-500 text-sm">
            No reminders under “{filter}”.
          </div>
        )}
      </div>

      {/* Add Reminder Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg glass-strong border border-blue-400/25 rounded-3xl p-6 md:p-8 shadow-2xl relative"
            >
              <h2 className="text-xl font-bold text-white mb-1">Create Reminder Alert</h2>
              <p className="text-xs text-slate-400 mb-5">
                Schedule an automated deadline, installment, or contract renewal reminder.
              </p>

              <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Reminder Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Verify Q3 Vendor Invoicing and Release Wire Transfer"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-400/50"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Related Contract (Optional)</label>
                  <select
                    value={contractId}
                    onChange={(e) => setContractId(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-400/50"
                  >
                    <option value="" className="bg-slate-900">None / General</option>
                    {contracts.map((c) => (
                      <option key={c.id} value={c.id} className="bg-slate-900">{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Target Date</label>
                    <input
                      type="date"
                      required
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-400/50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Target Time</label>
                    <input
                      type="text"
                      value={targetTime}
                      onChange={(e) => setTargetTime(e.target.value)}
                      placeholder="e.g. 10:00 AM"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-400/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Priority</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-400/50"
                    >
                      <option value="High" className="bg-slate-900">High Priority</option>
                      <option value="Medium" className="bg-slate-900">Medium Priority</option>
                      <option value="Low" className="bg-slate-900">Low Priority</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Notification Channel</label>
                    <select
                      value={channel}
                      onChange={(e) => setChannel(e.target.value as any)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-400/50"
                    >
                      <option value="In-App & Email" className="bg-slate-900">In-App & Email</option>
                      <option value="Slack Alert" className="bg-slate-900">Slack Alert</option>
                      <option value="Teams Ping" className="bg-slate-900">Teams Ping</option>
                      <option value="SMS Urgent" className="bg-slate-900">SMS Urgent</option>
                    </select>
                  </div>
                </div>

                {isBoss && (
                  <div>
                    <label className="block text-slate-400 mb-1">Send Alert To</label>
                    <select
                      value={recipientId}
                      onChange={(e) => setRecipientId(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-400/50"
                    >
                      <option value="all" className="bg-slate-900">Broadcast to All Team Members</option>
                      {USERS.map((u) => (
                        <option key={u.id} value={u.id} className="bg-slate-900">{u.name} ({u.title})</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                  <GlowButton
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setShowAddModal(false);
                      onClearPrefill?.();
                    }}
                  >
                    Cancel
                  </GlowButton>
                  <GlowButton type="submit" variant="primary" icon={<Bell size={15} />}>
                    Save Reminder
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
