import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, Sparkles, Send, Loader2, Code, HardHat, Activity,
  PackageCheck, Landmark, CheckCircle2, Copy, Check, ArrowRight,
  ShieldAlert, BookOpen, Layers, Lightbulb, Bell, FileText
} from "lucide-react";
import { INDUSTRY_SECTORS } from "../data";
import type { IndustrySector, UserProfile } from "../data";
import { GlowButton, useToast } from "../ui";
import { api, useBackend } from "../api";

interface ProblemSolverChatbotProps {
  currentUser: UserProfile;
  onOpenReminderModal?: (prefill: { title: string; contract_name: string; date: string; time: string }) => void;
}

interface ChatHistoryItem {
  id: string;
  sender: "user" | "bot";
  text: string;
  industry?: string;
  remedies?: string[];
  clauseDraft?: string;
  timestamp: string;
}

export default function ProblemSolverChatbot({
  currentUser,
  onOpenReminderModal,
}: ProblemSolverChatbotProps) {
  const toast = useToast();
  const { gemini } = useBackend();
  const [selectedIndustry, setSelectedIndustry] = useState<IndustrySector>(INDUSTRY_SECTORS[0]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatHistoryItem[]>([
    {
      id: "m-welcome",
      sender: "bot",
      text: `### 🌐 Universal Multi-Industry Problem Statement Solver (Indian Legal & Regulatory Active)
Welcome ${currentUser.name}! I am equipped with specialized Indian legal, contractual, and statutory dispute resolution intelligence spanning:
• **IT & Software Sector:** SLA uptime service credits (₹), DPDP Act 2023 data fiduciary compliance, CERT-In reporting, and SOC 2 audits.
• **Civil & Construction Sector:** FIDIC Red Book, monsoon force majeure (Clause 8.4), 5% retention money release, and Section 56 of the Indian Contract Act 1872.
• **Pharma & Healthcare:** CDSCO New Drugs Rules 2019, US FDA 21 CFR Part 11, cold-chain excursion liabilities (₹), and expedited 24h SAE notifications.
• **Manufacturing & Finance:** Incoterms 2020 AQL defects, Sale of Goods Act 1930, RBI DSCR loan covenants, and equity cure mechanisms.

Select an industry sector above or describe your specific contract dispute scenario below to generate instant legal remedies, risk assessments, and amendment clause drafts in Indian Rupees (₹).`,
      industry: "Cross-Industry",
      timestamp: "Just now",
    },
  ]);

  const getIndustryIcon = (iconName: string) => {
    switch (iconName) {
      case "Code": return Code;
      case "HardHat": return HardHat;
      case "Activity": return Activity;
      case "PackageCheck": return PackageCheck;
      case "Landmark": return Landmark;
      default: return Sparkles;
    }
  };

  const handleSend = async (customQuery?: string) => {
    const textToSend = (customQuery || query).trim();
    if (!textToSend || loading) return;

    const userMsg: ChatHistoryItem = {
      id: "u-" + Date.now(),
      sender: "user",
      text: textToSend,
      industry: selectedIndustry.name,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customQuery) setQuery("");
    setLoading(true);

    try {
      const res = await api.chat({
        message: textToSend,
        industry: selectedIndustry.name,
      });

      const botMsg: ChatHistoryItem = {
        id: "b-" + Date.now(),
        sender: "bot",
        text: res.reply,
        industry: selectedIndustry.name,
        remedies: res.remedies,
        clauseDraft: res.clauseDraft,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      toast("Error generating AI solution. Please try again.", "warn");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast("Copied clause draft to clipboard!", "success");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[.2em] text-violet-400 font-semibold mb-1">
            Universal AI Domain Intelligence
          </div>
          <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
            Multi-Industry Problem Statement Solver
            <span className="text-xs font-normal px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-400/20 text-violet-300">
              {gemini ? "Gemini 3.x Flash Engine" : "Legal Intelligence Active"}
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Solve complex contract disputes, calculate SLA/statutory remedies, and generate tailored amendment clauses across IT, Civil, Pharma, Manufacturing, and Finance.
          </p>
        </div>
      </div>

      {/* Industry Sector Selector Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {INDUSTRY_SECTORS.map((sec) => {
          const IconComponent = getIndustryIcon(sec.icon);
          const isSelected = selectedIndustry.id === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setSelectedIndustry(sec)}
              className={`p-3.5 rounded-2xl border text-left transition relative overflow-hidden ${
                isSelected
                  ? `bg-gradient-to-br ${sec.color} text-white shadow-glow border-white/30`
                  : "glass border-white/5 text-slate-300 hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <IconComponent size={18} className={isSelected ? "text-white" : "text-blue-400"} />
                <span className="font-bold text-xs truncate">{sec.name}</span>
              </div>
              <p className={`text-[10px] line-clamp-2 leading-tight ${isSelected ? "text-white/80" : "text-slate-500"}`}>
                {sec.tagline}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Solver Workspace */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column: Preset Industry Problem Statements */}
        <div className="space-y-3">
          <div className="glass rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-2 text-xs font-semibold text-white mb-3">
              <Lightbulb size={16} className="text-amber-400" />
              <span>{selectedIndustry.name} Presets</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Click any real-world dispute scenario to run instant AI legal analysis and remedy formulation:
            </p>

            <div className="space-y-2.5">
              {selectedIndustry.commonIssues.map((issue, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSend(issue.query)}
                  className="p-3 rounded-xl bg-white/[.02] hover:bg-white/5 border border-white/5 hover:border-blue-400/30 cursor-pointer transition text-xs space-y-1 group"
                >
                  <div className="font-semibold text-white group-hover:text-blue-300 flex items-center justify-between">
                    <span>{issue.title}</span>
                    <ArrowRight size={13} className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition" />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{issue.scenario}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-4 border border-white/10 text-xs text-slate-400 space-y-2">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <BookOpen size={14} className="text-blue-400" /> Regulatory Frameworks Loaded
            </div>
            <div className="text-[11px] text-slate-400 space-y-1">
              <div>• <b>FIDIC Red/Yellow Book</b> (Civil Clause 8.4 EOT, 14.9 Retention)</div>
              <div>• <b>FDA 21 CFR Part 11 & ICH GCP</b> (Pharma Biologics)</div>
              <div>• <b>GDPR Art 28 / SOC 2 Type II</b> (IT Data Processing)</div>
              <div>• <b>Incoterms 2020 & ISO 2859-1</b> (Supply Chain AQL)</div>
            </div>
          </div>
        </div>

        {/* Right 2-columns: Chat & Solution Stream */}
        <div className="lg:col-span-2 glass rounded-3xl p-5 md:p-6 border border-white/10 flex flex-col justify-between min-h-[600px]">
          {/* Messages scroll area */}
          <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2 mb-4">
            {messages.map((m) => {
              const isBot = m.sender === "bot";
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${isBot ? "" : "flex-row-reverse"}`}
                >
                  {isBot && (
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-white flex items-center justify-center shrink-0 shadow-glow">
                      <Bot size={20} />
                    </div>
                  )}

                  <div className={`space-y-3 max-w-[88%] ${isBot ? "" : "text-right"}`}>
                    <div
                      className={`p-4 rounded-2xl text-xs leading-relaxed ${
                        isBot
                          ? "bg-white/5 border border-white/10 text-slate-200"
                          : "bg-gradient-to-r from-blue-500/90 to-violet-500/90 text-white shadow-glow text-left"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5">
                        <span className="font-semibold text-blue-300">
                          {isBot ? "ContractFlow Problem Solver" : currentUser.name}
                        </span>
                        <span>{m.timestamp}</span>
                      </div>

                      {/* Render text / markdown */}
                      <div className="whitespace-pre-line font-sans space-y-2">
                        {m.text}
                      </div>

                      {/* Actionable Remedies Checklist */}
                      {m.remedies && m.remedies.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-white/10">
                          <div className="font-bold text-emerald-300 text-xs mb-2 flex items-center gap-1.5">
                            <CheckCircle2 size={13} /> Recommended Immediate Legal Remedies:
                          </div>
                          <div className="space-y-1.5">
                            {m.remedies.map((rem, rIdx) => (
                              <div key={rIdx} className="flex items-start gap-2 text-[11px] text-slate-300">
                                <span className="text-emerald-400 font-bold">✓</span>
                                <span>{rem}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Recommended Clause Drafting */}
                      {m.clauseDraft && (
                        <div className="mt-4 p-3 rounded-xl bg-blue-500/[.06] border border-blue-400/20 text-xs">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-bold text-blue-300 flex items-center gap-1">
                              <FileText size={13} /> Recommended Amendment Clause Draft:
                            </span>
                            <button
                              onClick={() => handleCopy(m.clauseDraft!, m.id)}
                              className="text-[11px] px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition flex items-center gap-1"
                            >
                              {copiedId === m.id ? (
                                <>
                                  <Check size={11} className="text-emerald-400" /> Copied!
                                </>
                              ) : (
                                <>
                                  <Copy size={11} /> Copy Draft
                                </>
                              )}
                            </button>
                          </div>
                          <div className="font-mono text-[11px] text-blue-100 bg-black/30 p-2.5 rounded-lg border border-white/5 italic">
                            "{m.clauseDraft}"
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 text-xs text-slate-400 w-fit">
                <Loader2 size={16} className="animate-spin text-blue-400" />
                <span>Analyzing dispute with Multi-Industry Legal Engine…</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="pt-3 border-t border-white/10 flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={`Ask any ${selectedIndustry.name} problem (e.g. liquidated damages, temperature excursion, uptime SLA)...`}
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs md:text-sm text-white outline-none focus:border-blue-400/50 transition"
            />
            <GlowButton
              onClick={() => handleSend()}
              disabled={loading}
              icon={loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
            >
              Solve Problem
            </GlowButton>
          </div>
        </div>
      </div>
    </div>
  );
}
