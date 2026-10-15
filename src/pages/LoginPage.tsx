import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Store, Eye, EyeOff, Lock, Mail } from 'lucide-react';

export function LoginPage() {
  const { login } = useStore();
  const [email, setEmail] = useState('admin@restroflow.pk');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    setTimeout(() => {
      const success = login(email, password);
      if (!success) {
        setError('Invalid email or password');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-64 h-64 border border-white/20" />
          <div className="absolute bottom-40 right-20 w-48 h-48 border border-white/20" />
          <div className="absolute top-1/2 left-1/3 w-32 h-32 border border-white/20" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 max-w-md"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-accent flex items-center justify-center">
              <Store size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-white text-2xl font-bold">RestroFlow</h1>
              <p className="text-sidebar-text text-sm">Restaurant Management System</p>
            </div>
          </div>
          
          <h2 className="text-white text-3xl font-bold mb-4 leading-tight">
            Complete Restaurant Operations in One Platform
          </h2>
          <p className="text-sidebar-text text-base leading-relaxed mb-8">
            Manage orders, inventory, staff, finances, and customer relationships — all from a single, powerful dashboard designed for modern restaurants.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Point of Sale', desc: 'Fast & reliable' },
              { label: 'Kitchen Display', desc: 'Real-time sync' },
              { label: 'Inventory', desc: 'Auto-tracking' },
              { label: 'Reports', desc: 'Business insights' },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 p-3"
              >
                <p className="text-white text-sm font-medium">{feature.label}</p>
                <p className="text-sidebar-text text-xs">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-bg">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-10 h-10 bg-accent flex items-center justify-center">
              <Store size={20} className="text-white" />
            </div>
            <span className="text-text-primary font-bold text-xl">RestroFlow</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-text-primary">Welcome back</h2>
            <p className="text-text-secondary text-sm mt-1">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-error-bg border border-error-light text-error text-sm"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Email Address</label>
              <div className="flex items-center gap-2 border border-border bg-surface px-3 py-2">
                <Mail size={18} className="text-text-muted flex-shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm text-text-primary"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Password</label>
              <div className="flex items-center gap-2 border border-border bg-surface px-3 py-2">
                <Lock size={18} className="text-text-muted flex-shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm text-text-primary"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-text-muted hover:text-text-secondary flex-shrink-0"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 border-border" defaultChecked />
                <span className="text-sm text-text-secondary">Remember me</span>
              </label>
              <button type="button" className="text-sm text-accent hover:underline">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-text-muted text-center">
              Demo credentials are pre-filled. Click "Sign In" to access the system.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-lg font-bold text-text-primary">50+</p>
                <p className="text-xs text-text-muted">Modules</p>
              </div>
              <div>
                <p className="text-lg font-bold text-text-primary">18</p>
                <p className="text-xs text-text-muted">User Roles</p>
              </div>
              <div>
                <p className="text-lg font-bold text-text-primary">24/7</p>
                <p className="text-xs text-text-muted">Support</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
