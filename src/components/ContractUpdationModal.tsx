import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Edit3, Save, X, Plus, History, Clock, Calendar, Check,
  Shield, FileText, User, Building2, Tag, AlertTriangle
} from "lucide-react";
import { USERS } from "../data";
import type { Contract, ContractAmendment, UserProfile } from "../data";
import { GlowButton, useToast } from "../ui";
import { api } from "../api";

interface ContractUpdationModalProps {
  contract: Contract;
  currentUser: UserProfile;
  onClose: () => void;
  onSave: (updated: Contract) => void;
}

export default function ContractUpdationModal({
  contract,
  currentUser,
  onClose,
  onSave,
}: ContractUpdationModalProps) {
  const toast = useToast();
  const isBoss = currentUser.role === "boss";

  const [name, setName] = useState(contract.name);
  const [type, setType] = useState(contract.type);
  const [status, setStatus] = useState(contract.status);
  const [risk, setRisk] = useState(contract.risk);
  const [compliance, setCompliance] = useState(contract.compliance);
  const [value, setValue] = useState(contract.value);
  const [industry, setIndustry] = useState(contract.industry);
  const [expiryDate, setExpiryDate] = useState(contract.expiry_date);
  const [assignedTo, setAssignedTo] = useState(contract.assigned_to);
  const [summary, setSummary] = useState(contract.summary || "");

  // Addendum / Amendment form
  const now = new Date();
  const [newVersion, setNewVersion] = useState(`v${(parseFloat(contract.version.replace("v", "")) + 0.1).toFixed(1)}`);
  const [amendmentNote, setAmendmentNote] = useState("");
  const [showAddendumForm, setShowAddendumForm] = useState(false);

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    const assignedUser = USERS.find((u) => u.id === assignedTo) || currentUser;

    const updated: Contract = {
      ...contract,
      name,
      type,
      status: status as any,
      risk: risk as any,
      compliance: Number(compliance),
      value,
      industry: industry as any,
      expiry_date: expiryDate,
      assigned_to: assignedUser.id,
      assigned_name: assignedUser.name,
      summary,
      updated: "Just now",
    };

    const res = await api.updateContract(updated);
    onSave(res);
    toast(`Contract “${name}” updated successfully`, "success");
    onClose();
  };

  const handleAddAmendment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amendmentNote.trim()) {
      toast("Please enter an amendment note", "warn");
      return;
    }

    const newAmendment: ContractAmendment = {
      version: newVersion,
      date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`,
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      note: amendmentNote.trim(),
      updatedBy: currentUser.name,
    };

    const res = await api.addContractAmendment(contract.id, newAmendment);
    if (res) {
      onSave(res);
      setAmendmentNote("");
      setShowAddendumForm(false);
      toast(`Added Amendment ${newVersion} to contract`, "success");
    }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="w-full max-w-3xl glass-strong border border-blue-400/25 rounded-3xl p-6 md:p-8 shadow-2xl relative my-8"
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-blue-400 font-semibold">
              Contract Amendment & Lifecycle Updation
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
              Edit Contract: {contract.name}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSaveGeneral} className="space-y-4 mt-5 text-xs">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Contract Title</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-blue-400/50"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Contract Type</label>
              <input
                type="text"
                required
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-blue-400/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-400/50"
              >
                <option value="Active" className="bg-slate-900">Active</option>
                <option value="Under Amendment" className="bg-slate-900">Under Amendment</option>
                <option value="Pending Review" className="bg-slate-900">Pending Review</option>
                <option value="Expired" className="bg-slate-900">Expired</option>
                <option value="Terminated" className="bg-slate-900">Terminated</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Risk Level</label>
              <select
                value={risk}
                onChange={(e) => setRisk(e.target.value as any)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-400/50"
              >
                <option value="Low" className="bg-slate-900">Low Risk</option>
                <option value="Medium" className="bg-slate-900">Medium Risk</option>
                <option value="High" className="bg-slate-900">High Risk</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Compliance (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={compliance}
                onChange={(e) => setCompliance(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-400/50"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Financial Value (₹ INR)</label>
              <input
                type="text"
                placeholder="e.g. ₹45,00,000"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-400/50"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Industry Sector</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value as any)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-400/50"
              >
                <option value="IT & Cloud" className="bg-slate-900">IT & Cloud</option>
                <option value="Civil & Construction" className="bg-slate-900">Civil & Construction</option>
                <option value="Pharma & Biotech" className="bg-slate-900">Pharma & Biotech</option>
                <option value="Manufacturing" className="bg-slate-900">Manufacturing</option>
                <option value="Finance & Banking" className="bg-slate-900">Finance & Banking</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Expiration / Renewal Date</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-400/50"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Assigned Lead / Owner</label>
              <select
                value={assignedTo}
                disabled={!isBoss}
                onChange={(e) => setAssignedTo(e.target.value)}
                className={`w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none ${
                  !isBoss ? "opacity-60 cursor-not-allowed" : "focus:border-blue-400/50"
                }`}
              >
                {USERS.filter((u) => u.role === "employee").map((e) => (
                  <option key={e.id} value={e.id} className="bg-slate-900">{e.name} ({e.department})</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Executive Summary / Obligations Scope</label>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-400/50"
            />
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => setShowAddendumForm(!showAddendumForm)}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1.5"
            >
              <Plus size={14} /> {showAddendumForm ? "Hide Addendum Form" : "+ Create Contract Amendment / Addendum"}
            </button>

            <div className="flex gap-2">
              <GlowButton type="button" variant="ghost" onClick={onClose}>
                Cancel
              </GlowButton>
              <GlowButton type="submit" variant="primary" icon={<Save size={14} />}>
                Save Updates
              </GlowButton>
            </div>
          </div>
        </form>

        {/* Addendum / Revision Form */}
        {showAddendumForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-5 p-4 rounded-2xl bg-blue-500/[.04] border border-blue-400/20 text-xs"
          >
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <Edit3 size={14} className="text-blue-400" />
              New Version Addendum / Clause Amendment
            </h3>
            <form onSubmit={handleAddAmendment} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">New Version Identifier</label>
                  <input
                    type="text"
                    required
                    value={newVersion}
                    onChange={(e) => setNewVersion(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-400/50"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Author / Signatory</label>
                  <input
                    type="text"
                    readOnly
                    value={currentUser.name}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-slate-400 outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Amendment Clause & Justification</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Added Force Majeure weather extension clause of 21 days for Monsoon rain impact."
                  value={amendmentNote}
                  onChange={(e) => setAmendmentNote(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-blue-400/50"
                />
              </div>

              <div className="flex justify-end">
                <GlowButton type="submit" size="sm" variant="success" icon={<Check size={14} />}>
                  Commit Amendment ({newVersion})
                </GlowButton>
              </div>
            </form>
          </motion.div>
        )}

        {/* Version History & Revisions Timeline */}
        <div className="mt-6 pt-5 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-3">
            <History size={15} className="text-violet-400" />
            <span>Revision History & Addendums ({contract.amendments?.length || 0})</span>
          </div>

          <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
            {contract.amendments && contract.amendments.length > 0 ? (
              contract.amendments.map((am, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white/[.02] border border-white/5 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-300 px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-400/20 font-mono">
                        {am.version}
                      </span>
                      <span className="text-slate-400">by {am.updatedBy}</span>
                    </div>
                    <p className="text-slate-300">{am.note}</p>
                  </div>
                  <div className="text-[11px] text-slate-500 shrink-0 text-right">
                    <div>{am.date}</div>
                    <div>{am.time}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-500 italic py-2">No prior amendments recorded (Original Version v1.0).</div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
