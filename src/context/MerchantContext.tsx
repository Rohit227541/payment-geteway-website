import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, kycService } from '../services/api';

export type KycStatus = 'pending' | 'submitted' | 'approved' | 'rejected' | null;

interface MerchantState {
  email: string | null;
  phone: string | null;
  token: string | null;
  isEmailVerified: boolean;
  kycStatus: KycStatus;
  loading: boolean;
  error: string | null;
}

interface MerchantContextType extends MerchantState {
  setSignupData: (email: string, phone: string) => void;
  signup: (data: { email: string; phone: string; password: string }) => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
  resendOtp: () => Promise<void>;
  submitKyc: (formData: FormData) => Promise<void>;
  login: (data: { email: string; password: string }) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (data: { token: string; password?: string; otp: string }) => Promise<void>;
  resendResetOtp: (token: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const MerchantContext = createContext<MerchantContextType | undefined>(undefined);

export const MerchantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<MerchantState>({
    email: localStorage.getItem('merchant_email') || null,
    phone: localStorage.getItem('merchant_phone') || null,
    token: localStorage.getItem('token') || null,
    isEmailVerified: localStorage.getItem('is_email_verified') === 'true',
    kycStatus: (localStorage.getItem('kyc_status') as KycStatus) || null,
    loading: false,
    error: null,
  });

  // Sync state values with localStorage when state changes
  useEffect(() => {
    if (state.email) {
      localStorage.setItem('merchant_email', state.email);
    } else {
      localStorage.removeItem('merchant_email');
    }
  }, [state.email]);

  useEffect(() => {
    if (state.phone) {
      localStorage.setItem('merchant_phone', state.phone);
    } else {
      localStorage.removeItem('merchant_phone');
    }
  }, [state.phone]);

  useEffect(() => {
    if (state.token) {
      localStorage.setItem('token', state.token);
    } else {
      localStorage.removeItem('token');
    }
  }, [state.token]);

  useEffect(() => {
    localStorage.setItem('is_email_verified', String(state.isEmailVerified));
  }, [state.isEmailVerified]);

  useEffect(() => {
    if (state.kycStatus) {
      localStorage.setItem('kyc_status', state.kycStatus);
    } else {
      localStorage.removeItem('kyc_status');
    }
  }, [state.kycStatus]);

  const clearError = () => setState((s) => ({ ...s, error: null }));

  const setSignupData = (email: string, phone: string) => {
    setState((s) => ({ ...s, email, phone }));
  };

  const signup = async (data: { email: string; phone: string; password: string }) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const response = await authService.signup(data);
      // Backend should return a structure like: { token?: string, email: string, phone: string }
      setState((s) => ({
        ...s,
        email: response.email || data.email,
        phone: response.phone || data.phone,
        token: response.token || null,
        loading: false,
      }));
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Signup failed. Please try again.';
      setState((s) => ({ ...s, loading: false, error: errMsg }));
      throw err;
    }
  };

  const verifyEmail = async (code: string) => {
    if (!state.email) {
      setState((s) => ({ ...s, error: 'Merchant email not found. Please signup first.' }));
      return;
    }
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const response = await authService.verifyEmail({ email: state.email, code });
      setState((s) => ({
        ...s,
        isEmailVerified: true,
        token: response.token || state.token, // Store verification / auth token if provided
        loading: false,
      }));
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Email verification failed.';
      setState((s) => ({ ...s, loading: false, error: errMsg }));
      throw err;
    }
  };

  const resendOtp = async () => {
    if (!state.email) {
      setState((s) => ({ ...s, error: 'Merchant email not found. Please signup first.' }));
      return;
    }
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      await authService.resendOtp({ email: state.email });
      setState((s) => ({ ...s, loading: false }));
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to resend OTP.';
      setState((s) => ({ ...s, loading: false, error: errMsg }));
      throw err;
    }
  };

  const submitKyc = async (formData: FormData) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      await kycService.submitKyc(formData);
      setState((s) => ({
        ...s,
        kycStatus: 'submitted',
        loading: false,
      }));
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'KYC submission failed.';
      setState((s) => ({ ...s, loading: false, error: errMsg }));
      throw err;
    }
  };

  const login = async (data: { email: string; password: string }) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const response = await authService.login(data);
      // Expecting { token: string, user: { email, phone, isEmailVerified, kycStatus } }
      setState((s) => ({
        ...s,
        email: response.user?.email || data.email,
        phone: response.user?.phone || null,
        token: response.token || null,
        isEmailVerified: response.user?.isEmailVerified ?? true,
        kycStatus: response.user?.kycStatus ?? null,
        loading: false,
      }));
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Login failed. Please try again.';
      setState((s) => ({ ...s, loading: false, error: errMsg }));
      throw err;
    }
  };

  const forgotPassword = async (email: string) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      await authService.forgotPassword({ email });
      setState((s) => ({ ...s, loading: false }));
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to send reset email.';
      setState((s) => ({ ...s, loading: false, error: errMsg }));
      throw err;
    }
  };

  const resetPassword = async (data: { token: string; password?: string; otp: string }) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      await authService.resetPassword(data);
      setState((s) => ({ ...s, loading: false }));
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Password reset failed.';
      setState((s) => ({ ...s, loading: false, error: errMsg }));
      throw err;
    }
  };

  const resendResetOtp = async (token: string) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      await authService.resendResetOtp({ token });
      setState((s) => ({ ...s, loading: false }));
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to resend reset OTP.';
      setState((s) => ({ ...s, loading: false, error: errMsg }));
      throw err;
    }
  };

  const logout = () => {
    setState({
      email: null,
      phone: null,
      token: null,
      isEmailVerified: false,
      kycStatus: null,
      loading: false,
      error: null,
    });
    localStorage.removeItem('merchant_email');
    localStorage.removeItem('merchant_phone');
    localStorage.removeItem('token');
    localStorage.removeItem('is_email_verified');
    localStorage.removeItem('kyc_status');
  };

  return (
    <MerchantContext.Provider
      value={{
        ...state,
        setSignupData,
        signup,
        verifyEmail,
        resendOtp,
        submitKyc,
        login,
        forgotPassword,
        resetPassword,
        resendResetOtp,
        logout,
        clearError,
      }}
    >
      {children}
    </MerchantContext.Provider>
  );
};

export const useMerchant = () => {
  const context = useContext(MerchantContext);
  if (!context) {
    throw new Error('useMerchant must be used within a MerchantProvider');
  }
  return context;
};
