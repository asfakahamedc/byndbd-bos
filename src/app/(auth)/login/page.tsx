'use client';

import React, { useState, useTransition } from 'react';
import Image from 'next/image';
import { signIn } from '@/actions/auth';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await signIn(formData);
      if (result && 'error' in result && result.error) {
        setError(result.error);
      }
    });
  };

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen font-sans">
      {/* Left Side: Sidebar Brand & Marketing (Hidden on Mobile) */}
      <section className="hidden md:flex flex-col justify-between p-xl bg-dusk text-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 rounded-full border-[1px] border-white/20"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full border-[1px] border-white/20"></div>
        </div>

        <div className="relative z-10 space-y-xxl">
          {/* Brand Logo */}
          <div className="flex items-center gap-sm">
            <Image src="/black_logo.svg" alt="Bynd BD Logo" width={48} height={48} className="object-contain" />
            <span className="font-sans text-[48px] font-semibold tracking-tighter text-white">Bynd BD</span>
          </div>

          {/* Value Proposition */}
          <div className="space-y-md max-w-md">
            <h1 className="text-h1 text-white">Business Operating System</h1>
            <p className="text-body text-white/80 text-lg">
              Manage operations. Stay accountable. Experience the power of unified data and streamlined logistics management.
            </p>
          </div>

          {/* Features List */}
          <ul className="space-y-md">
            <li className="flex items-center gap-sm text-body group">
              <span className="material-symbols-outlined text-sunrise group-hover:scale-110 transition-transform">check_circle</span>
              <span>Real-time monitoring</span>
            </li>
            <li className="flex items-center gap-sm text-body group">
              <span className="material-symbols-outlined text-sunrise group-hover:scale-110 transition-transform">check_circle</span>
              <span>Team coordination</span>
            </li>
            <li className="flex items-center gap-sm text-body group">
              <span className="material-symbols-outlined text-sunrise group-hover:scale-110 transition-transform">check_circle</span>
              <span>Trip management</span>
            </li>
            <li className="flex items-center gap-sm text-body group">
              <span className="material-symbols-outlined text-sunrise group-hover:scale-110 transition-transform">check_circle</span>
              <span>Secure &amp; scalable</span>
            </li>
          </ul>
        </div>

        {/* Footer Quote / Meta */}
        <div className="relative z-10 pt-xl">
          <div className="p-lg bg-white/5 backdrop-blur-md rounded-[6px] border border-white/10">
            <p className="text-body italic text-white/70">
              &ldquo;Efficiency is doing things right; effectiveness is doing the right things.&rdquo;
            </p>
            <div className="mt-xs text-sunrise text-label uppercase tracking-widest">— Peter Drucker</div>
          </div>
        </div>
      </section>

      {/* Right Side: Login Form */}
      <section className="flex flex-col items-center justify-center p-md sm:p-xl bg-white text-on-surface">
        <div className="w-full max-w-md space-y-xl">
          {/* Header (Mobile Only Logo) */}
          <div className="md:hidden flex flex-col items-center mb-xl">
            <Image src="/color_logo.svg" alt="Bynd BD Logo" width={56} height={56} className="object-contain mb-md" />
            <h2 className="font-sans text-h1 text-sunrise">Bynd BD</h2>
          </div>

          <div className="text-left space-y-xs">
            <h2 className="text-h2 text-on-surface">Sign In</h2>
            <p className="text-body text-on-surface-variant">Welcome back. Sign in to continue.</p>
          </div>

          {/* Error Message Block */}
          {error && (
            <div className="p-md bg-ember/10 border border-error text-error text-body rounded-[6px]">
              <div className="flex items-start gap-sm">
                <span className="material-symbols-outlined text-[20px]">error</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-lg">
            {/* Email Field */}
            <div className="space-y-sm">
              <label className="text-label text-on-surface-variant block" htmlFor="email">
                Email Address
              </label>
              <div className="relative flex items-center group">
                <span className="material-symbols-outlined absolute left-3 text-outline group-focus-within:text-sunrise transition-colors">
                  mail
                </span>
                <input
                  className="w-full h-[40px] pl-10 pr-4 py-2 rounded-[6px] border border-[#E0E0E0] bg-surface focus:ring-2 focus:ring-primary/20 focus:border-sunrise transition-all text-body outline-none"
                  id="email"
                  name="email"
                  placeholder="name@company.com"
                  required
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  disabled={isPending}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-sm">
              <div className="flex justify-between items-center">
                <label className="text-label text-on-surface-variant" htmlFor="password">
                  Password
                </label>
                <a className="text-label text-sunrise hover:underline transition-all" href="#">
                  Forgot password?
                </a>
              </div>
              <div className="relative flex items-center group">
                <span className="material-symbols-outlined absolute left-3 text-outline group-focus-within:text-sunrise transition-colors">
                  lock
                </span>
                <input
                  className="w-full h-[40px] pl-10 pr-12 py-2 rounded-[6px] border border-[#E0E0E0] bg-surface focus:ring-2 focus:ring-primary/20 focus:border-sunrise transition-all text-body outline-none"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  disabled={isPending}
                  defaultValue="ByndBD_Admin2@26#"
                />
                <button
                  className="absolute right-3 flex items-center text-outline hover:text-on-surface transition-colors"
                  onClick={togglePassword}
                  type="button"
                  disabled={isPending}
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-sm">
              <input
                className="w-4 h-4 text-sunrise border-outline rounded-[6px] focus:ring-primary"
                id="remember"
                name="remember"
                type="checkbox"
                disabled={isPending}
              />
              <label
                className="text-body text-on-surface-variant cursor-pointer select-none"
                htmlFor="remember"
              >
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button
              className="w-full h-[40px] px-6 bg-sunrise text-white text-h4 rounded-[6px] shadow-lg hover:bg-sunrise/90 active:scale-[0.98] transition-all transform duration-150 flex items-center justify-center gap-sm disabled:opacity-75 disabled:pointer-events-none"
              type="submit"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full inline-block"></span>
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Form Footer */}
          <div className="text-center pt-md space-y-lg">
            <p className="text-body text-on-surface-variant">
              Don&apos;t have access?{' '}
              <a className="text-sunrise font-semibold hover:underline" href="#">
                Contact your admin.
              </a>
            </p>
            {/* Security Badge */}
            <div className="flex items-center justify-center gap-xs px-md py-sm bg-surface-container-low border border-[#E0E0E0] rounded-full w-fit mx-auto">
              <span className="material-symbols-outlined text-[18px] text-sunrise">verified_user</span>
              <span className="text-label text-on-surface-variant uppercase tracking-wider">
                Enterprise-grade Security
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
