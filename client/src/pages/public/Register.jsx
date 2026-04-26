import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Eye, EyeOff, User, Briefcase, LogIn, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import { authApi } from '@api/authApi';

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleFromUrl = searchParams.get('role') || 'jobseeker';
  const initialFormData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: roleFromUrl,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [verificationNotice, setVerificationNotice] = useState(null);
  const [dismissedNotice, setDismissedNotice] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      if (response.success) {
        setVerificationNotice(formData.email);
        setErrors({});
        setFormData({ ...initialFormData, role: formData.role });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-dark-bg dark:via-dark-bg-secondary dark:to-dark-bg p-4">

      {/* ── Top-right floating Demo Credentials Notice ── */}
      {!dismissedNotice && (
        <div className="fixed top-4 right-4 z-50 w-72 max-w-[calc(100vw-2rem)]">
          <div className="relative rounded-xl border border-primary-200 dark:border-primary-800/50 bg-white dark:bg-dark-bg-secondary shadow-lg shadow-primary-100/40 dark:shadow-black/30 overflow-hidden">
            {/* Top accent strip — same gradient as logo */}
            <div className="h-1 w-full bg-gradient-to-r from-primary-600 to-accent-600" />

            <div className="p-4">
              {/* Dismiss */}
              <button
                type="button"
                onClick={() => setDismissedNotice(true)}
                className="absolute top-3 right-3 p-1 rounded-md text-light-text-secondary dark:text-dark-text-secondary hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                aria-label="Dismiss notice"
              >
                <X className="h-3.5 w-3.5" />
              </button>

              <div className="flex items-center gap-2 mb-2 pr-6">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/40">
                  <LogIn className="h-3.5 w-3.5 text-primary-600 dark:text-primary-400" />
                </div>
                <p className="text-sm font-semibold text-light-text dark:text-dark-text">
                  Demo Credentials Available
                </p>
              </div>

              <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary leading-relaxed mb-3">
                Explore without registering — demo accounts for Job Seeker, Recruiter &amp; Admin are ready on the login page.
              </p>

              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white text-xs font-semibold px-3 py-2 transition-colors duration-150 shadow-sm shadow-primary-200 dark:shadow-primary-900/40"
              >
                <LogIn className="h-3.5 w-3.5" />
                Go to Login Page
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Centered Registration Form ── */}
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-dark-bg-secondary shadow-xl shadow-primary-100/20 dark:shadow-black/40 rounded-2xl border border-light-border dark:border-dark-border p-8">

          {/* Logo */}
          <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center shadow-md shadow-primary-200/60 dark:shadow-primary-900/40">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-2xl font-bold text-light-text dark:text-dark-text tracking-tight">
              SmartHire
            </span>
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-light-text dark:text-dark-text mb-1">
              Create Account
            </h1>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              Join SmartHire and start your journey
            </p>
          </div>

          {verificationNotice ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                      Check your email for verification
                    </p>
                    <p className="mt-1 text-xs text-emerald-800 dark:text-emerald-300">
                      We sent a verification link to{' '}
                      <span className="font-semibold">{verificationNotice}</span>.
                    </p>
                    <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-400">
                      Open your inbox (check spam), verify your account, then sign in.
                    </p>
                  </div>
                </div>
              </div>

              <Button type="button" className="w-full" size="lg" onClick={() => navigate('/login')}>
                Go to Sign In
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setVerificationNotice(null);
                  setErrors({});
                  setFormData({ ...initialFormData, role: formData.role });
                }}
              >
                Register Another Account
              </Button>
            </div>
          ) : (
            <>
              {/* Role Selection */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'jobseeker' })}
                  className={`p-4 rounded-xl border-2 transition-all duration-150 flex flex-col items-center gap-1.5 ${
                    formData.role === 'jobseeker'
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary hover:border-primary-300 dark:hover:border-primary-700'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <p className="text-sm font-medium">Job Seeker</p>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'recruiter' })}
                  className={`p-4 rounded-xl border-2 transition-all duration-150 flex flex-col items-center gap-1.5 ${
                    formData.role === 'recruiter'
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary hover:border-primary-300 dark:hover:border-primary-700'
                  }`}
                >
                  <Briefcase className="w-5 h-5" />
                  <p className="text-sm font-medium">Recruiter</p>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Full Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  placeholder="John Doe"
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  placeholder="you@example.com"
                  required
                />

                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    placeholder="••••••••"
                    helperText="Must be at least 8 characters"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="relative">
                  <Input
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-start space-x-2.5">
                  <input
                    type="checkbox"
                    required
                    className="mt-0.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">
                    I agree to the{' '}
                    <Link to="/terms" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
                      Privacy Policy
                    </Link>
                  </span>
                </div>

                <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                  Create Account
                </Button>
              </form>

              <div className="mt-5 text-center">
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;