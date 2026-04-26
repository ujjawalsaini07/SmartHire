import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase, FileText, ChevronRight, CheckCircle2,
  X, Bell, TrendingUp, Users, PlusCircle, ArrowRight,
  BarChart3, Zap
} from 'lucide-react';
import { recruiterApi } from '@api/recruiterApi';
import { notificationApi } from '@api/notificationApi';
import useAuthStore from '@store/authStore';

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
const SkeletonJobRow = () => (
  <div className="flex items-center justify-between px-5 py-4 animate-pulse">
    <div className="space-y-2 flex-1">
      <div className="skeleton h-4 w-48" />
      <div className="skeleton h-3 w-28" />
    </div>
    <div className="skeleton h-8 w-20 rounded-[var(--radius-lg)]" />
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

/* ── Main Dashboard ── */
const Dashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ activeJobs: 0, totalApplications: 0 });
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notifDismissed, setNotifDismissed] = useState(false);

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const jobsRes = await recruiterApi.getMyJobs({ limit: 5 });
      const jobs = jobsRes.data || jobsRes.jobs || [];
      setStats({
        activeJobs: jobs.filter(j => j.status === 'active').length || jobs.length,
        totalApplications: jobs.reduce((acc, j) => acc + (j.applicationCount || 0), 0),
      });
      setRecentJobs(jobs.slice(0, 5));
      try {
        const notifRes = await notificationApi.getNotifications();
        if (notifRes.success) setNotifications(notifRes.data.filter(n => !n.isRead));
      } catch {}
    } catch {
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const firstName = user?.name?.split(' ')[0] || 'Recruiter';

  const tips = [
    { num: 1, text: 'Add clear salary ranges to increase applicants by 30%.', accent: 'var(--color-teal)' },
    { num: 2, text: 'Review applications within 48 hours for the best candidate retention.', accent: '#3B82F6' },
    { num: 3, text: 'Keep your Company Profile fresh to build trust with candidates.', accent: '#7C3AED' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-7">

      {/* ── Notification Banner ── */}
      {notifications.length > 0 && !notifDismissed && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between gap-4 rounded-[var(--radius-lg)] p-4 border"
          style={{ background: 'rgba(0,201,177,0.06)', borderColor: 'rgba(0,201,177,0.25)' }}
          role="alert" aria-live="polite"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[var(--radius-md)] flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,201,177,0.12)' }}>
              <Bell className="w-4 h-4 text-[var(--color-teal)]" aria-hidden="true" />
            </div>
            <p className="text-sm font-semibold text-[var(--color-text-primary)] dark:text-[var(--dm-text-primary)]">
              {notifications.length} new notification{notifications.length > 1 ? 's' : ''} — check the bell icon in the navbar.
            </p>
          </div>
          <button
            onClick={() => setNotifDismissed(true)}
            className="p-1.5 rounded-[var(--radius-md)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)] dark:hover:bg-[var(--dm-bg-elevated)] transition-colors flex-shrink-0"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </motion.div>
      )}

      {/* ── Page Hero Header ── */}
      <div className="page-hero flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-[var(--color-teal)]" aria-hidden="true" />
            <span className="text-xs font-medium text-[var(--color-teal)] dark:text-[var(--dm-accent-teal)] uppercase tracking-wider">
              Recruiter Dashboard
            </span>
          </div>
          <h1
            className="text-3xl font-bold text-[var(--color-text-primary)] dark:text-[var(--dm-text-primary)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Welcome back, {firstName}! 👋
          </h1>
          <p className="text-[var(--color-text-secondary)] dark:text-[var(--dm-text-secondary)] mt-1">
            Manage your pipeline and active listings.
          </p>
        </div>
        <Link to="/recruiter/post-job" className="btn btn-primary btn-md flex-shrink-0">
          <PlusCircle className="w-4 h-4" aria-hidden="true" />
          Post a Job
        </Link>
      </div>

      {/* ── Error state ── */}
      {error && (
        <div className="flex items-center justify-between gap-4 rounded-[var(--radius-lg)] p-4 border" style={{ background: 'rgba(239,68,68,0.06)', borderColor: 'rgba(239,68,68,0.25)' }} role="alert">
          <p className="text-sm text-[var(--color-error)]">{error}</p>
          <button onClick={() => { setError(null); fetchDashboardData(); }} className="btn btn-danger btn-sm">Retry</button>
        </div>
      )}

      {/* ── KPI Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {loading ? (
          <><SkeletonKPI /><SkeletonKPI /><SkeletonKPI /></>
        ) : (
          <>
            <KPICard icon={Briefcase} label="Active Jobs" value={stats.activeJobs} accent="var(--color-teal)" bg="rgba(0,201,177,0.10)" sub="Live on SmartHire" delay={0} />
            <KPICard icon={Users} label="Total Applicants" value={stats.totalApplications} accent="#3B82F6" bg="rgba(59,130,246,0.10)" sub="Across all listings" delay={0.08} />
            <KPICard icon={CheckCircle2} label="Account Status" value="Verified" accent="#10B981" bg="rgba(16,185,129,0.10)" sub="Your account is approved" delay={0.16} />
          </>
        )}
      </div>

      {/* ── Two-column ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Jobs */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)] dark:border-[var(--dm-border)]">
            <h2 className="text-base font-bold text-[var(--color-text-primary)] dark:text-[var(--dm-text-primary)] flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
              <Briefcase className="w-4 h-4 text-[var(--color-teal)]" aria-hidden="true" />
              Recent Job Postings
            </h2>
            <Link to="/recruiter/jobs" className="flex items-center gap-1 text-xs font-medium text-[var(--color-teal)] dark:text-[var(--dm-accent-teal)] hover:opacity-80 transition-opacity">
              View all <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="divide-y divide-[var(--color-border)] dark:divide-[var(--dm-border)]">
            {loading ? (
              <div className="space-y-0">
                <SkeletonJobRow /><SkeletonJobRow /><SkeletonJobRow />
              </div>
            ) : recentJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-center px-6">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ background: 'var(--color-bg-subtle)' }}>
                  <Briefcase className="w-6 h-6 text-[var(--color-text-muted)] dark:text-[var(--dm-text-muted)]" aria-hidden="true" />
                </div>
                <p className="text-sm font-medium text-[var(--color-text-primary)] dark:text-[var(--dm-text-primary)] mb-1">No jobs posted yet</p>
                <p className="text-xs text-[var(--color-text-muted)] dark:text-[var(--dm-text-muted)] mb-4">Post your first job to start receiving applications.</p>
                <Link to="/recruiter/post-job" className="btn btn-primary btn-sm">
                  <PlusCircle className="w-4 h-4" aria-hidden="true" />
                  Post a Job
                </Link>
              </div>
            ) : (
              recentJobs.map((job, i) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between px-5 py-4 hover:bg-[var(--color-bg-subtle)] dark:hover:bg-[var(--dm-bg-elevated)] transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[var(--color-text-primary)] dark:text-[var(--dm-text-primary)] truncate" style={{ fontFamily: 'var(--font-display)' }}>
                      {job.title}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)] dark:text-[var(--dm-text-muted)] mt-0.5 flex items-center gap-1">
                      <FileText className="w-3 h-3" aria-hidden="true" />
                      {job.applicationCount || 0} application{job.applicationCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <Link
                    to={`/recruiter/jobs/${job._id}`}
                    className="btn btn-secondary btn-sm flex-shrink-0 ml-4"
                  >
                    Manage
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Recruiting Tips */}
        <div className="card p-5 overflow-hidden relative">
          <div
            className="absolute -top-12 -right-12 w-44 h-44 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, var(--color-teal), transparent)' }}
          />

          <h2
            className="text-base font-bold text-[var(--color-text-primary)] dark:text-[var(--dm-text-primary)] flex items-center gap-2 mb-5"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <BarChart3 className="w-4 h-4 text-[var(--color-teal)]" aria-hidden="true" />
            Recruiting Tips
          </h2>

          <div className="space-y-4">
            {tips.map((tip) => (
              <div key={tip.num} className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ background: tip.accent }}
                >
                  {tip.num}
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] dark:text-[var(--dm-text-secondary)] leading-relaxed pt-1">
                  {tip.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-[var(--color-border)] dark:border-[var(--dm-border)]">
            <Link to="/recruiter/applications" className="btn btn-outline btn-sm w-full">
              View All Applications
              <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="card p-5">
        <h2 className="text-base font-bold text-[var(--color-text-primary)] dark:text-[var(--dm-text-primary)] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { to: '/recruiter/post-job', icon: PlusCircle, label: 'Post Job', accent: 'var(--color-teal)', bg: 'rgba(0,201,177,0.10)' },
            { to: '/recruiter/applications', icon: FileText, label: 'Applications', accent: '#3B82F6', bg: 'rgba(59,130,246,0.10)' },
            { to: '/recruiter/candidates', icon: Users, label: 'Candidates', accent: '#7C3AED', bg: 'rgba(124,58,237,0.10)' },
            { to: '/recruiter/analytics', icon: BarChart3, label: 'Analytics', accent: '#F59E0B', bg: 'rgba(245,158,11,0.10)' },
          ].map(({ to, icon: Icon, label, accent, bg }) => (
            <Link
              key={to}
              to={to}
              className="flex flex-col items-center gap-2.5 p-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] dark:border-[var(--dm-border)] hover:border-[var(--color-teal)] dark:hover:border-[var(--dm-accent-teal)] hover:-translate-y-0.5 transition-all duration-200 text-center"
            >
              <div className="w-10 h-10 rounded-[var(--radius-lg)] flex items-center justify-center" style={{ background: bg }}>
                <Icon className="w-5 h-5" style={{ color: accent }} aria-hidden="true" />
              </div>
              <span className="text-xs font-medium text-[var(--color-text-secondary)] dark:text-[var(--dm-text-secondary)]">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
