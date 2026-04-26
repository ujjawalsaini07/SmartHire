import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Copy, CheckCircle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '@store/authStore';
import { authApi } from '@api/authApi';
import Logo from '@components/common/Logo';

const demoAccounts = [
  { role: 'Job Seeker', email: 'ujjawalsaini1@gmail.com',    password: 'UjjawalSmartPortal', color: 'var(--color-teal)' },
  { role: 'Recruiter',  email: 'bt23csh039@iiitn.ac.in',     password: 'UjjawalSmartPortal', color: '#3B82F6'           },
  { role: 'Admin',      email: 'admin@smartportal.com',       password: 'Admin@123',          color: '#7C3AED'           },
];

const Login = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const copyToClipboard = async (text, label) => {
    try { await navigator.clipboard.writeText(text); toast.success(`${label} copied`); }
    catch { toast.error('Copy failed'); }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!formData.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Invalid email address';
    if (!formData.password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setIsLoading(true);
    try {
      const res = await authApi.login(formData);
      if (res.success) {
        setAuth(res.data.user, res.data.accessToken, rememberMe);
        toast.success('Welcome back!');
        const role = res.data.user.role;
        if (role === 'jobseeker') navigate('/jobseeker/dashboard');
        else if (role === 'recruiter') navigate('/recruiter/dashboard');
        else if (role === 'admin') navigate('/admin/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Input field component ── */
  const Field = ({ label, id, name, type, value, placeholder, error, children }) => (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium mb-1.5"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {label}
      </label>
      <div className="relative">
        {children}
        {!children && (
          <input
            id={id}
            name={name}
            type={type}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className={`input ${error ? 'input-error' : ''}`}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            required
          />
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-[var(--color-error)]" role="alert">
          {error}
        </p>
      )}
    </div>
  );

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: 'var(--color-bg-base)' }}
    >
      {/* Background blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, var(--color-teal), transparent)' }} />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, rgba(170,255,199,0.6), transparent)' }} />
      </div>

      <div className="w-full max-w-5xl grid lg:grid-cols-[1fr_340px] gap-6 items-start">

        {/* ── Login Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md mx-auto"
        >
          <div
            className="card p-8 md:p-10"
            style={{ boxShadow: 'var(--shadow-xl)' }}
          >
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <Logo size="lg" />
            </div>

            {/* Heading */}
            <div className="text-center mb-8">
              <h1
                className="text-3xl font-bold mb-2 text-[var(--color-text-primary)] dark:text-[var(--dm-text-primary)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Welcome back
              </h1>
              <p className="text-sm text-[var(--color-text-secondary)] dark:text-[var(--dm-text-secondary)]">
                Sign in to your account to continue
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1.5 text-[var(--color-text-secondary)] dark:text-[var(--dm-text-secondary)]"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)] dark:text-[var(--dm-text-muted)]" aria-hidden="true" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`input pl-10 ${errors.email ? 'input-error' : ''}`}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    autoComplete="email"
                    required
                  />
                </div>
                {errors.email && (
                  <p id="email-error" className="mt-1 text-xs text-[var(--color-error)]" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-1.5 text-[var(--color-text-secondary)] dark:text-[var(--dm-text-secondary)]"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)] dark:text-[var(--dm-text-muted)]" aria-hidden="true" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••••"
                    className={`input pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] dark:text-[var(--dm-text-muted)] dark:hover:text-[var(--dm-text-primary)] transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="mt-1 text-xs text-[var(--color-error)]" role="alert">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember me + Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded accent-[var(--color-teal)]"
                  />
                  <span className="text-sm text-[var(--color-text-secondary)] dark:text-[var(--dm-text-secondary)]">
                    Remember me
                  </span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-[var(--color-teal)] dark:text-[var(--dm-accent-teal)] hover:opacity-80 transition-opacity"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary btn-lg w-full"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>

            {/* Sign up link */}
            <p className="mt-6 text-center text-sm text-[var(--color-text-muted)] dark:text-[var(--dm-text-muted)]">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-[var(--color-teal)] dark:text-[var(--dm-accent-teal)] hover:opacity-80 transition-opacity"
              >
                Create account
              </Link>
            </p>
          </div>
        </motion.div>

        {/* ── Demo Credentials Card ── */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="w-full lg:sticky lg:top-6"
          aria-label="Demo credentials"
        >
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-7 h-7 rounded-[var(--radius-md)] flex items-center justify-center"
                style={{ background: 'rgba(0,201,177,0.12)' }}
              >
                <CheckCircle className="w-4 h-4 text-[var(--color-teal)]" aria-hidden="true" />
              </div>
              <h2
                className="font-bold text-sm text-[var(--color-text-primary)] dark:text-[var(--dm-text-primary)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Demo Credentials
              </h2>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] dark:text-[var(--dm-text-muted)] mb-4 leading-relaxed">
              Try SmartHire instantly — click copy to fill any field.
            </p>

            <div className="space-y-3">
              {demoAccounts.map((account) => (
                <div
                  key={account.role}
                  className="rounded-[var(--radius-lg)] border border-[var(--color-border)] dark:border-[var(--dm-border)] p-3 space-y-2"
                  style={{ background: 'var(--color-bg-subtle)' }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: account.color }}
                    />
                    <p className="text-xs font-bold" style={{ color: account.color }}>
                      {account.role}
                    </p>
                  </div>

                  {[
                    { label: 'Email', value: account.email },
                    { label: 'Password', value: account.password },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[10px] text-[var(--color-text-muted)] dark:text-[var(--dm-text-muted)]">{label}</p>
                        <p className="text-xs font-medium text-[var(--color-text-primary)] dark:text-[var(--dm-text-primary)] truncate">{value}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(value, label)}
                        className="p-1.5 rounded-[var(--radius-md)] text-[var(--color-text-muted)] hover:text-[var(--color-teal)] dark:hover:text-[var(--dm-accent-teal)] hover:bg-[var(--color-bg-card)] dark:hover:bg-[var(--dm-bg-elevated)] transition-colors flex-shrink-0"
                        aria-label={`Copy ${label} for ${account.role}`}
                      >
                        <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  );
};

export default Login;
