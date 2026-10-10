import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShopSmartLogo } from '../components/ShopSmartLogo';
import { Eye, EyeOff, Sparkles, ShieldCheck, Truck, Lock, AlertCircle } from 'lucide-react';

export const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already authenticated, redirect immediately
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  // Form states
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Client-side validation logic
  const validate = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      errors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters.';
    }

    return errors;
  };

  const errors = validate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setApiError(null);
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    setApiError(null);

    try {
      await login(formData.email, formData.password);
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      if (err.status === 401) {
        setApiError('Incorrect email or password.');
      } else {
        setApiError('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick fill helper for demo login
  const handleUseDemoAccount = () => {
    setFormData({
      email: 'demo@shopsmart.com',
      password: 'Demo@1234'
    });
    setTouched({ email: true, password: true });
    setApiError(null);
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="bg-white dark:bg-[#2C3625] rounded-3xl border border-[#2C3625]/10 dark:border-[#FEF9F0]/15 overflow-hidden shadow-2xl flex flex-col md:flex-row transition-colors">
        {/* Left Panel: Desktop Brand Showcase */}
        <div className="hidden md:flex md:w-1/2 bg-[#F9DC5C] text-[#2C3625] p-8 lg:p-12 flex-col justify-between relative overflow-hidden">
          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-3">
              <ShopSmartLogo />
              <span className="font-display text-2xl font-extrabold tracking-tight">
                ShopSmart AI
              </span>
            </div>
            <div>
              <h2 className="font-display text-3xl font-extrabold tracking-tight leading-tight">
                Intelligent shopping, curated for your daily life.
              </h2>
              <p className="font-sans text-sm text-[#2C3625]/85 mt-2 leading-relaxed">
                Log in to chat with your AI Shopkeeper, save custom tech wishlists, and track orders.
              </p>
            </div>

            {/* 3 Benefit Points */}
            <div className="space-y-4 pt-4 text-xs font-medium">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#2C3625]/10 backdrop-blur-xs">
                <Sparkles className="w-5 h-5 shrink-0 text-[#F28482]" />
                <span>Personal AI Shopkeeper Recommendations</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#2C3625]/10 backdrop-blur-xs">
                <ShieldCheck className="w-5 h-5 shrink-0 text-[#84A59D]" />
                <span>30-Day Gentle Living Return Guarantee</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#2C3625]/10 backdrop-blur-xs">
                <Truck className="w-5 h-5 shrink-0 text-[#2C3625]" />
                <span>Free Carbon-Neutral Shipping & Tracking</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-[#2C3625]/75 pt-6 border-t border-[#2C3625]/15">
            © 2026 ShopSmart AI Inc. All rights reserved.
          </div>
        </div>

        {/* Right Panel: Form Card */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-center">
          {/* Mobile Header */}
          <div className="flex md:hidden items-center gap-2.5 mb-6 justify-center">
            <ShopSmartLogo />
            <span className="font-display text-xl font-bold tracking-tight text-[#2C3625] dark:text-[#FEF9F0]">
              ShopSmart AI
            </span>
          </div>

          <div className="space-y-2 mb-6">
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#2C3625] dark:text-[#FEF9F0]">
              Sign in to your account
            </h1>
            <p className="font-sans text-xs sm:text-sm text-[#2C3625]/75 dark:text-[#FEF9F0]/75">
              Welcome back! Please enter your details below.
            </p>
          </div>

          {/* API Error Banner */}
          {apiError && (
            <div
              role="alert"
              aria-live="polite"
              className="mb-6 p-3.5 rounded-2xl bg-[#F28482]/15 border border-[#F28482]/40 text-[#2C3625] dark:text-[#FEF9F0] text-xs font-medium flex items-center gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-[#F28482] shrink-0" />
              <span>{apiError}</span>
            </div>
          )}

          {/* Real Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-semibold text-[#2C3625] dark:text-[#FEF9F0] mb-1.5"
              >
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                placeholder="name@example.com"
                aria-invalid={touched.email && !!errors.email}
                aria-describedby={touched.email && errors.email ? 'email-error' : undefined}
                className={`w-full px-4 py-2.5 rounded-2xl bg-[#FEF9F0] dark:bg-[#1A261D] border text-xs sm:text-sm text-[#2C3625] dark:text-[#FEF9F0] placeholder-[#2C3625]/50 dark:placeholder-[#FEF9F0]/50 focus:outline-none transition-colors ${
                  touched.email && errors.email
                    ? 'border-[#F28482] focus:border-[#F28482]'
                    : 'border-[#2C3625]/15 dark:border-[#FEF9F0]/20 focus:border-[#F28482]'
                }`}
              />
              {touched.email && errors.email && (
                <p id="email-error" className="mt-1 text-xs text-[#F28482] font-medium">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="login-password"
                className="block text-xs font-semibold text-[#2C3625] dark:text-[#FEF9F0] mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur('password')}
                  placeholder="••••••••"
                  aria-invalid={touched.password && !!errors.password}
                  aria-describedby={touched.password && errors.password ? 'password-error' : undefined}
                  className={`w-full pl-4 pr-11 py-2.5 rounded-2xl bg-[#FEF9F0] dark:bg-[#1A261D] border text-xs sm:text-sm text-[#2C3625] dark:text-[#FEF9F0] placeholder-[#2C3625]/50 dark:placeholder-[#FEF9F0]/50 focus:outline-none transition-colors ${
                    touched.password && errors.password
                      ? 'border-[#F28482] focus:border-[#F28482]'
                      : 'border-[#2C3625]/15 dark:border-[#FEF9F0]/20 focus:border-[#F28482]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#2C3625]/60 dark:text-[#FEF9F0]/60 hover:text-[#2C3625] dark:hover:text-[#FEF9F0] cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {touched.password && errors.password && (
                <p id="password-error" className="mt-1 text-xs text-[#F28482] font-medium">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Demo Account Helper */}
            <div className="pt-1 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={handleUseDemoAccount}
                className="text-[#84A59D] hover:underline font-semibold cursor-pointer"
              >
                Use Demo Account (demo@shopsmart.com)
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-6 rounded-full bg-[#F28482] hover:bg-[#E57371] text-[#FEF9F0] text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#FEF9F0] border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-[#FEF9F0]" />
                  <span>Sign in</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-6 pt-6 border-t border-[#2C3625]/10 dark:border-[#FEF9F0]/15 text-center text-xs text-[#2C3625]/80 dark:text-[#FEF9F0]/80">
            <span>New here? </span>
            <Link
              to="/signup"
              className="font-bold text-[#F28482] hover:underline"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};
