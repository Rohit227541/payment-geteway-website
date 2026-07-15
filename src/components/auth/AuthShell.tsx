import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, TrendingUp, CheckCircle2 } from 'lucide-react';
import type { ReactNode } from 'react';

export default function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl glass-card shadow-card dark:shadow-card-dark lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between bg-gradient-to-br from-brand-600 via-brand-700 to-accent-600 p-10 text-white lg:flex">
        <div className="pointer-events-none absolute inset-0 bg-grid-dark bg-[size:40px_40px] opacity-20" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <Link to="/" className="relative flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/15 backdrop-blur">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="6" width="18" height="13" rx="3" />
              <path d="M7 11h6M7 14h4" />
              <circle cx="17" cy="14" r="1.4" fill="currentColor" stroke="none" />
            </svg>
          </span>
          <span className="font-display text-lg font-bold">PayFlow<span className="text-white/70">.</span></span>
        </Link>
        <div className="relative">
          <h3 className="font-display text-2xl font-bold leading-tight">Secure payments for modern businesses.</h3>
          <ul className="mt-6 space-y-3 text-sm text-white/85">
            <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> PCI DSS Level 1 certified</li>
            <li className="flex items-center gap-2"><TrendingUp className="h-4 w-4" /> 99.99% uptime SLA</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> 50,000+ merchants trust us</li>
          </ul>
        </div>
        <p className="relative text-xs text-white/60">© {new Date().getFullYear()} PayFlow Gateway Inc.</p>
      </div>

      <div className="p-8 sm:p-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">{title}</h1>
          <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-400">{subtitle}</p>
          <div className="mt-7">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-ink-500 dark:text-ink-400">{footer}</div>}
        </motion.div>
      </div>
    </div>
  );
}
