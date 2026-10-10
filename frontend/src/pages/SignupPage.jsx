import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShopSmartLogo } from '../components/ShopSmartLogo';
import { Eye, EyeOff, Sparkles, ShieldCheck, Truck, UserPlus, AlertCircle, Check, X } from 'lucide-react';

export const SignupPage = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Password rules helper
  const hasMinLength = formData.password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(formData.password);
  const hasNumber = /[0-9]/.test(formData.password);

  // Client-side validation
  const validate = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      errors.name = 'Full name is required.';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters.';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      errors.password = 'Password is required.';
    } else if (!hasMinLength || !hasLetter || !hasNumber) {
      errors.password = 'Password must meet all strength requirements.';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
    } else if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = 'Passwords do not match.';
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
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true
    });

    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    setApiError(null);

    try {
      await register(formData.name, formData.email, formData.password);
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      if (err.status === 409) {
        setApiError('An account with this email already exists.');
      } else {
        setApiError('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
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
                Join our community of smart shoppers.
              </h2>
              <p className="font-sans text-sm text-[#2C3625]/85 mt-2 leading-relaxed">
                Create a free account to unlock your personal AI Shopkeeper assistant and member-only pricing.
              </p>
            </div>

            {/* 3 Benefit Points */}
            <div className="space-y-4 pt-4 text-xs font-medium">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#2C3625]/10 backdrop-blur-xs">
                <Sparkles className="w-5 h-5 shrink-0 text-[#F28482]" />
                <span>AI Powered Product Recommendations</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#2C3625]/10 backdrop-blur-xs">
                <ShieldCheck className="w-5 h-5 shrink-0 text-[#84A59D]" />
                <span>Basic Membership Tier Included Free</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#2C3625]/10 backdrop-blur-xs">
                <Truck className="w-5 h-5 shrink-0 text-[#2C3625]" />
                <span>Saved Favorites & Speedy Checkout</span>
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
              Create an account
            </h1>
            <p className="font-sans text-xs sm:text-sm text-[#2C3625]/75 dark:text-[#FEF9F0]/75">
              Enter your details to get started with ShopSmart.
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
            {/* Full Name Field */}
            <div>
              <label
                htmlFor="signup-name"
                className="block text-xs font-semibold text-[#2C3625] dark:text-[#FEF9F0] mb-1.5"
              >
                Full Name
              </label>
              <input
                id="signup-name"
                type="text"
                name="name"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={() => handleBlur('name')}
                placeholder="Jane Doe"
                aria-invalid={touched.name && !!errors.name}
                aria-describedby={touched.name && errors.name ? 'name-error' : undefined}
                className={`w-full px-4 py-2.5 rounded-2xl bg-[#FEF9F0] dark:bg-[#1A261D] border text-xs sm:text-sm text-[#2C3625] dark:text-[#FEF9F0] placeholder-[#2C3625]/50 dark:placeholder-[#FEF9F0]/50 focus:outline-none transition-colors ${
                  touched.name && errors.name
                    ? 'border-[#F28482] focus:border-[#F28482]'
                    : 'border-[#2C3625]/15 dark:border-[#FEF9F0]/20 focus:border-[#F28482]'
                }`}
              />
              {touched.name && errors.name && (
                <p id="name-error" className="mt-1 text-xs text-[#F28482] font-medium">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="signup-email"
                className="block text-xs font-semibold text-[#2C3625] dark:text-[#FEF9F0] mb-1.5"
              >
                Email Address
              </label>
              <input
                id="signup-email"
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
                htmlFor="signup-password"
                className="block text-xs font-semibold text-[#2C3625] dark:text-[#FEF9F0] mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="new-password"
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

              {/* Password Strength Hints */}
              <div className="mt-2.5 p-2.5 rounded-xl bg-[#FEF9F0] dark:bg-[#1A261D] border border-[#2C3625]/10 dark:border-[#FEF9F0]/15 space-y-1 text-[11px]">
                <p className="font-semibold text-[#2C3625]/80 dark:text-[#FEF9F0]/80">Password requirements:</p>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`flex items-center gap-1 font-medium ${hasMinLength ? 'text-[#84A59D]' : 'text-[#2C3625]/60 dark:text-[#FEF9F0]/60'}`}>
                    {hasMinLength ? <Check className="w-3 h-3 text-[#84A59D]" /> : <X className="w-3 h-3" />}
                    <span>At least 8 chars</span>
                  </span>
                  <span className={`flex items-center gap-1 font-medium ${hasLetter ? 'text-[#84A59D]' : 'text-[#2C3625]/60 dark:text-[#FEF9F0]/60'}`}>
                    {hasLetter ? <Check className="w-3 h-3 text-[#84A59D]" /> : <X className="w-3 h-3" />}
                    <span>At least 1 letter</span>
                  </span>
                  <span className={`flex items-center gap-1 font-medium ${hasNumber ? 'text-[#84A59D]' : 'text-[#2C3625]/60 dark:text-[#FEF9F0]/60'}`}>
                    {hasNumber ? <Check className="w-3 h-3 text-[#84A59D]" /> : <X className="w-3 h-3" />}
                    <span>At least 1 number</span>
                  </span>
                </div>
              </div>

              {touched.password && errors.password && (
                <p id="password-error" className="mt-1 text-xs text-[#F28482] font-medium">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="signup-confirm-password"
                className="block text-xs font-semibold text-[#2C3625] dark:text-[#FEF9F0] mb-1.5"
              >
                Confirm Password
              </label>
              <input
                id="signup-confirm-password"
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={() => handleBlur('confirmPassword')}
                placeholder="••••••••"
                aria-invalid={touched.confirmPassword && !!errors.confirmPassword}
                aria-describedby={touched.confirmPassword && errors.confirmPassword ? 'confirm-password-error' : undefined}
                className={`w-full px-4 py-2.5 rounded-2xl bg-[#FEF9F0] dark:bg-[#1A261D] border text-xs sm:text-sm text-[#2C3625] dark:text-[#FEF9F0] placeholder-[#2C3625]/50 dark:placeholder-[#FEF9F0]/50 focus:outline-none transition-colors ${
                  touched.confirmPassword && errors.confirmPassword
                    ? 'border-[#F28482] focus:border-[#F28482]'
                    : 'border-[#2C3625]/15 dark:border-[#FEF9F0]/20 focus:border-[#F28482]'
                }`}
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <p id="confirm-password-error" className="mt-1 text-xs text-[#F28482] font-medium">
                  {errors.confirmPassword}
                </p>
              )}
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
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 text-[#FEF9F0]" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-6 pt-6 border-t border-[#2C3625]/10 dark:border-[#FEF9F0]/15 text-center text-xs text-[#2C3625]/80 dark:text-[#FEF9F0]/80">
            <span>Already have an account? </span>
            <Link
              to="/login"
              className="font-bold text-[#F28482] hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};
