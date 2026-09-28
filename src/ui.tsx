import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from "react";
import {
  animate, AnimatePresence, motion, useInView, useMotionValue, useSpring, useTransform,
} from "framer-motion";
import { CheckCircle2, Info, AlertTriangle, X } from "lucide-react";

/* ============================================================
   Aurora / particle animated background
   ============================================================ */
export function AuroraBackground() {
  const blobs = [
    { c: "#5b8cff", s: 520, x: "8%", y: "4%", d: "0s" },
    { c: "#8b5cf6", s: 460, x: "72%", y: "12%", d: "-6s" },
    { c: "#22d3ee", s: 420, x: "40%", y: "68%", d: "-11s" },
  ];
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {blobs.map((b, i) => (
        <div
          key={i}
          className="aurora-blob animate-aurora"
          style={{
            background: b.c, width: b.s, height: b.s,
            left: b.x, top: b.y, animationDelay: b.d,
          }}
        />
      ))}
      <div className="absolute inset-0 grid-bg opacity-70" />
    </div>
  );
}

export function ParticleField({ count = 34 }: { count?: number }) {
  const parts = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 1 + Math.random() * 3,
        dur: 6 + Math.random() * 12,
        delay: -Math.random() * 12,
        op: 0.15 + Math.random() * 0.45,
      })),
    [count]
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {parts.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-blue-200"
          style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size, opacity: p.op }}
          animate={{ y: [0, -30, 0], opacity: [p.op, p.op * 0.3, p.op] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ============================================================
   Animated counter
   ============================================================ */
export function AnimatedCounter({
  to, suffix = "", prefix = "", duration = 1.6, decimals = 0,
}: { to: number; suffix?: string; prefix?: string; duration?: number; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState("0");
  const [started, setStarted] = useState(false);

  // Fallback: if IntersectionObserver never reports (hidden/detached viewport),
  // start anyway shortly after mount so the value is never stuck at 0.
  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 400);
    return () => clearTimeout(t);
  }, []);

  const go = inView || started;

  useEffect(() => {
    if (!go) return;
    const controls = animate(0, to, {
      duration,
      ease: [0.2, 0.7, 0.3, 1],
      onUpdate: (v) => setDisplay(v.toFixed(decimals)),
    });
    return () => controls.stop();
  }, [go, to, duration, decimals]);

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

/* ============================================================
   Scroll reveal wrapper
   ============================================================ */
export function Reveal({
  children, delay = 0, y = 26, className = "",
}: { children: React.ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.2, 0.7, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ============================================================
   Glow button with ripple + magnetic tilt
   ============================================================ */
type GlowButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline" | "success" | "danger";
  size?: "sm" | "md" | "lg";
  magnetic?: boolean;
  icon?: React.ReactNode;
};

export function GlowButton({
  variant = "primary", size = "md", magnetic = true, icon, children, className = "", onClick, ...rest
}: GlowButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });

  const onMove = (e: React.MouseEvent) => {
    if (!magnetic || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set(((e.clientX - r.left) / r.width - 0.5) * 12);
    y.set(((e.clientY - r.top) / r.height - 0.5) * 12);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  const spawnRipple = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const s = Math.max(r.width, r.height);
    const span = document.createElement("span");
    span.className = "ripple";
    span.style.width = span.style.height = `${s}px`;
    span.style.left = `${e.clientX - r.left - s / 2}px`;
    span.style.top = `${e.clientY - r.top - s / 2}px`;
    el.appendChild(span);
    setTimeout(() => span.remove(), 600);
  };

  const base =
    "relative inline-flex items-center justify-center gap-2 font-semibold rounded-xl btn-glow overflow-hidden select-none";
  const sizes = { sm: "px-3.5 py-2 text-xs", md: "px-5 py-2.5 text-sm", lg: "px-7 py-3.5 text-base" }[size];
  const variants = {
    primary: "text-white bg-gradient-to-r from-blue-500 to-violet-500 btn-ring shadow-glow",
    success: "text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 shadow-glow",
    danger: "text-white bg-gradient-to-r from-rose-500 to-red-500 shadow-glow",
    outline: "text-slate-100 border border-white/15 bg-white/[.03] hover:bg-white/[.08]",
    ghost: "text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10",
  }[variant];

  return (
    <motion.button
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileTap={{ scale: 0.96 }}
      className={`${base} ${sizes} ${variants} ${className}`}
      onClick={(e) => { spawnRipple(e); onClick?.(e); }}
      {...(rest as any)}
    >
      {icon}
      {children}
    </motion.button>
  );
}

/* ============================================================
   Toast system
   ============================================================ */
type Toast = { id: number; msg: string; type: "success" | "info" | "warn" };
const ToastCtx = createContext<(msg: string, type?: Toast["type"]) => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((msg: string, type: Toast["type"] = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3600);
  }, []);

  const icons = {
    success: <CheckCircle2 size={18} className="text-emerald-400" />,
    info: <Info size={18} className="text-blue-400" />,
    warn: <AlertTriangle size={18} className="text-orange-400" />,
  };
  const bars = { success: "from-emerald-400 to-teal-400", info: "from-blue-400 to-violet-400", warn: "from-orange-400 to-rose-400" };

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed z-[100] bottom-5 right-5 flex flex-col gap-3 w-[min(92vw,360px)]">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="glass-strong rounded-2xl p-4 flex items-start gap-3 relative overflow-hidden"
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${bars[t.type]}`} />
              <div className="mt-0.5">{icons[t.type]}</div>
              <p className="text-sm text-slate-200 flex-1 leading-snug">{t.msg}</p>
              <button onClick={() => setToasts((s) => s.filter((x) => x.id !== t.id))} className="text-slate-500 hover:text-white transition">
                <X size={15} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}

/* ============================================================
   Tilt card (3D hover)
   ============================================================ */
export function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 15 });
  const sry = useSpring(ry, { stiffness: 150, damping: 15 });
  const glareX = useTransform(ry, [-10, 10], ["30%", "70%"]);

  return (
    <motion.div
      ref={ref}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 14);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 14);
      }}
      onMouseLeave={() => { rx.set(0); ry.set(0); }}
      className={`relative ${className}`}
    >
      {children}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300"
        style={{
          background: useTransform(glareX, (v) => `radial-gradient(circle at ${v} 30%, rgba(255,255,255,.12), transparent 55%)`),
        }}
      />
    </motion.div>
  );
}
