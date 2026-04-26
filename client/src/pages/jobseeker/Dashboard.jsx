import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase, Bookmark, FileText, ChevronRight,
  CheckCircle, Star, MapPin, X, Bell,
  TrendingUp, ClipboardList, ArrowRight, Zap
} from 'lucide-react';
import { jobSeekerApi } from '@api/jobSeekerApi';
import { notificationApi } from '@api/notificationApi';
import useAuthStore from '@store/authStore';

/* ── Skeleton components ── */
const SkeletonKPI = () => (
  <div className="kpi-card">
    <div className="flex items-start justify-between mb-4">
      <div className="skeleton h-3 w-28" />
      <div className="skeleton kpi-icon-wrap" />
    </div>
    <div className="skeleton h-9 w-20 mb-1" />
    <div className="skeleton h-3 w-16" />
  </div>
);

const SkeletonRow = () => (
  <div className="flex items-center justify-between p-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] dark:border-[var(--dm-border)] animate-pulse">
    <div className="flex items-center gap-3 flex-1">
      <div className="skeleton w-10 h-10 rounded-[var(--radius-lg)]" />
      <div className="space-y-2">
        <div className="skeleton h-4 w-40" />
        <div className="skeleton h-3 w-28" />
      </div>
    </div>
    <div className="skeleton h-6 w-20 rounded-full" />
  </div>
);

/* ── Status badge ── */
const StatusBadge = ({ status }) => {
  const map = {
    accepted:    { cls: 'badge-success', label: 'Accepted' },
    rejected:    { cls: 'badge-error',   label: 'Rejected' },
    interviewing:{ cls: 'badge-teal',    label: 'Interview' },
    review:      { cls: 'badge-warning', label: 'In Review' },
    applied:     { cls: 'badge-navy',    label: 'Applied' },
  };
  const { cls, label } = map[status?.toLowerCase()] || { cls: 'badge-gray', label: status || 'Applied' };
  return <span className={`badge ${cls} capitalize`} role="status">{label}</span>;
};

/* ── KPI Card ── */
const KPICard = ({ icon: Icon, label, value, accent, bg, trend, trendLabel, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    className="kpi-card"
    style={{ '--card-accent': accent }}
  >
    {/* Top accent line via data attr */}
    <div
      className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[var(--radius-xl)]"
      style={{ background: `linear-gradient(90deg, ${accent}, ${accent}88)` }}
    />
    <div className="flex items-start justify-between mb-4">
      <p
        className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)] dark:text-[var(--dm-text-muted)]"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        {label}
      </p>
      <div
        className="kpi-icon-wrap"
        style={{ background: bg }}
      >
        <Icon className="w-5 h-5" style={{ color: accent }} aria-hidden="true" />
      </div>
    </div>

    <p
      className="text-4xl font-bold text-[var(--color-text-primary)] dark:text-[var(--dm-text-primary)] mb-1"
      style={{ fontFamily: 'var(--font-display)' }}
    >
      {value}
    </p>

    {trend !== undefined && (
      <p className="text-xs text-[var(--color-text-muted)] dark:text-[var(--dm-text-muted)] flex items-center gap-1">
        <TrendingUp className="w-3 h-3" style={{ color: accent }} aria-hidden="true" />
        {trendLabel}
      </p>
    )}
  </motion.div>
);

