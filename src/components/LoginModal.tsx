import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, User, Briefcase, Lock, CheckCircle2, ArrowRight,
  Sparkles, Building2, ChevronRight, KeyRound, X
} from "lucide-react";
import { USERS } from "../data";
import type { UserProfile } from "../data";
import { GlowButton } from "../ui";

interface LoginModalProps {
  currentUser: UserProfile | null;
  onSelectUser: (user: UserProfile) => void;
  onClose?: () => void;
  isInitial?: boolean;
}

export default function LoginModal({
  currentUser,
  onSelectUser,
  onClose,
  isInitial = false,
}: LoginModalProps) {
  const [selectedRole, setSelectedRole] = useState<"boss" | "employee">("boss");
  const [activeProfile, setActiveProfile] = useState<UserProfile>(
    USERS.find((u) => u.role === "boss") || USERS[0]
  );
  const [password, setPassword] = useState("••••••••");
  const [rememberMe, setRememberMe] = useState(true);

  const roleUsers = USERS.filter((u) => u.role === selectedRole);

  const handleRoleChange = (role: "boss" | "employee") => {
    setSelectedRole(role);
    const firstInRole = USERS.find((u) => u.role === role);
    if (firstInRole) setActiveProfile(firstInRole);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSelectUser(activeProfile);
    onClose?.();
  };

  return (
    <div className={`fixed inset-0 z-[85] bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        className="w-full max-w-xl glass-strong border border-blue-400/25 rounded-3xl p-5 sm:p-7 md:p-8 shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto flex flex-col"
      >
        {/* Top ambient glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-gradient-to-br from-blue-500/20 to-violet-500/20 blur-3xl pointer-events-none" />

        {/* Close button if optional */}
        {!isInitial && onClose && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition z-10"
          >
            <X size={18} />
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-5 relative shrink-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-xs text-blue-300 mb-2">
            <Shield size={13} className="text-blue-400" />
            <span>Role-Based Access Control (RBAC)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
            Sign In to <span className="text-gradient">ContractFlow AI</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Choose your authorized role to access tailored contract management and intelligence.
          </p>
        </div>

        {/* Role Switcher Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-white/5 p-1.5 rounded-2xl mb-4 border border-white/5 shrink-0">
          <button
            type="button"
            onClick={() => handleRoleChange("boss")}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition ${
              selectedRole === "boss"
                ? "bg-gradient-to-r from-amber-500/90 to-orange-500/90 text-white shadow-glow"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Briefcase size={15} />
            <div className="text-left">
              <div className="leading-tight">Boss (Main Member)</div>
              <div className="text-[10px] opacity-80 font-normal">Full Enterprise Access</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange("employee")}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition ${
              selectedRole === "employee"
                ? "bg-gradient-to-r from-blue-500/90 to-violet-500/90 text-white shadow-glow"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <User size={15} />
            <div className="text-left">
              <div className="leading-tight">User (Employee)</div>
              <div className="text-[10px] opacity-80 font-normal">Personal Contracts Only</div>
            </div>
          </button>
        </div>

        {/* Profile Selector for the chosen role */}
        <div className="space-y-2 mb-4 shrink-0">
          <div className="flex justify-between items-center text-xs text-slate-400 px-1">
            <span>Select Account Profile</span>
            <span className="text-[11px] text-blue-400 font-medium">
              {selectedRole === "boss" ? "1 Administrator Profile" : `${roleUsers.length} Employee Profiles Available`}
            </span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {roleUsers.map((user) => {
              const isSelected = activeProfile.id === user.id;
              return (
                <div
                  key={user.id}
                  onClick={() => setActiveProfile(user)}
                  className={`p-3 rounded-2xl border cursor-pointer transition flex items-center gap-3 ${
                    isSelected
                      ? selectedRole === "boss"
                        ? "bg-amber-500/10 border-amber-400/40 shadow-glow"
                        : "bg-blue-500/10 border-blue-400/40 shadow-glow"
                      : "bg-white/[.02] border-white/5 hover:bg-white/5"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${user.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow`}
                  >
                    {user.avatarText}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs sm:text-sm text-white truncate">{user.name}</span>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold ${
                          user.role === "boss"
                            ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                            : "bg-blue-400/20 text-blue-300 border border-blue-400/30"
                        }`}
                      >
                        {user.role === "boss" ? "Boss" : "Employee"}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">{user.title}</div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5 truncate">
                      <Building2 size={10} /> {user.department} · {user.email}
                    </div>
                  </div>
                  <div className="shrink-0">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? selectedRole === "boss"
                            ? "border-amber-400 bg-amber-400 text-slate-950"
                            : "border-blue-400 bg-blue-400 text-slate-950"
                          : "border-white/20"
                      }`}
                    >
                      {isSelected && <CheckCircle2 size={12} />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Security / Role Scope Notice */}
        <div
          className={`p-3 rounded-2xl text-xs mb-4 border shrink-0 ${
            selectedRole === "boss"
              ? "bg-amber-500/5 border-amber-500/20 text-amber-200/90"
              : "bg-blue-500/5 border-blue-500/20 text-blue-200/90"
          }`}
        >
          <div className="flex items-start gap-2.5">
            <Shield size={15} className="shrink-0 mt-0.5 text-blue-400" />
            <div>
              <b className="font-semibold block mb-0.5 text-[11px]">
                {selectedRole === "boss"
                  ? "Boss Executive Mode: Full Enterprise Oversight"
                  : `Employee Privacy Mode: ${activeProfile.name}`}
              </b>
              <span className="text-[11px] leading-snug block">
                {selectedRole === "boss"
                  ? "You will see all contracts, work progress logs, installments, deadline risks, and performance reports across all employees."
                  : "You will ONLY see contracts, tasks, installments, work logs, and reminders assigned directly to you. Boss and other employees' confidential records are isolated."}
              </span>
            </div>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 shrink-0">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Work Email</label>
            <input
              type="email"
              value={activeProfile.email}
              readOnly
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-300 outline-none cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Password / SSO Passkey</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-blue-400/50"
              />
              <KeyRound size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-white/20 bg-white/5 text-blue-500 focus:ring-0"
              />
              <span>Keep role session active</span>
            </label>
            <span className="text-blue-400 hover:underline cursor-pointer">SSO Help</span>
          </div>

          <GlowButton
            type="submit"
            className="w-full mt-2"
            variant="primary"
            icon={<ArrowRight size={16} />}
          >
            Sign In as {selectedRole === "boss" ? "Boss (Vikramaditya Singhania)" : activeProfile.name}
          </GlowButton>
        </form>
      </motion.div>
    </div>
  );
}
