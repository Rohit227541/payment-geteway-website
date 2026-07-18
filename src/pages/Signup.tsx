import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Phone, Lock, Eye, EyeOff, ArrowRight, ShieldAlert } from 'lucide-react';
import AuthShell from '../components/auth/AuthShell';
import { useMerchant } from '../context/MerchantContext';

type SignupFormData = {
  email: string;
  phone: string;
  password: string;
};

export default function Signup() {
  const navigate = useNavigate();
  const {  loading, error, clearError } = useMerchant();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    defaultValues: {
      email: '',
      phone: '',
      password: '',
    },
  });
  const onSubmit = async (data: SignupFormData) => {
    clearError();
  
    try {
      const response = await fetch("http://localhost:3000/gateway/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          merchantName: data.email.split("@")[0], // Temporary merchant name
          email: data.email,
          password: data.password,
        }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || "Signup failed");
      }
  
      console.log(result);
  
      // Save email for verification page
      localStorage.setItem("merchantEmail", data.email);
  
      // Send OTP automatically
      await fetch("http://localhost:3000/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
        }),
      });
  
      navigate("/verify-email");
  
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <AuthShell
      title="Create Merchant Account"
      subtitle="Start accepting cards, UPI, and net banking in minutes."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-600 dark:text-brand-300 hover:underline">
            Login
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <div className="flex items-start gap-3 rounded-2xl bg-rose-500/10 p-4 text-sm text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Signup Failed</p>
              <p className="mt-0.5 text-xs text-rose-500">{error}</p>
            </div>
          </div>
        )}

        {/* Email Address */}
        <div>
          <label className="label" htmlFor="email">
            Business Email
          </label>
          <div className="relative group">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-400 group-focus-within:text-brand-500 transition-colors" />
            <input
              id="email"
              type="email"
              placeholder="you@business.com"
              className={`input pl-11 py-3.5 text-sm ${
                errors.email ? 'border-rose-500 focus:ring-rose-500/20 focus:border-rose-500' : ''
              }`}
              {...register('email', {
                required: 'Business email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid business email address',
                },
              })}
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="label" htmlFor="phone">
            Phone Number
          </label>
          <div className="relative group">
            <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-400 group-focus-within:text-brand-500 transition-colors" />
            <input
              id="phone"
              type="tel"
              placeholder="9876543210"
              className={`input pl-11 py-3.5 text-sm ${
                errors.phone ? 'border-rose-500 focus:ring-rose-500/20 focus:border-rose-500' : ''
              }`}
              {...register('phone', {
                required: 'Phone number is required',
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: 'Phone number must be exactly 10 digits',
                },
              })}
            />
          </div>
          {errors.phone && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="label" htmlFor="password">
            Password
          </label>
          <div className="relative group">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-400 group-focus-within:text-brand-500 transition-colors" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className={`input pl-11 pr-11 py-3.5 text-sm ${
                errors.password ? 'border-rose-500 focus:ring-rose-500/20 focus:border-rose-500' : ''
              }`}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters long',
                },
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                  message: 'Must include a letter, a number, and a special character (@$!%*#?&)',
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600 dark:hover:text-ink-200 transition-colors"
            >
              {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>
          {errors.password ? (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
              {errors.password.message}
            </p>
          ) : (
            <p className="mt-1.5 text-[11px] text-ink-400 dark:text-ink-500 pl-1">
              Minimum 8 characters with a mix of letters, numbers, and symbols.
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full mt-6 justify-center flex items-center gap-2 py-3.5 shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-all duration-300 font-semibold"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Creating Merchant...
            </span>
          ) : (
            <>
              Create Account <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </AuthShell>
  );
}
