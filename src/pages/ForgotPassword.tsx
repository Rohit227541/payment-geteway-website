import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import AuthShell from '../components/auth/AuthShell';

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');

  return (
    <AuthShell
      title="Forgot Password"
      subtitle={sent ? 'Reset link sent. Check your inbox.' : 'Enter your email to receive a reset link.'}
      footer={<>Remembered it? <Link to="/login" className="font-semibold text-brand-600 dark:text-brand-300">Back to login</Link></>}
    >
      {sent ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <p className="mt-4 text-sm text-ink-600 dark:text-ink-300">
            We've sent a password reset link to <span className="font-semibold text-ink-900 dark:text-white">{email}</span>.
            It may take a couple of minutes to arrive.
          </p>
          <Link to="/login" className="btn-primary mt-6 w-full">Back to login</Link>
        </motion.div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
          <div>
            <label className="label" htmlFor="email">Business Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@business.com" className="input pl-10" />
            </div>
          </div>
          <button type="submit" className="btn-primary w-full">
            Send Reset Link <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      )}
    </AuthShell>
  );
}
