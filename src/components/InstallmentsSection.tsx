import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays, Clock, IndianRupee, CheckCircle2, AlertTriangle,
  Plus, Search, Filter, Receipt, ArrowUpRight, Shield, Download,
  Bell, FileText, User
} from "lucide-react";
import { USERS } from "../data";
import type { Installment, UserProfile, Contract } from "../data";
import { GlowButton, useToast } from "../ui";
import { api } from "../api";

interface InstallmentsSectionProps {
  currentUser: UserProfile;
  installments: Installment[];
  contracts: Contract[];
  onUpdateInstallments: (updated: Installment[]) => void;
  onOpenReminderModal?: (prefill: { title: string; contract_name: string; date: string; time: string }) => void;
}

export default function InstallmentsSection({
  currentUser,
  installments,
  contracts,
  onUpdateInstallments,
  onOpenReminderModal,
}: InstallmentsSectionProps) {
  const toast = useToast();
  const [filter, setFilter] = useState<"All" | "Pending" | "Paid" | "Upcoming" | "Overdue">("All");
  const [empFilter, setEmpFilter] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // New installment form state
  const [contractId, setContractId] = useState(contracts[0]?.id || "");
  const [milestoneName, setMilestoneName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("2026-10-15");
  const [dueTime, setDueTime] = useState("05:00 PM");
  const [invoiceNo, setInvoiceNo] = useState("INV-2026-" + Math.floor(100 + Math.random() * 900));
  const [assignedTo, setAssignedTo] = useState(currentUser.role === "employee" ? currentUser.id : "emp-ananya");
  const [notes, setNotes] = useState("");

  const isBoss = currentUser.role === "boss";

  // Role-based visibility
  const visibleInstallments = isBoss
    ? installments
    : installments.filter((i) => i.assigned_to === currentUser.id);

  const filtered = visibleInstallments.filter((i) => {
    const matchesFilter = filter === "All" ? true : i.status === filter;
    const matchesEmp = isBoss && empFilter !== "All" ? i.assigned_to === empFilter : true;
    const matchesSearch =
      i.milestone_name.toLowerCase().includes(search.toLowerCase()) ||
      i.contract_name.toLowerCase().includes(search.toLowerCase()) ||
      i.invoice_no.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesEmp && matchesSearch;
  });

  // Calculate stats
  const parseAmt = (s: string) => Number(s.replace(/[^0-9.-]+/g, "")) || 0;
  const totalAmount = visibleInstallments.reduce((acc, i) => acc + parseAmt(i.amount), 0);
  const paidAmount = visibleInstallments.filter((i) => i.status === "Paid").reduce((acc, i) => acc + parseAmt(i.amount), 0);
  const pendingAmount = visibleInstallments.filter((i) => i.status === "Pending" || i.status === "Upcoming").reduce((acc, i) => acc + parseAmt(i.amount), 0);
  const overdueCount = visibleInstallments.filter((i) => i.status === "Overdue").length;

  const handlePay = async (inst: Installment) => {
    const updated = await api.payInstallment(inst.id);
    if (updated) {
      const next = installments.map((i) => (i.id === inst.id ? updated : i));
      onUpdateInstallments(next);
      toast(`Installment “${inst.milestone_name}” marked as Paid at ${updated.paid_at}`, "success");
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!milestoneName || !amount) {
      toast("Please fill milestone name and amount", "warn");
      return;
    }

    const targetContract = contracts.find((c) => c.id === contractId) || contracts[0];
    const assignedUser = USERS.find((u) => u.id === assignedTo) || currentUser;

    const newInst = await api.addInstallment({
      contract_id: targetContract?.id || "c1",
      contract_name: targetContract?.name || "Contract Agreement",
      milestone_name: milestoneName,
      amount: amount.startsWith("₹") ? amount : `₹${amount}`,
      due_date: dueDate,
      due_time: dueTime,
      status: "Upcoming",
      invoice_no: invoiceNo,
      assigned_to: assignedUser.id,
      assigned_name: assignedUser.name,
      notes: notes || "Added via Installment Schedule Manager",
    });

    onUpdateInstallments([newInst, ...installments]);
    setShowAddModal(false);
    setMilestoneName("");
    setAmount("");
    setNotes("");
    toast(`Added installment: ${milestoneName} (${newInst.amount}) with due date ${dueDate} ${dueTime}`, "success");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[.2em] text-blue-400 font-semibold mb-1">
            Financial Governance & Schedule
          </div>
          <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
            Contract Installment Schedules
            <span className="text-xs font-normal px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300">
              {isBoss ? "Enterprise Ledger" : `Personal Schedule (${currentUser.name})`}
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track contractual milestone payments, payment timestamps, date & time deadlines, and GST invoice receipts in Indian Rupees (₹).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <GlowButton onClick={() => setShowAddModal(true)} icon={<Plus size={16} />}>
            Add Installment
          </GlowButton>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass card-hover rounded-2xl p-5 border border-white/10">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Total Schedule Value</span>
            <IndianRupee size={16} className="text-blue-400" />
          </div>
          <div className="font-display text-2xl font-bold text-white mt-2">
            ₹{totalAmount.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">{visibleInstallments.length} total installments</div>
        </div>

        <div className="glass card-hover rounded-2xl p-5 border border-white/10">
          <div className="flex justify-between items-center text-xs text-emerald-400">
            <span>Paid & Disbursed</span>
            <CheckCircle2 size={16} className="text-emerald-400" />
          </div>
          <div className="font-display text-2xl font-bold text-emerald-300 mt-2">
            ₹{paidAmount.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-1">
            {visibleInstallments.filter((i) => i.status === "Paid").length} milestones cleared via RTGS/NEFT
          </div>
        </div>

        <div className="glass card-hover rounded-2xl p-5 border border-white/10">
          <div className="flex justify-between items-center text-xs text-blue-400">
            <span>Pending / Upcoming</span>
            <Clock size={16} className="text-blue-400" />
          </div>
          <div className="font-display text-2xl font-bold text-blue-300 mt-2">
            ₹{pendingAmount.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-blue-400/80 mt-1">
            {visibleInstallments.filter((i) => i.status === "Pending" || i.status === "Upcoming").length} upcoming payments
          </div>
        </div>

        <div className="glass card-hover rounded-2xl p-5 border border-white/10">
          <div className="flex justify-between items-center text-xs text-rose-400">
            <span>Overdue Risks</span>
            <AlertTriangle size={16} className="text-rose-400" />
          </div>
          <div className="font-display text-2xl font-bold text-rose-300 mt-2">
            {overdueCount} Overdue
          </div>
          <div className="text-[11px] text-rose-400/80 mt-1">Requires immediate payment authorization</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass rounded-2xl p-4 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-1.5 flex-wrap">
          {(["All", "Pending", "Upcoming", "Paid", "Overdue"] as const).map((st) => (
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

        <div className="flex items-center gap-3 flex-1 md:max-w-md">
          {isBoss && (
            <select
              value={empFilter}
              onChange={(e) => setEmpFilter(e.target.value)}
              className="bg-white/5 border border-white/10 text-xs rounded-xl px-3 py-2 text-slate-300 outline-none focus:border-blue-400/50"
            >
              <option value="All" className="bg-slate-900">All Employees</option>
              {USERS.filter((u) => u.role === "employee").map((e) => (
                <option key={e.id} value={e.id} className="bg-slate-900">{e.name}</option>
              ))}
            </select>
          )}

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 flex-1 focus-within:border-blue-400/50">
            <Search size={14} className="text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search milestone, invoice, contract..."
              className="bg-transparent outline-none text-xs w-full text-white placeholder-slate-500"
            />
          </div>
        </div>
      </div>

      {/* Installments Table / List */}
      <div className="space-y-3">
        {filtered.map((inst, i) => {
          const isOverdue = inst.status === "Overdue";
          const isPaid = inst.status === "Paid";
          return (
            <motion.div
              key={inst.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`glass card-hover rounded-2xl p-5 border transition flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                isOverdue
                  ? "border-red-500/30 bg-red-500/[.03]"
                  : isPaid
                  ? "border-emerald-500/20 bg-emerald-500/[.02]"
                  : "border-white/10"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    isPaid
                      ? "bg-emerald-500/15 text-emerald-300"
                      : isOverdue
                      ? "bg-rose-500/15 text-rose-300"
                      : "bg-blue-500/15 text-blue-300"
                  }`}
                >
                  <Receipt size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="font-semibold text-base text-white">{inst.milestone_name}</h3>
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold border ${
                        isPaid
                          ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                          : isOverdue
                          ? "bg-rose-500/15 text-rose-300 border-rose-500/30 animate-pulse"
                          : inst.status === "Pending"
                          ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                          : "bg-blue-500/15 text-blue-300 border-blue-500/30"
                      }`}
                    >
                      {inst.status}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">Invoice: {inst.invoice_no}</span>
                  </div>

                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                    <FileText size={12} className="text-blue-400" />
                    <span>Contract: <b className="text-slate-200">{inst.contract_name}</b></span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-400 mt-2 flex-wrap">
                    <div className="flex items-center gap-1.5 text-blue-300 font-medium">
                      <CalendarDays size={13} />
                      <span>Due Date: {inst.due_date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-violet-300 font-medium">
                      <Clock size={13} />
                      <span>Due Time: {inst.due_time}</span>
                    </div>
                    {isBoss && (
                      <div className="flex items-center gap-1 text-slate-400">
                        <User size={12} />
                        <span>Owner: {inst.assigned_name}</span>
                      </div>
                    )}
                    {inst.paid_at && (
                      <div className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 size={13} />
                        <span>Paid on: {inst.paid_at}</span>
                      </div>
                    )}
                  </div>

                  {inst.notes && (
                    <div className="text-[11px] text-slate-500 mt-2 bg-white/[.02] p-2 rounded-lg border border-white/5">
                      💡 {inst.notes}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex lg:flex-col items-center lg:items-end justify-between gap-3 border-t lg:border-t-0 border-white/5 pt-3 lg:pt-0">
                <div className="text-left lg:text-right">
                  <div className="text-xs text-slate-500">Installment Amount</div>
                  <div className="text-xl font-bold font-display text-gradient">{inst.amount}</div>
                </div>

                <div className="flex items-center gap-2">
                  {!isPaid && (
                    <GlowButton size="sm" variant="success" onClick={() => handlePay(inst)} icon={<CheckCircle2 size={14} />}>
                      Mark Paid
                    </GlowButton>
                  )}
                  <GlowButton
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      if (onOpenReminderModal) {
                        onOpenReminderModal({
                          title: `Payment Due: ${inst.milestone_name} (${inst.amount})`,
                          contract_name: inst.contract_name,
                          date: inst.due_date,
                          time: inst.due_time,
                        });
                      } else {
                        toast(`Reminder created for ${inst.milestone_name}`, "info");
                      }
                    }}
                    icon={<Bell size={14} />}
                  >
                    Set Reminder
                  </GlowButton>
                  <button
                    onClick={() => toast(`Downloaded receipt voucher for ${inst.invoice_no}`, "success")}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
                    title="Download Receipt"
                  >
                    <Download size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {filtered.length === 0 && (
          <div className="glass rounded-2xl p-12 text-center text-slate-500 text-sm">
            No installments found matching your criteria.
          </div>
        )}
      </div>

      {/* Add Installment Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg glass-strong border border-blue-400/25 rounded-3xl p-6 md:p-8 shadow-2xl relative"
            >
              <h2 className="text-xl font-bold text-white mb-1">Add Contract Installment</h2>
              <p className="text-xs text-slate-400 mb-5">
                Define a milestone payment, exact due date, and due time schedule.
              </p>

              <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Target Contract</label>
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
                  <label className="block text-slate-400 mb-1">Milestone Name / Purpose</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Substructure Milestone 2 Completion"
                    value={milestoneName}
                    onChange={(e) => setMilestoneName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-400/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Amount (₹ INR)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ₹4,50,000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-400/50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Invoice / Reference No.</label>
                    <input
                      type="text"
                      value={invoiceNo}
                      onChange={(e) => setInvoiceNo(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-400/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Due Date</label>
                    <input
                      type="date"
                      required
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-400/50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Exact Due Time</label>
                    <input
                      type="text"
                      value={dueTime}
                      placeholder="e.g. 05:00 PM"
                      onChange={(e) => setDueTime(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-400/50"
                    />
                  </div>
                </div>

                {isBoss && (
                  <div>
                    <label className="block text-slate-400 mb-1">Assign Responsible Employee</label>
                    <select
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-400/50"
                    >
                      {USERS.filter((u) => u.role === "employee").map((e) => (
                        <option key={e.id} value={e.id} className="bg-slate-900">{e.name} ({e.title})</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-slate-400 mb-1">Notes / Verification Conditions</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Requires site engineer physical certificate prior to wire release."
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-400/50"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                  <GlowButton type="button" variant="ghost" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </GlowButton>
                  <GlowButton type="submit" variant="primary" icon={<Plus size={15} />}>
                    Save Installment
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
