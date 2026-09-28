import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight, Bot, CheckCircle2, FileText, GitBranch, ListChecks,
  Play, ShieldCheck, Sparkles, Zap, CalendarDays, Network,
} from "lucide-react";
import { AnimatedCounter, GlowButton, ParticleField, Reveal } from "./ui";

const pipeline = [
  { icon: FileText, label: "Upload Contract", color: "text-blue-300 bg-blue-500/15" },
  { icon: Sparkles, label: "AI Analysis", color: "text-violet-300 bg-violet-500/15" },
  { icon: ListChecks, label: "Clause Extraction", color: "text-cyan-300 bg-cyan-500/15" },
  { icon: CalendarDays, label: "Deadline Detection", color: "text-amber-300 bg-amber-500/15" },
  { icon: Network, label: "Workflow Generation", color: "text-emerald-300 bg-emerald-500/15" },
];

const features = [
  { icon: Bot, title: "Agentic AI", desc: "Reads contracts, understands obligations and acts on them autonomously.", grad: "from-blue-500/20 to-violet-500/20" },
  { icon: ShieldCheck, title: "Human-in-the-Loop", desc: "High-risk decisions route to authorized humans for approval.", grad: "from-emerald-500/20 to-teal-500/20" },
  { icon: Zap, title: "Instant Workflows", desc: "Clauses become executable tasks, deadlines and notifications.", grad: "from-amber-500/20 to-orange-500/20" },
  { icon: Network, title: "Deep Integrations", desc: "Calendar, Slack, Teams, CRM, ERP, webhooks and custom APIs.", grad: "from-cyan-500/20 to-blue-500/20" },
];

const stats = [
  { to: 24, suffix: "", label: "Contracts monitored" },
  { to: 94, suffix: "%", label: "AI extraction accuracy" },
  { to: 140, suffix: "+", label: "Obligations tracked" },
  { to: 12, suffix: "x", label: "Faster than manual review" },
];

export default function Hero({ onEnter, onDemo }: { onEnter: () => void; onDemo: () => void }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % pipeline.length), 1400);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden noise">
      <ParticleField count={40} />

      {/* Nav */}
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 flex items-center justify-between px-5 md:px-12 py-5"
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="w-11 h-11 rounded-2xl bg-gradient-to-br from-electric to-violet flex items-center justify-center shadow-glow-lg"
          >
            <GitBranch size={23} />
          </motion.div>
          <div>
            <div className="font-display font-bold text-lg leading-none">ContractFlow <span className="text-blue-400">AI</span></div>
            <div className="text-[10px] uppercase tracking-[.24em] text-slate-500 mt-1">Contract → Action</div>
          </div>
        </div>
        <GlowButton size="sm" variant="outline" onClick={onEnter} icon={<ArrowRight size={15} />}>
          Enter Dashboard
        </GlowButton>
      </motion.header>

      {/* Hero content */}
      <main className="relative z-20 px-5 md:px-12 pt-8 md:pt-16 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs text-slate-300 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
              Agentic AI · Live demo, no API required
            </motion.div>

            <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-[1.05]">
              {["Turn", "Contracts", "Into"].map((w, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.12 }}
                  className="inline-block mr-3"
                >
                  {w}
                </motion.span>
              ))}
              <motion.span
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="block text-gradient"
              >
                Executable Actions.
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-slate-400 mt-6 text-base md:text-lg max-w-xl leading-relaxed"
            >
              ContractFlow AI reads every agreement, extracts obligations and deadlines,
              then generates the workflows, tasks and approvals your team needs — automatically.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.5 }}
              className="flex flex-wrap gap-3 mt-8"
            >
              <GlowButton size="lg" onClick={onDemo} icon={<Play size={18} />}>
                Try Live Demo
              </GlowButton>
              <GlowButton size="lg" variant="outline" onClick={onEnter} icon={<ArrowRight size={18} />}>
                Explore Dashboard
              </GlowButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="flex flex-wrap gap-x-6 gap-y-2 mt-8 text-xs text-slate-500"
            >
              {["Human approval gateway", "Immutable audit trail", "Compliance monitoring"].map((f) => (
                <span key={f} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-400" /> {f}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Live pipeline card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: -12 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.2, 0.7, 0.3, 1] }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-violet-500/20 rounded-[2rem] blur-2xl animate-aurora" />
            <div className="relative glass-strong rounded-3xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-violet-300" size={18} />
                  <span className="font-semibold text-sm">Live Agent Pipeline</span>
                </div>
                <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" /> running
                </span>
              </div>

              <div className="space-y-3">
                {pipeline.map((p, i) => {
                  const active = step === i;
                  const done = step > i;
                  const Icon = p.icon;
                  return (
                    <motion.div
                      key={p.label}
                      animate={{ scale: active ? 1.02 : 1, x: active ? 6 : 0 }}
                      className={`flex items-center gap-4 p-3.5 rounded-2xl border transition-colors duration-300 ${
                        active ? "border-blue-400/40 bg-blue-500/10" : done ? "border-white/5 bg-white/[.02]" : "border-white/5 bg-white/[.01] opacity-50"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${p.color}`}>
                        <Icon size={18} />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{p.label}</div>
                        <div className="text-[11px] text-slate-500">
                          {done ? "completed" : active ? "processing…" : "queued"}
                        </div>
                      </div>
                      {done && <CheckCircle2 size={18} className="text-emerald-400" />}
                      {active && (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 rounded-full border-2 border-blue-400 border-t-transparent"
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-6 h-1.5 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-violet-500"
                  animate={{ width: `${((step + 1) / pipeline.length) * 100}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 md:mt-24">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1}>
              <div className="glass card-hover rounded-2xl p-5 text-center">
                <div className="font-display text-3xl md:text-4xl font-extrabold text-gradient">
                  <AnimatedCounter to={s.to} suffix={s.suffix} />
                </div>
                <div className="text-xs text-slate-500 mt-2">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Features */}
        <div className="mt-16 md:mt-24 mb-20">
          <Reveal>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-center">
              Built for <span className="text-gradient">contract intelligence</span>
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal key={f.title} delay={i * 0.1}>
                  <div className="glass card-hover rounded-2xl p-6 h-full">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.grad} flex items-center justify-center mb-4`}>
                      <Icon size={22} className="text-white" />
                    </div>
                    <h3 className="font-semibold">{f.title}</h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">{f.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Final CTA */}
        <Reveal>
          <div className="relative mb-16 rounded-3xl overflow-hidden glass-strong p-8 md:p-12 text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-violet-500/10 to-cyan-500/10 animate-gradient-x" />
            <div className="relative">
              <h2 className="font-display text-2xl md:text-4xl font-bold">See the agent work, end to end.</h2>
              <p className="text-slate-400 mt-3 max-w-xl mx-auto">
                Run the full contract-to-action pipeline in your browser — no backend, no signup.
              </p>
              <div className="flex flex-wrap gap-3 justify-center mt-7">
                <GlowButton size="lg" onClick={onDemo} icon={<Play size={18} />}>Run Demo Contract</GlowButton>
                <GlowButton size="lg" variant="ghost" onClick={onEnter} icon={<ArrowRight size={18} />}>Open Dashboard</GlowButton>
              </div>
            </div>
          </div>
        </Reveal>
      </main>
    </div>
  );
}