/* ── Main Dashboard ── */
const Dashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ applications: 0, savedJobs: 0 });
  const [recentApplications, setRecentApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notifDismissed, setNotifDismissed] = useState(false);

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [appRes, savedRes] = await Promise.all([
        jobSeekerApi.getMyApplications({ limit: 5 }),
        jobSeekerApi.getSavedJobs(),
      ]);
      setStats({
        applications: appRes.count || appRes.data?.length || 0,
        savedJobs: savedRes.count || savedRes.data?.savedJobs?.length || savedRes.savedJobs?.length || 0,
      });
      setRecentApplications(appRes.data || appRes.applications || []);
      try {
        const recRes = await jobSeekerApi.getRecommendedJobs({ limit: 4 });
        setRecommendedJobs(recRes.data || []);
      } catch {}
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

  const firstName = user?.name?.split(' ')[0] || user?.firstName || 'there';

  return (
    <div className="max-w-7xl mx-auto space-y-7">

      {/* ── Notification Banner ── */}
      {notifications.length > 0 && !notifDismissed && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-start justify-between gap-4 rounded-[var(--radius-lg)] p-4 border"
          style={{
            background: 'rgba(0,201,177,0.06)',
            borderColor: 'rgba(0,201,177,0.25)',
          }}
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-[var(--radius-md)] flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(0,201,177,0.12)' }}
            >
              <Bell className="w-4 h-4 text-[var(--color-teal)]" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--color-text-primary)] dark:text-[var(--dm-text-primary)]">
                You have {notifications.length} unread notification{notifications.length > 1 ? 's' : ''}
              </p>
              <p className="text-xs text-[var(--color-text-muted)] dark:text-[var(--dm-text-muted)] mt-0.5">
                Check the bell icon for updates on your applications.
              </p>
            </div>
          </div>
          <button
            onClick={() => setNotifDismissed(true)}
            className="p-1.5 rounded-[var(--radius-md)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)] dark:hover:bg-[var(--dm-bg-elevated)] transition-colors flex-shrink-0"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </motion.div>
      )}

      {/* ── Page Header ── */}
      <div className="page-hero flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-[var(--color-teal)]" aria-hidden="true" />
            <span className="text-xs font-medium text-[var(--color-teal)] dark:text-[var(--dm-accent-teal)] uppercase tracking-wider">
              Dashboard
            </span>
          </div>
          <h1
            className="text-3xl font-bold text-[var(--color-text-primary)] dark:text-[var(--dm-text-primary)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Welcome back, {firstName}! 👋
          </h1>
          <p className="text-[var(--color-text-secondary)] dark:text-[var(--dm-text-secondary)] mt-1">
            Here's your career summary for today.
          </p>
        </div>

        <Link
          to="/jobs"
          className="btn btn-primary btn-md flex-shrink-0"
        >
          <Briefcase className="w-4 h-4" aria-hidden="true" />
          Browse Jobs
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>

      {/* ── Error state ── */}
      {error && (
        <div
          className="flex items-center justify-between gap-4 rounded-[var(--radius-lg)] p-4 border"
          style={{ background: 'rgba(239,68,68,0.06)', borderColor: 'rgba(239,68,68,0.25)' }}
          role="alert"
        >
          <p className="text-sm text-[var(--color-error)]">{error}</p>
          <button
            onClick={() => { setError(null); fetchDashboardData(); }}
            className="btn btn-sm btn-danger"
          >
            Retry
          </button>
        </div>
      )}

      {/* ── KPI Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {loading ? (
          <><SkeletonKPI /><SkeletonKPI /><SkeletonKPI /></>
        ) : (
          <>
            <KPICard
              icon={FileText}
              label="Total Applications"
              value={stats.applications}
              accent="var(--color-teal)"
              bg="rgba(0,201,177,0.10)"
              trendLabel="Keep applying!"
              delay={0}
            />
            <KPICard
              icon={Bookmark}
              label="Saved Jobs"
              value={stats.savedJobs}
              accent="#3B82F6"
              bg="rgba(59,130,246,0.10)"
              trendLabel="Review saved listings"
              delay={0.08}
            />
            <KPICard
              icon={CheckCircle}
              label="Profile Status"
              value="Active"
              accent="#10B981"
              bg="rgba(16,185,129,0.10)"
              trendLabel="Profile is live to recruiters"
              delay={0.16}
            />
          </>
        )}
      </div>

      {/* ── Two-column ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Applications */}
        <div
          className="lg:col-span-2 card overflow-hidden"
        >
          <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)] dark:border-[var(--dm-border)]">
            <h2
              className="text-base font-bold text-[var(--color-text-primary)] dark:text-[var(--dm-text-primary)] flex items-center gap-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <ClipboardList className="w-4 h-4 text-[var(--color-teal)]" aria-hidden="true" />
              Recent Applications
            </h2>
            <Link
              to="/jobseeker/applications"
              className="flex items-center gap-1 text-xs font-medium text-[var(--color-teal)] dark:text-[var(--dm-accent-teal)] hover:opacity-80 transition-opacity"
            >
              View all <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="divide-y divide-[var(--color-border)] dark:divide-[var(--dm-border)]">
            {loading ? (
              <div className="p-4 space-y-3">
                <SkeletonRow /><SkeletonRow /><SkeletonRow />
              </div>
            ) : recentApplications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                  style={{ background: 'var(--color-bg-subtle)' }}
                >
                  <FileText className="w-6 h-6 text-[var(--color-text-muted)] dark:text-[var(--dm-text-muted)]" aria-hidden="true" />
                </div>
                <p className="text-sm font-medium text-[var(--color-text-primary)] dark:text-[var(--dm-text-primary)] mb-1">
                  No applications yet
                </p>
                <p className="text-xs text-[var(--color-text-muted)] dark:text-[var(--dm-text-muted)] mb-4">
                  Start applying to track your progress here
                </p>
                <Link to="/jobs" className="btn btn-primary btn-sm">Browse Jobs</Link>
              </div>
            ) : (
              recentApplications.map((app, i) => (
                <motion.div
                  key={app._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between px-5 py-4 hover:bg-[var(--color-bg-subtle)] dark:hover:bg-[var(--dm-bg-elevated)] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-[var(--radius-lg)] flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, var(--color-teal), var(--color-deep))' }}
                    >
                      {(app.jobId?.companyId?.companyName || app.jobId?.company || 'C').charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p
                        className="text-sm font-semibold text-[var(--color-text-primary)] dark:text-[var(--dm-text-primary)] truncate"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {app.jobId?.title || 'Unknown Role'}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)] dark:text-[var(--dm-text-muted)] truncate">
                        {app.jobId?.companyId?.companyName || app.jobId?.company || 'Unknown Company'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <StatusBadge status={app.status} />
                    <Link
                      to={`/jobseeker/applications/${app._id}`}
                      className="p-1.5 rounded-[var(--radius-md)] text-[var(--color-text-muted)] hover:text-[var(--color-teal)] hover:bg-[var(--color-bg-subtle)] dark:hover:bg-[var(--dm-bg-elevated)] transition-colors"
                      aria-label="View application details"
                    >
                      <ChevronRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar panel */}
        <div className="space-y-5">
          {/* Profile boost */}
          <div
            className="card p-5 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(0,201,177,0.08), rgba(170,255,199,0.06))',
            }}
          >
            <div
              className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20"
              style={{ background: 'radial-gradient(circle, var(--color-teal), transparent)' }}
            />
            <h3
              className="text-sm font-bold text-[var(--color-text-primary)] dark:text-[var(--dm-text-primary)] mb-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              🚀 Boost Your Profile
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)] dark:text-[var(--dm-text-secondary)] mb-4 leading-relaxed">
              Add skills, experience, and a professional photo to appear in more recruiter searches.
            </p>
            <Link to="/jobseeker/profile" className="btn btn-primary btn-sm w-full">
              Update Profile
            </Link>
          </div>

          {/* Quick links */}
          <div className="card p-5">
            <h3
              className="text-sm font-bold text-[var(--color-text-primary)] dark:text-[var(--dm-text-primary)] mb-3"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Quick Links
            </h3>
            <div className="space-y-1">
              {[
                { to: '/jobs', icon: Briefcase, label: 'Browse Jobs' },
                { to: '/jobseeker/applications', icon: ClipboardList, label: 'My Applications' },
                { to: '/jobseeker/saved-jobs', icon: Bookmark, label: 'Saved Jobs' },
                { to: '/jobseeker/profile', icon: Star, label: 'My Profile' },
              ].map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center justify-between px-3 py-2 rounded-[var(--radius-md)] text-sm text-[var(--color-text-secondary)] dark:text-[var(--dm-text-secondary)] hover:bg-[var(--color-bg-subtle)] dark:hover:bg-[var(--dm-bg-elevated)] hover:text-[var(--color-teal)] dark:hover:text-[var(--dm-accent-teal)] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Icon className="w-4 h-4" aria-hidden="true" />
                    {label}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-50" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Recommended Jobs ── */}
      {!loading && recommendedJobs.length > 0 && (
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)] dark:border-[var(--dm-border)]">
            <h2
              className="text-base font-bold text-[var(--color-text-primary)] dark:text-[var(--dm-text-primary)] flex items-center gap-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <Star className="w-4 h-4 text-[#F59E0B]" aria-hidden="true" />
              Recommended For You
            </h2>
            <Link to="/jobs" className="flex items-center gap-1 text-xs font-medium text-[var(--color-teal)] dark:text-[var(--dm-accent-teal)] hover:opacity-80 transition-opacity">
              Browse all <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-[var(--color-border)] dark:divide-[var(--dm-border)]">
            {recommendedJobs.map((job, i) => (
              <Link
                key={job._id}
                to="/jobs"
                className="flex items-start gap-3 p-5 hover:bg-[var(--color-bg-subtle)] dark:hover:bg-[var(--dm-bg-elevated)] transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-[var(--radius-lg)] flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, var(--color-teal), var(--color-deep))' }}
                >
                  {(job.companyId?.companyName || 'C').charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-semibold text-[var(--color-text-primary)] dark:text-[var(--dm-text-primary)] truncate"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {job.title}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] dark:text-[var(--dm-text-muted)]">
                    {job.companyId?.companyName || 'Company'}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-[var(--color-text-muted)] dark:text-[var(--dm-text-muted)]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" aria-hidden="true" />
                      {job.location?.isRemote ? 'Remote' : (job.location?.city || 'N/A')}
                    </span>
                    <span className="capitalize">{job.employmentType || 'Full-time'}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;