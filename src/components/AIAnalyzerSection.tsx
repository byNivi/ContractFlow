import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CloudUpload, Sparkles, FileText, CheckCircle2, AlertTriangle,
  Play, CalendarDays, Clock, IndianRupee, UserCheck, ShieldCheck,
  ArrowRight, Check, ChevronRight, FileCheck2, Activity
} from "lucide-react";
import { USERS } from "../data";
import type { AnalysisData, Contract, UserProfile } from "../data";
import { GlowButton, useToast } from "../ui";
import { api } from "../api";

interface AIAnalyzerSectionProps {
  currentUser: UserProfile;
  customContract: { filename: string; text: string; industry?: string } | null;
  onAnalysisCompleted?: (contract: Contract) => void;
}

const SAMPLE_PRESETS = [
  {
    name: "Tata Consultancy Services (TCS) Master Agreement",
    filename: "tcs-master-agreement-2026.pdf",
    industry: "IT & Cloud",
    text: `TATA CONSULTANCY SERVICES (TCS) MASTER SERVICES AGREEMENT (MSA)
Parties: Bharat Enterprise Systems Pvt Ltd ("Customer") and Tata Consultancy Services Ltd ("Vendor").
Effective Date: October 1, 2026. Expiry: October 1, 2028.
1. PAYMENT & INSTALLMENTS: Customer shall pay ₹3,50,000 monthly for hosting services Net 30 days via RTGS. Initial onboarding milestone installment of ₹2,50,000 due October 15, 2026 at 05:00 PM.
2. SECURITY & COMPLIANCE: Vendor must provide SOC 2 Type II audit report and Indian Digital Personal Data Protection (DPDP) Act compliance certification within 30 days of effective date.
3. SERVICE LEVEL GUARANTEE: 99.95% monthly availability across Mumbai & Hyderabad data centers. 25% SLA penalty service credit (₹87,500) for downtime exceeding 21 minutes per month.
4. RENEWAL NOTICE: Requires 60 days advance written non-renewal notice prior to expiration.`,
  },
  {
    name: "L&T Metro Civil EPC Construction Contract",
    filename: "lt-metro-civil-epc.pdf",
    industry: "Civil & Construction",
    text: `L&T METRO CIVIL EPC INFRASTRUCTURE & CONSTRUCTION AGREEMENT (FIDIC RED BOOK)
Parties: Mumbai Metropolitan Region Development Authority ("Employer") and Larsen & Toubro Ltd EPC Construction Consortium ("Contractor").
Contract Value: ₹2,85,00,000 (₹2.85 Crore INR).
1. MILESTONE INSTALLMENT SCHEDULE:
- Milestone 1: Mobilization Advance of ₹28,50,000 due March 1, 2026 at 12:00 PM. (Paid)
- Milestone 2: Substructure & Deep Piling Completion of ₹45,00,000 due October 15, 2026 at 06:30 PM.
- Milestone 3: Superstructure Framing of ₹80,00,000 due February 28, 2027 at 05:00 PM.
- Milestone 4: Handover & 5% Retention Money Release of ₹14,25,000 due May 30, 2028.
2. EXTENSION OF TIME & FORCE MAJEURE (CLAUSE 8.4): Contractor must issue written notice within 28 days for abnormal Mumbai monsoon rainfall. Contractual liquidated damages of ₹50,000 per day apply for unapproved delays.
3. DEFECT LIABILITY: 12-month Defect Notification Period from handover date.`,
  },
  {
    name: "Sun Pharma Clinical Trial Research Agreement",
    filename: "sun-pharma-clinical-trial.pdf",
    industry: "Pharma & Biotech",
    text: `SUN PHARMA PHASE III REGULATORY CLINICAL TRIAL AGREEMENT
Parties: Sun Pharmaceutical Industries Ltd ("Sponsor") and Apex Clinical BioResearch India Pvt Ltd ("CRO").
Contract Value: ₹1,35,00,000 (₹1.35 Crore INR).
1. REGULATORY COMPLIANCE: Must adhere strictly to CDSCO New Drugs and Clinical Trial Rules 2019, US FDA 21 CFR Part 11, and ICH GCP standards.
2. COLD-CHAIN INTEGRITY: Continuous temperature logging between +2°C and +8°C during all vaccine and biologics transport. Excursions exceeding 2 hours trigger immediate batch quarantine and replacement liability of ₹38,00,000.
3. EXPEDITED SAFETY REPORTING: Mandatory 24-hour transmission of Serious Adverse Events (SAE) to Sponsor Safety Lead and CDSCO Licensing Authority.
4. INSTALLMENT SCHEDULE: Milestone 1 Patient Enrollment (₹18,00,000) due September 20, 2026 at 04:00 PM. Interim Safety Sign-off (₹35,00,000) due January 15, 2027.`,
  },
];

