import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3, Award, CheckCircle2, Clock, ShieldCheck, Download,
  Printer, TrendingUp, User, Building2, Sparkles, Filter, Search
} from "lucide-react";
import { USERS } from "../data";
import type { EmployeeReport, UserProfile } from "../data";
import { GlowButton, useToast } from "../ui";

interface EmployeeReportsSectionProps {
  currentUser: UserProfile;
  reports: EmployeeReport[];
}

export default function EmployeeReportsSection({
  currentUser,
  reports,
}: EmployeeReportsSectionProps) {
  const toast = useToast();
  const isBoss = currentUser.role === "boss";
  const [selectedDept, setSelectedDept] = useState("All");

  const visibleReports = isBoss
    ? reports
    : reports.filter((r) => r.employee_id === currentUser.id);

  const filtered = visibleReports.filter((r) =>
    selectedDept === "All" ? true : r.department.includes(selectedDept)
  );

  const handlePrint = () => {
    toast("Generating executive print preview…", "info");
    window.print();
  };

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Employee,Title,Department,Total Contracts,Completed Milestones,Pending,On-Time Rate,Compliance Score,Logged Hours,Grade\n" +
      filtered
        .map(
          (r) =>
            `"${r.employee_name}","${r.title}","${r.department}",${r.total_contracts},${r.completed_milestones},${r.pending_milestones},${r.on_time_rate_pct}%,${r.compliance_score}%,${r.total_hours} hrs,${r.grade}`
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `contractflow-employee-report-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast("Exported Employee Performance Report to CSV", "success");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[.2em] text-blue-400 font-semibold mb-1">
            Performance Analytics & Governance
          </div>
          <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
            Employee Progress Bars & Executive Reports
            <span className="text-xs font-normal px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300">
              {isBoss ? "Boss Enterprise View" : `Personal Report (${currentUser.name})`}
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {isBoss
              ? "Comprehensive multi-employee productivity matrix, milestone delivery bars, and audit-ready performance reports."
              : "Review your contractual milestone completion score, on-time delivery metrics, and hours logged."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <GlowButton variant="ghost" size="sm" onClick={handlePrint} icon={<Printer size={15} />}>
            Print Report
          </GlowButton>
          <GlowButton size="sm" onClick={handleExportCSV} icon={<Download size={15} />}>
            Export CSV
          </GlowButton>
        </div>
      </div>

      {/* Filter if Boss */}
      {isBoss && (
        <div className="glass rounded-2xl p-4 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Department:</span>
            {["All", "Finance", "Legal", "Operations"].map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDept(d)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                  selectedDept === d
                    ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-glow"
                    : "bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <div className="text-xs text-slate-500">
            Evaluating {filtered.length} staff member{filtered.length !== 1 ? "s" : ""}
          </div>
        </div>
      )}

      {/* Employee Progress Bars & Scorecards */}
      <div className="grid lg:grid-cols-3 gap-5">
        {filtered.map((rep, i) => (
          <motion.div
            key={rep.employee_id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass card-hover rounded-3xl p-6 border border-white/10 flex flex-col justify-between"
          >
            <div>
              {/* Header profile */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-white font-bold text-base flex items-center justify-center shadow-glow">
                    {rep.employee_name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">{rep.employee_name}</h3>
                    <div className="text-xs text-slate-400">{rep.title}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Building2 size={11} /> {rep.department}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Grade</span>
                  <div className="font-display font-black text-xl text-gradient">{rep.grade}</div>
                </div>
              </div>

              {/* Progress Bars Matrix */}
              <div className="space-y-4 mt-6">
                {/* On-Time Delivery Bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock size={12} className="text-blue-400" /> On-Time Delivery Rate
                    </span>
                    <span className="font-mono font-bold text-blue-300">{rep.on_time_rate_pct}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${rep.on_time_rate_pct}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                    />
                  </div>
                </div>

                {/* Compliance Adherence Bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400 flex items-center gap-1">
                      <ShieldCheck size={12} className="text-emerald-400" /> Contract Compliance Score
                    </span>
                    <span className="font-mono font-bold text-emerald-300">{rep.compliance_score}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${rep.compliance_score}%` }}
                      transition={{ duration: 1, delay: 0.15 + i * 0.1 }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                    />
                  </div>
                </div>

                {/* Milestone Completion Ratio Bar */}
                <div>
                  {(() => {
                    const totalM = rep.completed_milestones + rep.pending_milestones;
                    const completionPct = totalM ? Math.round((rep.completed_milestones / totalM) * 100) : 0;
                    return (
                      <div>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-slate-400 flex items-center gap-1">
                            <CheckCircle2 size={12} className="text-violet-400" /> Milestone Completion Velocity
                          </span>
                          <span className="font-mono font-bold text-violet-300">
                            {rep.completed_milestones}/{totalM} ({completionPct}%)
                          </span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${completionPct}%` }}
                            transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                            className="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full"
                          />
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Quick stats row */}
              <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-white/5 text-xs text-slate-400">
                <div className="bg-white/[.02] p-2.5 rounded-xl border border-white/5">
                  <div className="text-[11px] text-slate-500">Active Contracts</div>
                  <div className="font-display text-sm font-bold text-white mt-0.5">
                    {rep.total_contracts} Contracts
                  </div>
                </div>
                <div className="bg-white/[.02] p-2.5 rounded-xl border border-white/5">
                  <div className="text-[11px] text-slate-500">Total Logged Time</div>
                  <div className="font-display text-sm font-bold text-emerald-400 mt-0.5">
                    {rep.total_hours} Hours
                  </div>
                </div>
              </div>

              {/* Recent activity summary */}
              <div className="text-xs text-slate-300 bg-blue-500/[.03] p-3 rounded-xl border border-blue-400/10 mt-4 leading-relaxed">
                <span className="text-[10px] uppercase font-bold text-blue-300 block mb-0.5">
                  Latest Milestone Note
                </span>
                {rep.recent_activity}
              </div>
            </div>

            {/* Print badge */}
            <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
              <span>Verified under ISO 27001</span>
              <span className="text-emerald-400 flex items-center gap-1 font-medium">
                <Award size={13} /> Top Performer
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
