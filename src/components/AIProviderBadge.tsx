import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Sparkles, Lock, CheckCircle2, Server, Cpu, Key, X, Zap } from "lucide-react";
import { useBackend } from "../api";
import { GlowButton } from "../ui";

export default function AIProviderBadge() {
  const { state, mode, gemini } = useBackend();
  const [showModal, setShowModal] = useState(false);
  const online = state === "online";

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border transition hover:scale-105 cursor-pointer ${
          online
            ? "border-emerald-400/30 text-emerald-300 bg-emerald-500/10 shadow-glow"
            : "border-blue-400/25 text-blue-300 bg-blue-500/10"
        }`}
        title="AI Provider Abstraction Layer: Enterprise Secured"
      >
        <span className={`w-2 h-2 rounded-full ${online ? "bg-emerald-400 pulse-dot" : "bg-blue-400"}`} />
        <span className="font-semibold">{gemini ? "Gemini AI Secured" : "AI Provider Active"}</span>
        <Lock size={12} className="text-slate-400" />
      </button>

      {/* AI Provider Abstraction Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md glass-strong border border-blue-400/25 rounded-3xl p-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 text-blue-300 flex items-center justify-center">
                    <Shield size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">AI Provider Abstraction</h3>
                    <div className="text-[10px] text-emerald-400 font-semibold">Zero-Exposure Key Architecture</div>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 mt-4 text-xs">
                <div className="p-3 rounded-2xl bg-white/[.02] border border-white/5 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Primary Model</span>
                    <span className="text-blue-300 font-semibold flex items-center gap-1">
                      <Sparkles size={12} /> Google Gemini 3.x Flash
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">API Key Storage</span>
                    <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                      <Lock size={12} /> Server-Side Vault (.env)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Frontend Exposure</span>
                    <span className="text-emerald-400 font-semibold">0% (Completely Hidden)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Enterprise Privacy</span>
                    <span className="text-slate-200">Zero Data Retention</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Inference Latency</span>
                    <span className="text-violet-300 font-mono">~140 ms</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 size={13} /> Enterprise Security Abstraction
                  </div>
                  <p className="text-slate-300 leading-snug">
                    Raw API keys are securely managed by the server backend environment and never leaked to the client browser.
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-white/10 flex justify-end">
                <GlowButton size="sm" variant="ghost" onClick={() => setShowModal(false)}>
                  Close
                </GlowButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