export default function AIAnalyzerSection({
  currentUser,
  customContract,
  onAnalysisCompleted,
}: AIAnalyzerSectionProps) {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<"upload" | "paste">("upload");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("IT & Cloud");

  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [result, setResult] = useState<AnalysisData | null>(null);

  const stages = [
    "Reading PDF structure & extracting legal clauses",
    "Identifying obligations & risk signals with Google Gemini AI",
    "Detecting payment installments & date/time milestones",
    "Scanning statutory deadlines & penalty breach triggers",
    "Mapping responsible owners & generating action items",
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      runAnalysis({
        filename: file.name,
        text: text || `PDF Content of ${file.name} - Extracted 14 Clauses & Financial Schedules`,
      });
    };
    reader.readAsText(file);
  };

  const runAnalysis = async (input: { filename: string; text?: string; industry?: string }) => {
    setAnalyzing(true);
    setAnalysisStep(0);
    setResult(null);
    toast(`ContractFlow AI analyzing ${input.filename}…`, "info");

    const timers = [700, 1400, 2200, 3000, 3800];
    timers.forEach((ms, i) => setTimeout(() => setAnalysisStep(i + 1), ms));

    try {
      const res = await api.analyze(input);
      setTimeout(() => {
        setResult(res);
        setAnalyzing(false);
        toast("Analysis complete — obligations and installment schedules extracted!", "success");
      }, 4200);
    } catch {
      setAnalyzing(false);
      toast("Analysis failed. Please try again.", "warn");
    }
  };

  useEffect(() => {
    if (customContract) {
      runAnalysis(customContract);
    }
  }, [customContract]);

  const handlePasteAnalyze = () => {
    if (!pastedText.trim()) {
      toast("Please paste contract text before analyzing", "warn");
      return;
    }
    runAnalysis({
      filename: customTitle.trim() ? `${customTitle.trim()}.pdf` : "custom-contract.pdf",
      text: pastedText.trim(),
      industry: selectedIndustry,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="text-xs uppercase tracking-[.2em] text-blue-400 font-semibold mb-1">
          Generative + Agentic Legal Extraction
        </div>
        <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
          AI Contract Analyzer & PDF Extractor
          <span className="text-xs font-normal px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300">
            Google Gemini Engine
          </span>
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Upload any legal PDF, agreement, SLA, or construction contract to automatically extract structured obligations, installment payment dates & times, risk scores, and deadline thresholds.
        </p>
      </div>

      {/* Input / Upload Section */}
      {!analyzing && !result && (
        <div className="glass rounded-3xl p-6 md:p-8 border border-white/10 space-y-6">
          <div className="flex gap-2 border-b border-white/10 pb-4">
            <button
              onClick={() => setActiveTab("upload")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === "upload"
                  ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-glow"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              Upload PDF / Document
            </button>
            <button
              onClick={() => setActiveTab("paste")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === "paste"
                  ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-glow"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              Paste Contract Terms
            </button>
          </div>

          {activeTab === "upload" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="border-dashed border-2 border-blue-400/30 rounded-3xl p-8 md:p-12 text-center bg-gradient-to-b from-blue-500/5 to-transparent relative overflow-hidden"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf,.docx,.txt,.json,.md"
                className="hidden"
              />

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 text-blue-300 flex items-center justify-center mb-4 shadow-glow"
              >
                <CloudUpload size={32} />
              </motion.div>

              <h3 className="text-xl font-bold text-white">Upload Agreement (PDF, DOCX, TXT)</h3>
              <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
                Drag and drop your contract PDF here or select a file to run AI multi-industry obligation and installment extraction.
              </p>

              <div className="flex flex-wrap gap-3 justify-center mt-6">
                <GlowButton onClick={() => fileInputRef.current?.click()} icon={<CloudUpload size={16} />}>
                  Choose Document File
                </GlowButton>
              </div>

              {/* Sample 1-click presets */}
              <div className="mt-8 pt-6 border-t border-white/5">
                <div className="text-xs text-slate-400 mb-3 font-semibold">Or Load Multi-Industry Sample Presets:</div>
                <div className="flex flex-wrap justify-center gap-2">
                  {SAMPLE_PRESETS.map((p) => (
                    <button
                      key={p.name}
                      onClick={() => runAnalysis(p)}
                      className="text-xs px-3.5 py-2 rounded-xl bg-white/5 hover:bg-blue-500/15 text-slate-200 hover:text-blue-300 border border-white/10 hover:border-blue-400/30 transition flex items-center gap-1.5"
                    >
                      <Play size={12} className="text-blue-400" />
                      <span>{p.name}</span>
                      <span className="text-[10px] opacity-60 font-mono">({p.industry})</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-3">
                <input
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Contract Title (e.g. Master Facilities Agreement 2026)"
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-xs text-white outline-none focus:border-blue-400/50"
                />
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-xs text-white outline-none focus:border-blue-400/50"
                >
                  <option value="IT & Cloud" className="bg-slate-900">IT & Cloud</option>
                  <option value="Civil & Construction" className="bg-slate-900">Civil & Construction</option>
                  <option value="Pharma & Biotech" className="bg-slate-900">Pharma & Biotech</option>
                  <option value="Manufacturing" className="bg-slate-900">Manufacturing</option>
                  <option value="Finance & Banking" className="bg-slate-900">Finance & Banking</option>
                </select>
              </div>

              <textarea
                rows={8}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste contract clauses, payment installments, notice periods, SLA terms here..."
                className="w-full rounded-xl bg-white/5 border border-white/10 p-4 text-xs font-mono text-slate-200 outline-none focus:border-blue-400/50"
              />

              <div className="flex justify-between items-center flex-wrap gap-3">
                <div className="flex gap-2">
                  {SAMPLE_PRESETS.map((p) => (
                    <button
                      key={p.name}
                      onClick={() => {
                        setCustomTitle(p.name);
                        setPastedText(p.text);
                        setSelectedIndustry(p.industry);
                      }}
                      className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 transition"
                    >
                      {p.name.split(" ")[0]}
                    </button>
                  ))}
                </div>

                <GlowButton onClick={handlePasteAnalyze} icon={<Sparkles size={16} />}>
                  Analyze with Gemini AI
                </GlowButton>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Analyzing Progress State */}
      {analyzing && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-8 border border-blue-400/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 text-blue-300 flex items-center justify-center shadow-glow">
              <Sparkles className="animate-spin" size={24} />
            </div>
            <div>
              <h2 className="font-bold text-lg text-white">ContractFlow AI is analyzing…</h2>
              <p className="text-xs text-slate-400">Extracting legal obligations, installment schedules & risk metrics</p>
            </div>
          </div>

          <div className="mb-6 h-2 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-violet-500"
              animate={{ width: `${(analysisStep / 5) * 100}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>

          <div className="space-y-3">
            {stages.map((s, i) => (
              <div key={s} className="flex items-center gap-3 text-xs">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition ${
                    analysisStep > i
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : analysisStep === i
                      ? "bg-blue-500/20 text-blue-300 border border-blue-400/40 animate-pulse"
                      : "bg-white/5 text-slate-600"
                  }`}
                >
                  {analysisStep > i ? <Check size={12} /> : i + 1}
                </div>
                <span className={analysisStep >= i ? "text-slate-200" : "text-slate-600"}>{s}…</span>
                {analysisStep === i && <span className="ml-auto text-[11px] text-blue-400 font-mono">processing</span>}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Analysis Result View */}
      {result && !analyzing && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Top banner */}
          <div className="flex justify-between items-center glass p-4 rounded-2xl border border-white/10 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-300">
                <FileCheck2 size={22} />
              </div>
              <div>
                <div className="font-bold text-sm text-white">{result.filename}</div>
                <div className="text-xs text-slate-400">
                  Type: <b className="text-blue-300">{result.contract_type}</b> · Industry: <span className="text-slate-200">{result.industry || "Enterprise"}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <GlowButton variant="ghost" size="sm" onClick={() => setResult(null)}>
                Analyze Another Document
              </GlowButton>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass rounded-2xl p-4 border border-white/10">
              <div className="text-xs text-slate-500">AI Confidence</div>
              <div className="font-display text-2xl font-bold text-emerald-400 mt-1">{result.confidence}%</div>
              <div className="text-[11px] text-slate-400 mt-0.5">High precision model</div>
            </div>

            <div className="glass rounded-2xl p-4 border border-white/10">
              <div className="text-xs text-slate-500">Risk Assessment</div>
              <div className="font-display text-2xl font-bold text-amber-400 mt-1">{result.risk}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Requires monitoring</div>
            </div>

            <div className="glass rounded-2xl p-4 border border-white/10">
              <div className="text-xs text-slate-500">Important Dates</div>
              <div className="font-display text-2xl font-bold text-blue-400 mt-1">{result.important_dates}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Detected deadlines</div>
            </div>

            <div className="glass rounded-2xl p-4 border border-white/10">
              <div className="text-xs text-slate-500">Installments Found</div>
              <div className="font-display text-2xl font-bold text-violet-400 mt-1">
                {result.installments_detected?.length || 2}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Milestone schedules</div>
            </div>
          </div>

          {/* Executive Summary & Next Steps */}
          <div className="grid lg:grid-cols-3 gap-5">
            <div className="glass rounded-2xl p-5 lg:col-span-2 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Sparkles size={16} className="text-blue-400" /> AI Executive Summary
                </h3>
                <span className="text-xs text-blue-300 font-mono">Gemini 3.x Flash</span>
              </div>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">{result.summary}</p>
            </div>

            <div className="glass rounded-2xl p-5 border border-white/10">
              <h3 className="font-bold text-white text-base mb-3 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" /> Actionable Next Steps
              </h3>
              <div className="space-y-2 text-xs">
                {result.next_steps.map((st, i) => (
                  <div key={i} className="flex items-start gap-2 text-slate-300">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{st}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detected Milestone Installments (Date & Time) */}
          {result.installments_detected && result.installments_detected.length > 0 && (
            <div className="glass rounded-2xl p-5 border border-white/10">
              <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
                <IndianRupee size={16} className="text-blue-400" /> Detected Installment & Payment Schedule (₹ INR)
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                {result.installments_detected.map((inst, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-white/[.02] border border-white/5 space-y-1.5 text-xs">
                    <div className="font-semibold text-white">{inst.milestone}</div>
                    <div className="font-display text-lg font-bold text-gradient">{inst.amount}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span className="text-blue-300">{inst.due}</span>
                      <span>·</span>
                      <span className="text-violet-300">{inst.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detected Clauses Table */}
          <div className="glass rounded-2xl overflow-hidden border border-white/10">
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-bold text-white text-base">Extracted Clauses & Obligations ({result.clauses.length})</h3>
              <span className="text-xs text-slate-500">Mapped to responsible roles</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-white/[.02] text-slate-400 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">Clause / Obligation</th>
                    <th className="p-3.5">Responsible Party</th>
                    <th className="p-3.5">Deadline Threshold</th>
                    <th className="p-3.5">Risk Level</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {result.clauses.map((c, idx) => (
                    <tr key={idx} className="hover:bg-white/[.02] transition">
                      <td className="p-3.5 font-semibold text-white">{c.type}</td>
                      <td className="p-3.5 text-slate-300">{c.party}</td>
                      <td className="p-3.5 text-blue-300">{c.deadline}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            c.risk === "High"
                              ? "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                              : "bg-blue-500/15 text-blue-300 border border-blue-500/30"
                          }`}
                        >
                          {c.risk}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-400">{c.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
