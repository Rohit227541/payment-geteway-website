import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Upload, ArrowLeft } from 'lucide-react';
import { onboardingSteps } from '../data/content';

export default function Onboarding() {
  const [active, setActive] = useState(0);
  const [done, setDone] = useState(false);

  const next = () => {
    if (active < onboardingSteps.length - 1) setActive((a) => a + 1);
    else setDone(true);
  };

  return (
    <div className="container-px py-16">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <span className="eyebrow mb-4">Merchant Onboarding</span>
          <h1 className="heading">Activate your merchant account</h1>
          <p className="subheading mx-auto">Complete these steps to start accepting payments with PayFlow.</p>
        </div>

        <div className="mt-12 glass-card p-6 sm:p-8">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-2">
            {onboardingSteps.map((s, i) => (
              <div key={s.title} className="flex flex-1 items-center gap-2">
                <span className={`grid h-9 w-9 place-items-center rounded-full text-xs font-bold transition ${
                  i < active ? 'bg-emerald-500 text-white' : i === active ? 'bg-brand-600 text-white' : 'bg-ink-100 dark:bg-ink-800 text-ink-400'
                }`}>
                  {i < active ? <Check className="h-4 w-4" /> : i + 1}
                </span>
                <span className={`hidden text-xs font-medium sm:block ${i === active ? 'text-ink-900 dark:text-white' : 'text-ink-400'}`}>{s.title}</span>
                {i < onboardingSteps.length - 1 && <div className={`mx-1 h-0.5 flex-1 rounded ${i < active ? 'bg-emerald-500' : 'bg-ink-200 dark:bg-ink-800'}`} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {done ? (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-500/10 text-emerald-500">
                  <Check className="h-10 w-10" />
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-ink-900 dark:text-white">Account Activated!</h3>
                <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">You're ready to accept payments. Welcome to PayFlow.</p>
                <Link to="/dashboard" className="btn-primary mt-6">Go to Dashboard <ArrowRight className="h-4 w-4" /></Link>
              </motion.div>
            ) : (
              <motion.div key={active} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                {(() => {
                  const Step = onboardingSteps[active];
                  return (
                    <div className="flex items-center gap-3">
                      <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 text-white">
                        <Step.icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="font-display text-lg font-semibold text-ink-900 dark:text-white">{Step.title}</h3>
                        <p className="text-sm text-ink-500 dark:text-ink-400">{Step.desc}</p>
                      </div>
                    </div>
                  );
                })()}

                <div className="mt-6 rounded-xl border-2 border-dashed border-ink-200 dark:border-ink-700 p-8 text-center">
                  <Upload className="mx-auto h-8 w-8 text-ink-400" />
                  <p className="mt-3 text-sm text-ink-600 dark:text-ink-300">Drag & drop your documents here, or click to browse</p>
                  <p className="mt-1 text-xs text-ink-400">PDF, PNG or JPG up to 10MB</p>
                  <button type="button" className="btn-outline mt-4">Choose files</button>
                </div>

                <div className="mt-6 flex gap-3">
                  {active > 0 && <button type="button" onClick={() => setActive((a) => a - 1)} className="btn-outline"><ArrowLeft className="h-4 w-4" /> Back</button>}
                  <button type="button" onClick={next} className="btn-primary flex-1">
                    {active === onboardingSteps.length - 1 ? 'Activate Account' : 'Continue'} <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
