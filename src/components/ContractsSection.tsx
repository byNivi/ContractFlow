import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Search, Plus, Edit3, Shield, User, Building2,
  Calendar, CheckCircle2, AlertTriangle, ArrowRight, Tag,
  Layers, ExternalLink, Sparkles
} from "lucide-react";
import { USERS } from "../data";
import type { Contract, UserProfile } from "../data";
import { GlowButton, useToast } from "../ui";
import ContractUpdationModal from "./ContractUpdationModal";

interface ContractsSectionProps {
  currentUser: UserProfile;
  contracts: Contract[];
  onUpdateContracts: (updated: Contract[]) => void;
  onSelectForAnalysis?: (contract: { filename: string; text: string; industry?: string }) => void;
}

export default function ContractsSection({
  currentUser,
  contracts,
  onUpdateContracts,
  onSelectForAnalysis,
}: ContractsSectionProps) {
  const toast = useToast();
  const [q, setQ] = useState("");
  const [industryFilter, setIndustryFilter] = useState("All");
  const [empFilter, setEmpFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [editingContract, setEditingContract] = useState<Contract | null>(null);

  const isBoss = currentUser.role === "boss";

  // Role-based visibility isolation
  const visibleContracts = isBoss
    ? contracts
    : contracts.filter((c) => c.assigned_to === currentUser.id);

  const filtered = visibleContracts.filter((c) => {
    const matchesQ =
      c.name.toLowerCase().includes(q.toLowerCase()) ||
      c.type.toLowerCase().includes(q.toLowerCase()) ||
      c.assigned_name.toLowerCase().includes(q.toLowerCase());
    const matchesIndustry = industryFilter === "All" ? true : c.industry === industryFilter;
    const matchesEmp = isBoss && empFilter !== "All" ? c.assigned_to === empFilter : true;
    const matchesStatus = statusFilter === "All" ? true : c.status === statusFilter;
    return matchesQ && matchesIndustry && matchesEmp && matchesStatus;
  });

  const handleContractSaved = (updated: Contract) => {
    const next = contracts.map((c) => (c.id === updated.id ? updated : c));
    onUpdateContracts(next);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[.2em] text-blue-400 font-semibold mb-1">
            {isBoss ? "Enterprise Legal Repository" : "Personal Contract Portfolio"}
          </div>
          <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
            {isBoss ? "All Enterprise Contracts" : "My Assigned Contracts"}
            <span className="text-xs font-normal px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300">
              {isBoss ? "Boss Mode · All Employees" : `Employee Mode (${currentUser.name})`}
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {isBoss
              ? "Comprehensive enterprise oversight: view, edit, reassign, and audit all agreements across all departments."
              : "Isolated view: you only have access to contracts assigned directly to your profile."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onSelectForAnalysis && (
            <GlowButton
              onClick={() => onSelectForAnalysis({ filename: "custom-agreement.pdf", text: "New uploaded contract text..." })}
              icon={<Plus size={16} />}
            >
              Analyze New Agreement
            </GlowButton>
          )}
        </div>
      </div>

      {/* Filter and Search */}
      <div className="glass rounded-2xl p-4 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 flex-1 min-w-[220px] focus-within:border-blue-400/50">
          <Search size={14} className="text-slate-500" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search contracts by title, type, or lead..."
            className="bg-transparent outline-none text-xs w-full text-white placeholder-slate-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="bg-white/5 border border-white/10 text-xs rounded-xl px-3 py-2 text-slate-300 outline-none focus:border-blue-400/50"
          >
            <option value="All" className="bg-slate-900">All Industries</option>
            <option value="IT & Cloud" className="bg-slate-900">IT & Cloud</option>
            <option value="Civil & Construction" className="bg-slate-900">Civil & Construction</option>
            <option value="Pharma & Biotech" className="bg-slate-900">Pharma & Biotech</option>
            <option value="Manufacturing" className="bg-slate-900">Manufacturing</option>
            <option value="Finance & Banking" className="bg-slate-900">Finance & Banking</option>
          </select>

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

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white/5 border border-white/10 text-xs rounded-xl px-3 py-2 text-slate-300 outline-none focus:border-blue-400/50"
          >
            <option value="All" className="bg-slate-900">All Statuses</option>
            <option value="Active" className="bg-slate-900">Active</option>
            <option value="Under Amendment" className="bg-slate-900">Under Amendment</option>
            <option value="Pending Review" className="bg-slate-900">Pending Review</option>
          </select>
        </div>
      </div>

      {/* Contracts Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass card-hover rounded-3xl p-6 border border-white/10 flex flex-col justify-between relative group"
          >
            <div>
              {/* Header tags */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 text-blue-300 flex items-center justify-center">
                    <FileText size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400">
                      {c.industry}
                    </span>
                    <div className="text-xs text-slate-500">{c.type} · {c.version}</div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold border ${
                      c.risk === "High"
                        ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
                        : c.risk === "Medium"
                        ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                        : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                    }`}
                  >
                    {c.risk} Risk
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold">{c.status}</span>
                </div>
              </div>

              {/* Title & summary */}
              <h3 className="font-display font-bold text-lg text-white mt-4 leading-snug">
                {c.name}
              </h3>

              {c.summary && (
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {c.summary}
                </p>
              )}

              {/* Metadata Badges */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/5 text-xs text-slate-400">
                <div>
                  <div className="text-[11px] text-slate-500">Contract Value</div>
                  <div className="font-display font-bold text-white text-sm">{c.value}</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500">Expiry / Renewal</div>
                  <div className="font-medium text-slate-200">{c.expiry_date}</div>
                </div>
                <div className="col-span-2 flex items-center gap-1.5 pt-1 text-slate-300">
                  <User size={13} className="text-blue-400" />
                  <span>Assigned Lead: <b className="text-white">{c.assigned_name}</b></span>
                </div>
              </div>

              {/* Compliance score bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Compliance Score</span>
                  <span className="font-mono text-emerald-400 font-bold">{c.compliance}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full"
                    style={{ width: `${c.compliance}%` }}
                  />
                </div>
              </div>

              {/* Addendums count */}
              <div className="text-[11px] text-slate-500 mt-3 flex items-center justify-between">
                <span>{c.clauses_detected} clauses tracked</span>
                <span className="text-violet-300 font-mono">
                  {c.amendments?.length || 0} revision addendums
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-5 pt-4 border-t border-white/5">
              <GlowButton
                size="sm"
                variant="primary"
                className="flex-1"
                onClick={() => setEditingContract(c)}
                icon={<Edit3 size={14} />}
              >
                Update / Amend
              </GlowButton>

              {onSelectForAnalysis && (
                <GlowButton
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    onSelectForAnalysis({
                      filename: `${c.name}.pdf`,
                      text: `CONTRACT: ${c.name}\nTYPE: ${c.type}\nINDUSTRY: ${c.industry}\nVALUE: ${c.value}\nSUMMARY: ${c.summary}`,
                      industry: c.industry,
                    })
                  }
                  icon={<Sparkles size={14} />}
                >
                  AI Re-Analyze
                </GlowButton>
              )}
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full glass rounded-2xl p-12 text-center text-slate-500 text-sm">
            No contracts match your search and filter criteria.
          </div>
        )}
      </div>

      {/* Edit / Updation Modal */}
      <AnimatePresence>
        {editingContract && (
          <ContractUpdationModal
            contract={editingContract}
            currentUser={currentUser}
            onClose={() => setEditingContract(null)}
            onSave={handleContractSaved}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
