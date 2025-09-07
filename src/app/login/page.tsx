'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthActions, useOAuthLogin, usePasswordReset } from '@/hooks/use-auth';

export default function LoginPage() {
  const router = useRouter();
  const { login, register, clearError, isLoading, error } = useAuthActions();
  const { loginWithGoogle, loginWithFacebook, loginWithSpotify } = useOAuthLogin();
  const { requestPasswordReset, isLoading: resetLoading } = usePasswordReset();
  
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  useEffect(() => {
    clearError();
  }, [mode, clearError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'forgot') {
      try {
        await requestPasswordReset(formData.email);
        setResetEmailSent(true);
      } catch (err) {
        console.error('Password reset request failed:', err);
      }
      return;
    }

    if (mode === 'register' && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      if (mode === 'login') {
        await login({
          email: formData.email,
          password: formData.password,
        });
        router.push('/dashboard');
      } else {
        await register({
          email: formData.email,
          password: formData.password,
          username: formData.username,
        });
        router.push('/dashboard');
      }
    } catch (err) {
      // Error is handled by the hook
      console.error('Authentication failed:', err);
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex items-center justify-center px-4">
        <motion.div 
          className="w-full max-w-md"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          {/* Auth Form Container */}
          <div className="bg-gradient-to-b from-gray-900/80 to-black/60 backdrop-blur-lg border border-red-500/30 rounded-lg p-8 shadow-2xl">
            
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-orbitron font-bold neon-text mb-2">
                {mode === 'login' ? 'Welcome Back' : mode === 'register' ? 'Join BaddBeatz' : 'Reset Password'}
              </h1>
              <p className="text-cyan-400">
                {mode === 'login' 
                  ? 'Sign in to access your account' 
                  : mode === 'register' 
                    ? 'Create your account to get started'
                    : 'Enter your email to reset password'
                }
              </p>
            </div>

            {/* Social Login Options */}
            {mode !== 'forgot' && (
              <div className="space-y-3 mb-6">
                <Button
                  onClick={loginWithGoogle}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  disabled={isLoading}
                >
                  🔴 Continue with Google
                </Button>
                
                <Button
                  onClick={loginWithSpotify}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  disabled={isLoading}
                >
                  🎵 Continue with Spotify
                </Button>
                
                <Button
                  onClick={loginWithFacebook}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading}
                >
                  📘 Continue with Facebook
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-900 text-gray-400">or</span>
                  </div>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {resetEmailSent && mode === 'forgot' && (
                <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                  <p className="text-green-400 text-sm">
                    Password reset email sent! Check your inbox for further instructions.
                  </p>
                </div>
              )}

              {/* Username Field (Register only) */}
              {mode === 'register' && (
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Choose a username"
                  />
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password Field (not for forgot mode) */}
              {mode !== 'forgot' && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400 pr-12"
                      placeholder="Enter your password"
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? '👁️' : '🔒'}
                    </button>
                  </div>
                </div>
              )}

              {/* Confirm Password Field (Register only) */}
              {mode === 'register' && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Confirm your password"
                    minLength={6}
                  />
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full btn-cyber text-lg py-3"
                disabled={isLoading || resetLoading}
              >
                {isLoading || resetLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    {mode === 'login' ? '🔑 Sign In' : mode === 'register' ? '🚀 Create Account' : '📧 Send Reset Email'}
                  </>
                )}
              </Button>
            </form>

            {/* Footer Links */}
            <div className="mt-8 text-center space-y-4">
              {mode === 'login' && (
                <>
                  <button
                    onClick={() => setMode('forgot')}
                    className="text-cyan-400 hover:text-cyan-300 text-sm"
                  >
                    Forgot your password?
                  </button>
                  
                  <p className="text-gray-400 text-sm">
                    Don't have an account?{' '}
                    <button
                      onClick={() => setMode('register')}
                      className="text-red-400 hover:text-red-300 font-medium"
                    >
                      Sign up here
                    </button>
                  </p>
                </>
              )}

              {mode === 'register' && (
                <p className="text-gray-400 text-sm">
                  Already have an account?{' '}
                  <button
                    onClick={() => setMode('login')}
                    className="text-red-400 hover:text-red-300 font-medium"
                  >
                    Sign in here
                  </button>
                </p>
              )}

              {mode === 'forgot' && (
                <p className="text-gray-400 text-sm">
                  Remember your password?{' '}
                  <button
                    onClick={() => setMode('login')}
                    className="text-red-400 hover:text-red-300 font-medium"
                  >
                    Back to sign in
                  </button>
                </p>
              )}
            </div>

            {/* Terms and Privacy */}
            {mode === 'register' && (
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  By creating an account, you agree to our{' '}
                  <Link href="/terms" className="text-cyan-400 hover:text-cyan-300">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-cyan-400 hover:text-cyan-300">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            )}
          </div>

          {/* Additional Links */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm mb-4">
              New to electronic music?
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/about" className="text-cyan-400 hover:text-cyan-300 text-sm">
                About TheBadGuyHimself
              </Link>
              <Link href="/music" className="text-cyan-400 hover:text-cyan-300 text-sm">
                Listen to Mixes
              </Link>
              <Link href="/contact" className="text-cyan-400 hover:text-cyan-300 text-sm">
                Get in Touch
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}