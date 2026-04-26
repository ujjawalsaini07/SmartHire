import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, UserCheck, Briefcase, Building2,
  FileText, BarChart3, Shield, AlertTriangle, TrendingUp, Zap
} from 'lucide-react';
import { adminApi } from '@api/adminApi';
import useAuthStore from '@store/authStore';
import { toast } from 'react-hot-toast';

/* ── Skeleton ── */
const SkeletonKPI = () => (
  <div className="kpi-card">
    <div className="flex items-start justify-between mb-4">
      <div className="skeleton h-3 w-28" />
      <div className="skeleton w-12 h-12 rounded-[var(--radius-lg)]" />
    </div>
    <div className="skeleton h-9 w-20 mb-1" />
    <div className="skeleton h-3 w-24" />
  </div>
);

/* ── KPI Card ── */
const KPICard = ({ icon: Icon, label, value, accent, bg, sub, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    className="kpi-card relative"
  >
    <div
      className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[var(--radius-xl)]"
      style={{ background: `linear-gradient(90deg, ${accent}, ${accent}88)` }}
    />
    <div className="flex items-start justify-between mb-4">
      <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)] dark:text-[var(--dm-text-muted)]">
        {label}
      </p>
      <div className="kpi-icon-wrap" style={{ background: bg }}>
        <Icon className="w-5 h-5" style={{ color: accent }} aria-hidden="true" />
      </div>
    </div>
    <p
      className="text-4xl font-bold text-[var(--color-text-primary)] dark:text-[var(--dm-text-primary)] mb-1"
      style={{ fontFamily: 'var(--font-display)' }}
    >
      {value}
    </p>
    {sub && (
      <p className="text-xs text-[var(--color-text-muted)] dark:text-[var(--dm-text-muted)] flex items-center gap-1">
        <TrendingUp className="w-3 h-3" style={{ color: accent }} aria-hidden="true" />
        {sub}
      </p>
    )}
  </motion.div>
);

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0, activeUsers: 0, totalJobs: 0,
    totalRecruiters: 0, totalApplications: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboardStats(); }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getAdminDashboardStats();
      const data = response.data || response;
      setStats({
        totalUsers: data.users?.total || 0,
        activeUsers: data.users?.jobSeekers || 0,
        totalJobs: data.jobs?.total || 0,
        totalRecruiters: data.users?.recruiters || 0,
        totalApplications: data.applications?.total || 0,
      });
    } catch {
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const quickActions = [
    { to: '/admin/users',           icon: Users,    label: 'Manage Users',      accent: 'var(--color-teal)', bg: 'rgba(0,201,177,0.10)' },
    { to: '/admin/recruiters',      icon: Building2, label: 'Verify Recruiters', accent: '#3B82F6',           bg: 'rgba(59,130,246,0.10)' },
    { to: '/admin/jobs/moderate',   icon: AlertTriangle, label: 'Moderate Jobs', accent: '#F59E0B',          bg: 'rgba(245,158,11,0.10)' },
    { to: '/admin/analytics',       icon: BarChart3, label: 'View Analytics',    accent: '#7C3AED',           bg: 'rgba(124,58,237,0.10)' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-7">

      {/* ── Page Hero Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="page-hero flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-[var(--color-teal)]" aria-hidden="true" />
            <span className="text-xs font-medium text-[var(--color-teal)] dark:text-[var(--dm-accent-teal)] uppercase tracking-wider">
              Admin Control Panel
            </span>
          </div>
          <h1
            className="text-3xl font-bold text-[var(--color-text-primary)] dark:text-[var(--dm-text-primary)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {getGreeting()}, {user?.name || 'Admin'}! 👋
          </h1>
          <p className="text-[var(--color-text-secondary)] dark:text-[var(--dm-text-secondary)] mt-1">
            Platform overview — here's what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-lg)] border border-[var(--color-teal)]/30 bg-[var(--color-teal)]/06">
          <Zap className="w-4 h-4 text-[var(--color-teal)]" aria-hidden="true" />
          <span className="text-sm font-medium text-[var(--color-teal)] dark:text-[var(--dm-accent-teal)]">
            All systems operational
          </span>
        </div>
      </motion.div>

      {/* ── KPI Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonKPI key={i} />)
        ) : (
          <>
            <KPICard icon={Users}     label="Total Users"       value={stats.totalUsers.toLocaleString()}       accent="var(--color-teal)" bg="rgba(0,201,177,0.10)" sub="All registered accounts" delay={0} />
            <KPICard icon={UserCheck} label="Job Seekers"       value={stats.activeUsers.toLocaleString()}      accent="#3B82F6"           bg="rgba(59,130,246,0.10)" sub="Active job seekers" delay={0.07} />
            <KPICard icon={Briefcase} label="Total Jobs"        value={stats.totalJobs.toLocaleString()}        accent="#7C3AED"           bg="rgba(124,58,237,0.10)" sub="Across all categories" delay={0.14} />
            <KPICard icon={Building2} label="Recruiter Accounts" value={stats.totalRecruiters.toLocaleString()} accent="#F59E0B"           bg="rgba(245,158,11,0.10)" sub="Company accounts" delay={0.21} />
          </>
        )}
      </div>

      {/* ── Full-width KPI ── */}
      <div className="grid grid-cols-1">
        {loading ? (
          <SkeletonKPI />
        ) : (
          <KPICard
            icon={FileText}
            label="Total Applications"
            value={stats.totalApplications.toLocaleString()}
            accent="#10B981"
            bg="rgba(16,185,129,0.10)"
            sub="Submitted across all job listings"
            delay={0.28}
          />
        )}
      </div>

      {/* ── Quick Actions ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="card p-6"
      >
        <h2
          className="text-base font-bold text-[var(--color-text-primary)] dark:text-[var(--dm-text-primary)] mb-5"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickActions.map(({ to, icon: Icon, label, accent, bg }) => (
            <button
              key={to}
              onClick={() => navigate(to)}
              className="flex flex-col items-center gap-3 p-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] dark:border-[var(--dm-border)] hover:border-[var(--color-teal)] dark:hover:border-[var(--dm-accent-teal)] hover:-translate-y-0.5 transition-all duration-200 text-center group"
            >
              <div
                className="w-12 h-12 rounded-[var(--radius-lg)] flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                style={{ background: bg }}
              >
                <Icon className="w-6 h-6" style={{ color: accent }} aria-hidden="true" />
              </div>
              <span className="text-sm font-medium text-[var(--color-text-secondary)] dark:text-[var(--dm-text-secondary)]">
                {label}
              </span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
