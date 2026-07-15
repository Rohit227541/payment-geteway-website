import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, ArrowLeft, Building2, User, Mail, Phone, Lock, FileText, Globe, MapPin, CheckCircle2, PartyPopper } from 'lucide-react';
import AuthShell from '../components/auth/AuthShell';

const steps = ['Business', 'Owner', 'Security', 'Address', 'Review'];

const businessTypes = ['Private Limited', 'Partnership', 'LLP', 'Sole Proprietor', 'Public Limited', 'NGO'];

export default function Signup() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    businessName: '', ownerName: '', businessEmail: '', mobile: '', password: '', confirm: '',
    businessType: 'Private Limited', gst: '', pan: '', country: 'India', state: '', city: '', address: '', website: '',
    terms: false,
  });

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));
  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));
  const submit = (e: React.FormEvent) => { e.preventDefault(); setDone(true); };

  if (done) {
    return (
      <AuthShell title="Account Created" subtitle="Welcome to PayFlow.">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-500/10 text-emerald-500">
            <PartyPopper className="h-10 w-10" />
          </div>
          <h3 className="mt-5 font-display text-xl font-bold text-ink-900 dark:text-white">You're all set, {form.ownerName || 'there'}!</h3>
          <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">
            Your merchant account for <span className="font-semibold text-ink-800 dark:text-ink-100">{form.businessName || 'your business'}</span> has been created.
            Check <span className="font-semibold">{form.businessEmail || 'your email'}</span> to verify and continue onboarding.
          </p>
          <div className="mt-6 space-y-2 text-left">
            {['Verify your email', 'Upload KYC documents', 'Complete bank verification', 'Activate your account'].map((s, i) => (
              <div key={s} className="flex items-center gap-3 rounded-xl bg-ink-50 dark:bg-ink-900/60 px-4 py-3 text-sm">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-500/10 font-display text-xs font-bold text-brand-600 dark:text-brand-300">{i + 1}</span>
                {s}
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <Link to="/onboarding" className="btn-primary flex-1">Continue onboarding <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/login" className="btn-outline flex-1">Go to login</Link>
          </div>
        </motion.div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create Merchant Account"
      subtitle="Get started with PayFlow in minutes. No setup fees."
      footer={<>Already have an account? <Link to="/login" className="font-semibold text-brand-600 dark:text-brand-300">Login</Link></>}
    >
      <div className="mb-6 flex items-center justify-between">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1.5">
              <span className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold transition ${
                i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-brand-600 text-white' : 'bg-ink-100 dark:bg-ink-800 text-ink-400'
              }`}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span className={`text-[10px] font-medium ${i === step ? 'text-ink-900 dark:text-white' : 'text-ink-400'}`}>{s}</span>
            </div>
            {i < steps.length - 1 && <div className={`mx-1 h-0.5 flex-1 rounded ${i < step ? 'bg-emerald-500' : 'bg-ink-200 dark:bg-ink-800'}`} />}
          </div>
        ))}
      </div>

      <form onSubmit={submit} className="space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {step === 0 && (
              <>
                <Field icon={Building2} label="Business Name" value={form.businessName} onChange={(v) => set('businessName', v)} placeholder="Acme Pvt Ltd" />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Business Type</label>
                    <select className="input" value={form.businessType} onChange={(e) => set('businessType', e.target.value)}>
                      {businessTypes.map((b) => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                  <Field icon={FileText} label="GST Number" value={form.gst} onChange={(v) => set('gst', v)} placeholder="29ABCDE1234F1Z5" />
                </div>
                <Field icon={FileText} label="PAN Number" value={form.pan} onChange={(v) => set('pan', v)} placeholder="ABCDE1234F" />
              </>
            )}
            {step === 1 && (
              <>
                <Field icon={User} label="Owner Name" value={form.ownerName} onChange={(v) => set('ownerName', v)} placeholder="Aarav Mehta" />
                <Field icon={Mail} label="Business Email" type="email" value={form.businessEmail} onChange={(v) => set('businessEmail', v)} placeholder="you@business.com" />
                <Field icon={Phone} label="Mobile Number" value={form.mobile} onChange={(v) => set('mobile', v)} placeholder="+91 90000 00000" />
              </>
            )}
            {step === 2 && (
              <>
                <Field icon={Lock} label="Password" type="password" value={form.password} onChange={(v) => set('password', v)} placeholder="••••••••" />
                <Field icon={Lock} label="Confirm Password" type="password" value={form.confirm} onChange={(v) => set('confirm', v)} placeholder="••••••••" />
                <div className="rounded-xl bg-ink-50 dark:bg-ink-900/60 p-3 text-xs text-ink-500 dark:text-ink-400">
                  Use at least 8 characters with a mix of letters, numbers and symbols.
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <Field icon={Globe} label="Country" value={form.country} onChange={(v) => set('country', v)} placeholder="India" />
                  <Field icon={MapPin} label="State" value={form.state} onChange={(v) => set('state', v)} placeholder="Karnataka" />
                </div>
                <Field icon={MapPin} label="City" value={form.city} onChange={(v) => set('city', v)} placeholder="Bengaluru" />
                <Field icon={MapPin} label="Address" value={form.address} onChange={(v) => set('address', v)} placeholder="Prestige Tech Park, Marathahalli" />
                <Field icon={Globe} label="Website" value={form.website} onChange={(v) => set('website', v)} placeholder="https://yourbusiness.com" />
              </>
            )}
            {step === 4 && (
              <div className="space-y-3">
                <div className="rounded-xl bg-ink-50 dark:bg-ink-900/60 p-4 text-sm">
                  {[
                    ['Business', form.businessName], ['Type', form.businessType], ['GST', form.gst || '—'],
                    ['Owner', form.ownerName], ['Email', form.businessEmail], ['Mobile', form.mobile || '—'],
                    ['Country', form.country], ['State', form.state || '—'], ['City', form.city || '—'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-ink-200/60 dark:border-ink-800/60 py-1.5 last:border-0">
                      <span className="text-ink-500 dark:text-ink-400">{k}</span>
                      <span className="font-medium text-ink-900 dark:text-white">{v || '—'}</span>
                    </div>
                  ))}
                </div>
                <label className="flex items-start gap-2.5 text-sm text-ink-600 dark:text-ink-300">
                  <input type="checkbox" required checked={form.terms} onChange={(e) => set('terms', e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-400" />
                  <span>I accept the <Link to="/terms" className="font-semibold text-brand-600 dark:text-brand-300">Terms of Service</Link> and <Link to="/privacy-policy" className="font-semibold text-brand-600 dark:text-brand-300">Privacy Policy</Link>.</span>
                </label>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-3 pt-2">
          {step > 0 && (
            <button type="button" onClick={back} className="btn-outline">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          )}
          {step < steps.length - 1 ? (
            <button type="button" onClick={next} className="btn-primary flex-1">
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button type="submit" className="btn-primary flex-1">
              <CheckCircle2 className="h-4 w-4" /> Create Account
            </button>
          )}
        </div>
      </form>
    </AuthShell>
  );
}

function Field({ icon: Icon, label, value, onChange, placeholder, type = 'text' }: {
  icon: React.ComponentType<{ className?: string }>; label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="input pl-10" />
      </div>
    </div>
  );
}
