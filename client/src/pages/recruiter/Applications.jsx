import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  CheckCircle,
  XCircle,
  Search,
  ExternalLink,
  Trash2,
  Star,
  Calendar,
  AlertTriangle,
  Users,
  MessageSquare,
  Award,
  ArrowLeft,
  MapPin,
  Zap,
  ChevronDown,
  Briefcase,
  Lock,
  Video,
  CheckCheck,
  Filter,
  Crown,
} from 'lucide-react';
import { recruiterApi } from '@api/recruiterApi';
import Spinner from '@components/common/Spinner';
import Button from '@components/common/Button';
import toast from 'react-hot-toast';
import Modal from '@components/common/Modal';

// ─── constants ────────────────────────────────────────────────────────────────
const STATUS_META = {
  submitted:    { label: 'Applied',      dot: '#f59e0b', cls: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800' },
  reviewed:     { label: 'Reviewed',     dot: '#3b82f6', cls: 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' },
  shortlisted:  { label: 'Shortlisted',  dot: '#8b5cf6', cls: 'bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-800' },
  interviewing: { label: 'Interviewing', dot: '#6366f1', cls: 'bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800' },
  accepted:     { label: 'Accepted',     dot: '#10b981', cls: 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' },
  rejected:     { label: 'Rejected',     dot: '#ef4444', cls: 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800' },
  withdrawn:    { label: 'Withdrawn',    dot: '#9ca3af', cls: 'bg-gray-100 text-gray-500 border border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700' },
};

const JOB_STATUS = {
  active:             { cls: 'bg-emerald-500', label: 'Active' },
  closed:             { cls: 'bg-orange-500',  label: 'Closed' },
  filled:             { cls: 'bg-blue-500',    label: 'Filled' },
  draft:              { cls: 'bg-gray-400',    label: 'Draft' },
  'pending-approval': { cls: 'bg-amber-500',   label: 'Pending' },
  rejected:           { cls: 'bg-red-500',     label: 'Rejected' },
};

const APPLICATION_STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'submitted', label: 'Applied' },
  { value: 'reviewed', label: 'Reviewed' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'interviewing', label: 'Interviewing' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
];

const JOB_FILTER_OPTIONS = [
  { value: 'all', label: 'All Jobs' },
  { value: 'active', label: 'Active' },
  { value: 'pending-approval', label: 'Pending' },
  { value: 'filled', label: 'Filled' },
  { value: 'closed', label: 'Closed' },
  { value: 'draft', label: 'Draft' },
  { value: 'rejected', label: 'Rejected' },
];

// ─── helpers ──────────────────────────────────────────────────────────────────
const fmt = d => d ? new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
const fmtTime = d => d ? new Date(d).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '—';
const fmtShort = d => d ? new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : '—';
const fmtLongShort = d => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
const fmtMonthYear = d => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present';
const formatLocation = (location = {}) => {
  if (location.isRemote) return 'Remote';
  const parts = [location.city, location.state, location.country].filter(Boolean);
  return parts.length ? parts.join(', ') : 'Location not set';
};
const formatEmployment = (type) => type ? type.replace(/-/g, ' ') : 'Flexible';
const formatDegree = (degree) => degree ? degree.replace(/-/g, ' ') : 'Not specified';
const formatSalary = (salary = {}) => {
  const min = salary?.min;
  const max = salary?.max;
  if (!min && !max) return 'Not disclosed';

  const currency = salary?.currency || 'USD';
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  });

  if (min && max) return `${formatter.format(min)} - ${formatter.format(max)}`;
  return formatter.format(min || max);
};
const toLabel = (value) => (value ? String(value).replace(/-/g, ' ') : 'Not specified');
const metricValue = (value) => new Intl.NumberFormat('en-US').format(value || 0);
const safeCount = (value) => (Array.isArray(value) ? value.length : 0);
const getCandidateName = (app) => {
  const profile = app.jobSeekerProfile || {};
  const seeker = app.jobSeekerId || {};
  return [
    profile.firstName || seeker.firstName || seeker.name,
    profile.lastName || seeker.lastName,
  ].filter(Boolean).join(' ') || seeker.name || 'Unknown Candidate';
};
const getCandidateInitials = (name) => name
  .split(' ')
  .filter(Boolean)
  .map(word => word[0])
  .join('')
  .substring(0, 2)
  .toUpperCase();
const getCandidateLocation = (profile = {}) => {
  const location = profile.location || {};
  const parts = [location.city, location.state, location.country].filter(Boolean);
  return parts.length ? parts.join(', ') : 'Location not specified';
};

// ─── micro-components ─────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const m = STATUS_META[status] || STATUS_META.submitted;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${m.cls}`}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: m.dot }} />
      {m.label}
    </span>
  );
};

const StarRow = ({ value, onChange, readonly = false }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(s => (
      <Star key={s}
        onClick={() => !readonly && onChange?.(s)}
        className={`transition-all ${readonly ? 'w-4 h-4' : 'w-5 h-5 cursor-pointer hover:scale-125'} ${
          value >= s ? 'text-amber-400 fill-amber-400' : 'text-gray-200 dark:text-gray-700'
        }`}
      />
    ))}
  </div>
);

// ─── main ─────────────────────────────────────────────────────────────────────
export default function Applications() {
  const navigate = useNavigate();
  const [view, setView] = useState('jobs');          // 'jobs' | 'apps'
  const [jobs, setJobs] = useState([]);
  const [jobSearch, setJobSearch] = useState('');
  const [jobStatusFilter, setJobStatusFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState(null);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [localNotes, setLocalNotes] = useState({});
  const [appSearch, setAppSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, appId: null, status: null });
  const [interviewModal, setInterviewModal] = useState({ isOpen: false, appId: null, scheduledAt: '', meetingLink: '', notes: '' });
  const [closingJob, setClosingJob] = useState(false);

  // load jobs
  useEffect(() => {
    (async () => {
      try {
        setLoadingJobs(true);
        const res = await recruiterApi.getMyJobs({ limit: 100 });
        setJobs(res.data || []);
      } catch { toast.error('Failed to load jobs'); }
      finally { setLoadingJobs(false); }
    })();
  }, []);

  const openJob = async (job) => {
    setSelectedJob(job);
    setView('apps');
    setExpandedId(null);
    setAppSearch('');
    setStatusFilter('');
    setShowJobDetails(false);
    try {
      setLoadingApps(true);
      const res = await recruiterApi.getApplicationsForJob(job._id);
      setApplications(res.data || []);
    } catch { toast.error('Failed to load applications'); }
    finally { setLoadingApps(false); }
  };

  const backToJobs = () => {
    setView('jobs');
    setSelectedJob(null);
    setApplications([]);
    setExpandedId(null);
    setShowJobDetails(false);
  };

  const refreshApps = async () => {
    if (!selectedJob) return;
    const res = await recruiterApi.getApplicationsForJob(selectedJob._id);
    const updated = res.data || [];
    setApplications(updated);
    if (expandedId && !updated.find(a => a._id === expandedId)) setExpandedId(null);
  };

  const filteredJobs = useMemo(() => {
    let list = jobs;

    if (jobStatusFilter !== 'all') {
      list = list.filter(job => job.status === jobStatusFilter);
    }

    if (jobSearch.trim()) {
      const q = jobSearch.toLowerCase();
      list = list.filter(job =>
        job.title.toLowerCase().includes(q) ||
        formatLocation(job.location).toLowerCase().includes(q) ||
        (job.employmentType || '').toLowerCase().includes(q)
      );
    }

    return list;
  }, [jobs, jobSearch, jobStatusFilter]);

  const jobFilterCounts = useMemo(() => {
    const counts = jobs.reduce((acc, job) => {
      acc[job.status] = (acc[job.status] || 0) + 1;
      return acc;
    }, {});

    return JOB_FILTER_OPTIONS.map(option => ({
      ...option,
      count: option.value === 'all' ? jobs.length : counts[option.value] || 0,
    }));
  }, [jobs]);

  const filteredApps = useMemo(() => {
    let list = applications;
    if (appSearch.trim()) {
      const q = appSearch.toLowerCase();
      list = list.filter((a) => {
        const profile = a.jobSeekerProfile || {};
        const location = getCandidateLocation(profile);
        const searchable = [
          getCandidateName(a),
          a.jobSeekerId?.email,
          profile.headline,
          profile.summary,
          location,
          ...(profile.skills || []),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return searchable.includes(q);
      });
    }
    if (statusFilter) list = list.filter(a => a.status === statusFilter);
    return list;
  }, [applications, appSearch, statusFilter]);

  const applicationStatusCounts = useMemo(() => (
    applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {})
  ), [applications]);

  const requestStatus = (appId, newStatus, curStatus) => {
    if (curStatus === 'accepted') return;
    if (newStatus === 'accepted' || newStatus === 'rejected') {
      setConfirmModal({ isOpen: true, appId, status: newStatus });
    } else {
      execStatus(appId, newStatus);
    }
  };

  const execStatus = async (appId, newStatus) => {
    try {
      await recruiterApi.updateApplicationStatus(appId, { status: newStatus });
      toast.success(`Candidate ${newStatus}`);
      setConfirmModal({ isOpen: false, appId: null, status: null });
      await refreshApps();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (appId) => {
    if (!window.confirm('Delete this application?')) return;
    try {
      await recruiterApi.deleteApplication(appId);
      if (expandedId === appId) setExpandedId(null);
      await refreshApps();
      toast.success('Deleted');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const submitInterview = async () => {
    try {
      await recruiterApi.scheduleInterview(interviewModal.appId, {
        scheduledAt: interviewModal.scheduledAt,
        meetingLink: interviewModal.meetingLink,
        notes: interviewModal.notes,
      });
      toast.success('Interview scheduled!');
      setInterviewModal({ isOpen: false, appId: null, scheduledAt: '', meetingLink: '', notes: '' });
      await refreshApps();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleRate = async (appId, rating) => {
    try { await recruiterApi.rateCandidate(appId, { rating }); await refreshApps(); toast.success('Rating saved'); }
    catch { toast.error('Failed'); }
  };

  const handleSaveNotes = async (appId, note = '') => {
    try { await recruiterApi.addRecruiterNotes(appId, { note }); toast.success('Notes saved'); }
    catch { toast.error('Failed'); }
  };

  const handleCloseJob = async () => {
    if (!window.confirm(`Close "${selectedJob.title}"? It will no longer be visible to candidates.`)) return;
    try {
      setClosingJob(true);
      await recruiterApi.closeJob(selectedJob._id);
      toast.success('Job closed successfully');
      setSelectedJob(prev => ({ ...prev, status: 'closed' }));
      setJobs(prev => prev.map(j => j._id === selectedJob._id ? { ...j, status: 'closed' } : j));
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to close job'); }
    finally { setClosingJob(false); }
  };

  const acceptedCount = applications.filter(a => a.status === 'accepted').length;
  const openings = selectedJob?.numberOfOpenings || 1;
  const targetReached = acceptedCount >= openings && selectedJob?.status === 'active';
  const dashboardStats = useMemo(() => {
    const activeJobs = jobs.filter(job => job.status === 'active').length;
    const openJobs = jobs.filter(job => ['active', 'pending-approval'].includes(job.status)).length;
    const totalApplications = jobs.reduce((sum, job) => sum + (job.applicationCount || 0), 0);

    return {
      totalJobs: jobs.length,
      activeJobs,
      openJobs,
      totalApplications,
    };
  }, [jobs]);

  // ══════════════════════════════════════════════════════════════════════
  // VIEW 1 — Job cards
  // ══════════════════════════════════════════════════════════════════════
  if (view === 'jobs') return (
    <div className="relative">
      <div className="absolute inset-x-0 -top-10 h-40 bg-gradient-to-b from-sky-100/70 via-transparent to-transparent blur-3xl dark:from-sky-900/20 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <section className="relative overflow-hidden rounded-[30px] border border-white/70 bg-white/80 p-6 shadow-[0_24px_90px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="absolute -right-12 top-0 h-40 w-40 rounded-full bg-emerald-200/40 blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 top-0 h-40 w-40 rounded-full bg-sky-200/40 blur-3xl pointer-events-none" />

          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-700">
                <Crown className="h-3.5 w-3.5" />
                Applications Hub
              </div>
              <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Review candidates in a cleaner, calmer workspace.
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                Choose a posting to inspect applicants, schedule interviews, and move talent through the pipeline with less visual noise.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Listings', value: dashboardStats.totalJobs, tone: 'bg-slate-50 text-slate-900' },
                { label: 'Active', value: dashboardStats.activeJobs, tone: 'bg-emerald-50 text-emerald-700' },
                { label: 'Open roles', value: dashboardStats.openJobs, tone: 'bg-sky-50 text-sky-700' },
                { label: 'Apps', value: dashboardStats.totalApplications, tone: 'bg-violet-50 text-violet-700' },
              ].map((stat) => (
                <div key={stat.label} className={`rounded-2xl border border-white/80 px-4 py-3 text-center shadow-sm ${stat.tone}`}>
                  <p className="text-2xl font-bold leading-none">{metricValue(stat.value)}</p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.22em] opacity-70">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mt-6 flex flex-col gap-4">
            <div className="relative w-full max-w-xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={jobSearch}
                onChange={e => setJobSearch(e.target.value)}
                placeholder="Search jobs by title, location, or type..."
                className="w-full rounded-2xl border border-slate-200 bg-white px-11 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary/40 focus:ring-4 focus:ring-primary/10 dark:border-dark-border dark:bg-dark-card dark:text-white dark:focus:ring-primary/20"
              />
            </div>

            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:border-dark-border dark:bg-dark-card">
                  <Filter className="h-3.5 w-3.5" />
                  Filter
                </div>
                {jobFilterCounts.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setJobStatusFilter(option.value)}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                      jobStatusFilter === option.value
                        ? 'border-primary/30 bg-primary text-white shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-dark-border dark:bg-dark-card dark:text-slate-300 dark:hover:bg-dark-hover'
                    }`}
                  >
                    <span>{option.label}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      jobStatusFilter === option.value
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-500 dark:bg-dark-bg dark:text-slate-400'
                    }`}>
                      {option.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left dark:border-dark-border dark:bg-dark-card">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Showing</p>
                <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {filteredJobs.length} of {jobs.length} jobs
                </p>
              </div>
            </div>
          </div>
        </section>

        {loadingJobs ? (
          <div className="flex justify-center py-24">
            <Spinner size="lg" />
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/70 px-6 py-20 text-center shadow-sm dark:border-dark-border dark:bg-dark-card/60">
            <Briefcase className="mx-auto h-14 w-14 text-slate-300 dark:text-slate-700" />
            <h2 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
              {jobSearch || jobStatusFilter !== 'all' ? 'No jobs match these filters.' : 'No jobs posted yet.'}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
              {jobSearch || jobStatusFilter !== 'all'
                ? 'Try a different search term or switch to another status chip to browse the full list.'
                : 'Post your first opening to start collecting applications in one place.'}
            </p>
            {(jobSearch || jobStatusFilter !== 'all') && (
              <button
                onClick={() => { setJobSearch(''); setJobStatusFilter('all'); }}
                className="mt-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredJobs.map(job => <JobCard key={job._id} job={job} onSelect={openJob} />)}
          </div>
        )}
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════
  // VIEW 2 — Applications list
  // ══════════════════════════════════════════════════════════════════════
  return (
    <div className="relative">
      <div className="absolute inset-x-0 -top-10 h-40 bg-gradient-to-b from-emerald-100/60 via-transparent to-transparent blur-3xl dark:from-emerald-900/20 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <button
          onClick={backToJobs}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          All Jobs
        </button>

        <section className="relative overflow-hidden rounded-[30px] border border-white/70 bg-white/85 p-6 shadow-[0_24px_90px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-sky-200/40 blur-3xl pointer-events-none" />
          <div className="absolute left-1/2 top-0 h-40 w-40 rounded-full bg-emerald-200/30 blur-3xl pointer-events-none" />

          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Briefcase className="h-7 w-7" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                      {selectedJob?.title}
                    </h2>
                    {selectedJob?.status && (
                      <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold text-white shadow-sm ${JOB_STATUS[selectedJob.status]?.cls || 'bg-gray-400'}`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                        {JOB_STATUS[selectedJob.status]?.label || selectedJob.status}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {formatLocation(selectedJob?.location)} · {formatEmployment(selectedJob?.employmentType)} · Posted {fmt(selectedJob?.postedAt)}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-dark-border dark:bg-dark-card dark:text-slate-300">
                  {metricValue(applications.length)} total applications
                </span>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
                  {metricValue(acceptedCount)} accepted
                </span>
                <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 dark:border-sky-800 dark:bg-sky-900/20 dark:text-sky-300">
                  {metricValue(openings)} openings
                </span>
                {selectedJob?.location?.city && (
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500 dark:border-dark-border dark:bg-dark-card dark:text-slate-400">
                    {selectedJob.location.city}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:min-w-[330px]">
              {[
                { label: 'Total', value: applications.length, tone: 'bg-slate-50 text-slate-900' },
                { label: 'Accepted', value: acceptedCount, tone: 'bg-emerald-50 text-emerald-700' },
                { label: 'Openings', value: openings, tone: 'bg-sky-50 text-sky-700' },
              ].map((stat) => (
                <div key={stat.label} className={`rounded-2xl border border-white/80 px-4 py-3 text-center shadow-sm ${stat.tone}`}>
                  <p className="text-2xl font-bold leading-none">{metricValue(stat.value)}</p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.22em] opacity-70">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {targetReached && (
            <div className="relative mt-6 flex flex-col gap-3 rounded-[24px] border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-teal-50 px-5 py-4 shadow-sm dark:border-emerald-800 dark:from-emerald-900/25 dark:via-dark-card dark:to-teal-900/20 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300">
                  <CheckCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">Target reached</p>
                  <p className="text-sm text-emerald-700 dark:text-emerald-400">
                    You’ve accepted {acceptedCount} of {openings} position{openings > 1 ? 's' : ''}. Consider closing this listing.
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseJob}
                disabled={closingJob}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {closingJob ? <Spinner size="sm" /> : <XCircle className="h-4 w-4" />}
                Close Job Posting
              </button>
            </div>
          )}
        </section>

        <section className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.06)] backdrop-blur">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-500">Job brief</p>
              <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">Role details</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Keep this collapsed while reviewing candidates, then expand if you need the full specification.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left dark:border-dark-border dark:bg-dark-card">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Screening</p>
                <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {safeCount(selectedJob?.screeningQuestions)} questions
                </p>
              </div>
              <button
                onClick={() => setShowJobDetails((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-dark-border dark:bg-dark-card dark:text-slate-200 dark:hover:bg-dark-hover"
              >
                {showJobDetails ? 'Hide details' : 'View full details'}
                <ChevronDown className={`h-4 w-4 transition-transform ${showJobDetails ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: 'Location',
                value: formatLocation(selectedJob?.location),
                note: selectedJob?.location?.isRemote ? toLabel(selectedJob?.location?.remoteType) : 'On-site or hybrid',
              },
              {
                label: 'Salary',
                value: formatSalary(selectedJob?.salary),
                note: selectedJob?.salary?.isVisible === false ? 'Internal view' : 'Visible range',
              },
              {
                label: 'Experience',
                value: toLabel(selectedJob?.experienceLevel),
                note: selectedJob?.experienceYears ? `${selectedJob.experienceYears.min || 0} to ${selectedJob.experienceYears.max || 'any'} years` : 'No range set',
              },
              {
                label: 'Deadline',
                value: selectedJob?.applicationDeadline ? fmt(selectedJob.applicationDeadline) : 'No deadline',
                note: selectedJob?.postedAt ? `Posted ${fmt(selectedJob.postedAt)}` : 'Posting date unavailable',
              },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-dark-border dark:bg-dark-card">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">{item.label}</p>
                <p className="mt-2 text-sm font-bold leading-tight text-slate-900 dark:text-white">{item.value}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.note}</p>
              </div>
            ))}
          </div>

          {showJobDetails && (
            <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.75fr)]">
              <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-card">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Description</p>
                </div>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700 dark:text-slate-300">
                  {selectedJob?.description || 'No job description provided.'}
                </p>

                {selectedJob?.qualifications?.length > 0 && (
                  <div className="mt-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Qualifications</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedJob.qualifications.map((qual, idx) => (
                        <span
                          key={`${qual}-${idx}`}
                          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-600 dark:border-dark-border dark:bg-dark-bg dark:text-slate-300"
                        >
                          {qual}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedJob?.screeningQuestions?.length > 0 && (
                  <div className="mt-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Screening Questions</p>
                    <div className="mt-3 space-y-3">
                      {selectedJob.screeningQuestions.map((question, idx) => (
                        <div key={`${question.question}-${idx}`} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 dark:border-dark-border dark:bg-dark-bg">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium text-slate-700 dark:text-slate-200">{question.question}</p>
                            {question.isRequired && (
                              <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
                                Required
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                {[
                  {
                    label: 'Education',
                    value: formatDegree(selectedJob?.education?.minDegree),
                    note: selectedJob?.education?.preferredFields?.length ? selectedJob.education.preferredFields.join(', ') : 'No preferred field listed',
                  },
                  {
                    label: 'Openings',
                    value: metricValue(selectedJob?.numberOfOpenings || 1),
                    note: `${metricValue(applications.length)} applicants`,
                  },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-dark-border dark:bg-dark-card">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">{item.label}</p>
                    <p className="mt-2 text-lg font-bold leading-tight text-slate-900 dark:text-white">{item.value}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.06)] backdrop-blur">
          <div className="flex flex-col gap-5">
            <div className="space-y-4">
              <div className="relative">
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Search candidates
                </label>
                <Search className="pointer-events-none absolute left-4 top-[3.1rem] h-4 w-4 text-slate-400" />
                <input
                  value={appSearch}
                  onChange={e => setAppSearch(e.target.value)}
                  placeholder="Search by name, email, headline, skill, or location..."
                  className="w-full rounded-2xl border border-slate-200 bg-white px-11 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary/40 focus:ring-4 focus:ring-primary/10 dark:border-dark-border dark:bg-dark-card dark:text-white dark:focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { label: 'Shown', value: filteredApps.length, tone: 'bg-slate-50 text-slate-900 dark:bg-dark-card dark:text-white' },
                  { label: 'Total', value: applications.length, tone: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' },
                  { label: 'Accepted', value: acceptedCount, tone: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300' },
                ].map((stat) => (
                  <div key={stat.label} className={`rounded-2xl border border-white/80 px-4 py-3 text-center shadow-sm ${stat.tone}`}>
                    <p className="text-xl font-bold leading-none">{metricValue(stat.value)}</p>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.22em] opacity-70">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4 dark:border-dark-border dark:bg-dark-card/70">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:border-dark-border dark:bg-dark-card">
                  <Filter className="h-3.5 w-3.5" />
                  Status filters
                </div>
                {(appSearch || statusFilter) && (
                  <button
                    onClick={() => { setAppSearch(''); setStatusFilter(''); }}
                    className="rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10"
                  >
                    Clear filters
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                {APPLICATION_STATUS_OPTIONS.map((option) => {
                  const optionCount = option.value ? (applicationStatusCounts[option.value] || 0) : applications.length;
                  return (
                    <button
                      key={option.value || 'all'}
                      onClick={() => setStatusFilter(option.value)}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition ${
                        statusFilter === option.value
                          ? 'border-primary/30 bg-primary text-white shadow-sm'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-dark-border dark:bg-dark-card dark:text-slate-300 dark:hover:bg-dark-hover'
                      }`}
                    >
                      <span>{option.label}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        statusFilter === option.value
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-500 dark:bg-dark-bg dark:text-slate-300'
                      }`}>
                        {optionCount}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Showing <span className="font-semibold text-slate-800 dark:text-slate-200">{filteredApps.length}</span> of <span className="font-semibold text-slate-800 dark:text-slate-200">{applications.length}</span> candidates
              </p>
            </div>
          </div>
        </section>

        {loadingApps ? (
          <div className="flex justify-center py-24">
            <Spinner size="lg" />
          </div>
        ) : applications.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/70 px-6 py-20 text-center shadow-sm dark:border-dark-border dark:bg-dark-card/60">
            <FileText className="mx-auto h-14 w-14 text-slate-300 dark:text-slate-700" />
            <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">No applications yet for this job.</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
              Share the job link or promote the listing to start receiving applicants.
            </p>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/70 px-6 py-20 text-center shadow-sm dark:border-dark-border dark:bg-dark-card/60">
            <Search className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700" />
            <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">No candidates match your filters.</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Try clearing the search or switching the status chips to broaden the list.
            </p>
            <button
              onClick={() => { setAppSearch(''); setStatusFilter(''); }}
              className="mt-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredApps.map(app => (
              <AppCard
                key={app._id}
                app={app}
                isExpanded={expandedId === app._id}
                onToggle={() => setExpandedId(expandedId === app._id ? null : app._id)}
                onStatus={requestStatus}
                onDelete={handleDelete}
                onRate={handleRate}
                onSaveNotes={handleSaveNotes}
                localNotes={localNotes}
                setLocalNotes={setLocalNotes}
                onInterview={appId => setInterviewModal({ isOpen: true, appId, scheduledAt: '', meetingLink: '', notes: '' })}
                navigate={navigate}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── confirm modal ── */}
      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, appId: null, status: null })}
        title={confirmModal.status === 'accepted' ? 'Confirm Acceptance' : 'Confirm Rejection'}
      >
        <div className="p-5 space-y-4">
          <div className={`flex gap-3 p-4 rounded-xl border ${confirmModal.status === 'accepted' ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800' : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'}`}>
            <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${confirmModal.status === 'accepted' ? 'text-emerald-600' : 'text-red-500'}`} />
            <div>
              <p className="font-bold text-sm text-gray-900 dark:text-white mb-1">This action is irreversible</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {confirmModal.status === 'accepted'
                  ? 'Once accepted, this decision is permanently locked. The Accept & Reject buttons will be disabled for this candidate forever.'
                  : 'Once rejected, this decision cannot be reversed.'}
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmModal({ isOpen: false, appId: null, status: null })}>Cancel</Button>
            <Button
              className={confirmModal.status === 'accepted' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}
              onClick={() => execStatus(confirmModal.appId, confirmModal.status)}
            >
              {confirmModal.status === 'accepted' ? 'Yes, Accept' : 'Yes, Reject'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── interview modal ── */}
      <Modal
        isOpen={interviewModal.isOpen}
        onClose={() => setInterviewModal({ isOpen: false, appId: null, scheduledAt: '', meetingLink: '', notes: '' })}
        title="Schedule Interview"
      >
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Date & Time <span className="text-red-500">*</span></label>
            <input type="datetime-local" className="w-full p-2.5 border border-gray-200 dark:border-dark-border rounded-xl bg-white dark:bg-dark-bg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/40 focus:outline-none" value={interviewModal.scheduledAt} onChange={e => setInterviewModal({ ...interviewModal, scheduledAt: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Meeting Link <span className="text-red-500">*</span></label>
            <input type="url" placeholder="https://meet.google.com/…" className="w-full p-2.5 border border-gray-200 dark:border-dark-border rounded-xl bg-white dark:bg-dark-bg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/40 focus:outline-none" value={interviewModal.meetingLink} onChange={e => setInterviewModal({ ...interviewModal, meetingLink: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Notes for Candidate</label>
            <textarea rows={3} placeholder="Preparation tips, topics to cover…" className="w-full p-2.5 border border-gray-200 dark:border-dark-border rounded-xl bg-white dark:bg-dark-bg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/40 focus:outline-none resize-none" value={interviewModal.notes} onChange={e => setInterviewModal({ ...interviewModal, notes: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={() => setInterviewModal({ isOpen: false, appId: null, scheduledAt: '', meetingLink: '', notes: '' })}>Cancel</Button>
            <Button variant="primary" onClick={submitInterview} disabled={!interviewModal.scheduledAt || !interviewModal.meetingLink}>Confirm & Email Candidate</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// JobCard
// ─────────────────────────────────────────────────────────────────────────────
function JobCard({ job, onSelect }) {
  const apps = job.applicationCount || 0;
  const openings = job.numberOfOpenings || 1;
  const meta = JOB_STATUS[job.status];
  const postedDate = job.postedAt || job.createdAt;
  const statusStyle = {
    active: {
      ring: 'from-emerald-500/70 via-emerald-400/20 to-transparent',
      icon: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20',
      stat: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300',
    },
    'pending-approval': {
      ring: 'from-amber-500/70 via-amber-400/20 to-transparent',
      icon: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20',
      stat: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300',
    },
    filled: {
      ring: 'from-blue-500/70 via-blue-400/20 to-transparent',
      icon: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20',
      stat: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
    },
    closed: {
      ring: 'from-orange-500/70 via-orange-400/20 to-transparent',
      icon: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20',
      stat: 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300',
    },
    draft: {
      ring: 'from-slate-400/70 via-slate-300/20 to-transparent',
      icon: 'bg-slate-50 text-slate-500 dark:bg-slate-800',
      stat: 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    },
    rejected: {
      ring: 'from-red-500/70 via-red-400/20 to-transparent',
      icon: 'bg-red-50 text-red-600 dark:bg-red-900/20',
      stat: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300',
    },
  }[job.status] || {
    ring: 'from-sky-500/70 via-sky-400/20 to-transparent',
    icon: 'bg-sky-50 text-sky-600 dark:bg-sky-900/20',
    stat: 'bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-300',
  };

  return (
    <button onClick={() => onSelect(job)}
      className="group relative w-full overflow-hidden rounded-[28px] border border-slate-200 bg-white/90 p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_24px_70px_rgba(15,23,42,0.10)] focus:outline-none focus:ring-4 focus:ring-primary/10 dark:border-dark-border dark:bg-dark-card/90"
    >
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${statusStyle.ring} opacity-90`} />
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-sky-50/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-dark-card dark:via-dark-card dark:to-slate-900/30" />

      <div className="relative flex items-start justify-between gap-3">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-colors group-hover:scale-105 ${statusStyle.icon}`}>
          <Briefcase className="h-5 w-5" />
        </div>
        {meta && (
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white shadow-sm ${meta.cls}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
            {meta.label}
          </span>
        )}
      </div>

      <h3 className="relative mt-4 line-clamp-2 text-[16px] font-bold leading-snug text-slate-900 transition-colors group-hover:text-primary dark:text-white">
        {job.title}
      </h3>

      {(job.location?.city || job.location?.isRemote) && (
        <p className="relative mt-2 flex items-center gap-1.5 text-xs text-slate-500">
          <MapPin className="h-3.5 w-3.5" />
          {formatLocation(job.location)}
        </p>
      )}

      {job.description && (
        <p className="relative mt-3 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
          {job.description}
        </p>
      )}

      <div className="relative mt-4 flex flex-wrap gap-2">
        {job.employmentType && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium capitalize text-slate-600 dark:bg-dark-bg dark:text-slate-300">
            {formatEmployment(job.employmentType)}
          </span>
        )}
        {job.experienceLevel && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium capitalize text-slate-600 dark:bg-dark-bg dark:text-slate-300">
            {job.experienceLevel} level
          </span>
        )}
      </div>

      <div className="relative mt-5 grid grid-cols-3 gap-3 rounded-2xl border border-slate-100 bg-white/80 p-3 shadow-sm dark:border-dark-border dark:bg-dark-card/70">
        <div className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold ${apps > 0 ? statusStyle.stat : 'bg-slate-50 text-slate-400 dark:bg-dark-bg'}`}>
          <Users className="h-3.5 w-3.5" />
          {apps} {apps === 1 ? 'applicant' : 'applicants'}
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:bg-dark-bg">
          <Briefcase className="h-3.5 w-3.5" />
          {openings} {openings === 1 ? 'opening' : 'openings'}
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:bg-dark-bg">
          <Calendar className="h-3.5 w-3.5" />
          {postedDate ? fmtLongShort(postedDate) : 'Draft'}
        </div>
      </div>

      <div className="relative mt-4 flex items-center justify-center gap-1.5 rounded-full border border-primary/10 bg-primary/5 px-3 py-2 text-xs font-semibold text-primary opacity-90 transition group-hover:bg-primary/10">
        <Zap className="h-3.5 w-3.5" />
        Open pipeline
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AppCard — expandable application card
// ─────────────────────────────────────────────────────────────────────────────
function AppCard({ app, isExpanded, onToggle, onStatus, onDelete, onRate, onSaveNotes, localNotes, setLocalNotes, onInterview, navigate }) {
  const isAccepted = app.status === 'accepted';
  const profile = app.jobSeekerProfile || {};
  const candidateName = getCandidateName(app);
  const initials = getCandidateInitials(candidateName);
  const candidateLocation = getCandidateLocation(profile);
  const candidateHeadline = profile.headline || app.jobSeekerId?.headline || 'Open to opportunities';
  const candidateSummary = profile.summary || 'No profile summary provided yet.';
  const latestExperience = [...(profile.workExperience || [])].sort((a, b) => new Date(b.startDate || 0) - new Date(a.startDate || 0))[0];
  const latestEducation = [...(profile.education || [])].sort((a, b) => new Date(b.startDate || 0) - new Date(a.startDate || 0))[0];
  const skillCount = safeCount(profile.skills);
  const workExperienceCount = safeCount(profile.workExperience);
  const educationCount = safeCount(profile.education);
  const resumeFile = profile.resume?.fileName || 'Resume not uploaded';
  const socialLinks = profile.socialLinks || {};
  const topSkills = (profile.skills || [])
    .map((skill) => (typeof skill === 'string' ? skill : skill?.name))
    .filter(Boolean)
    .slice(0, 3);

  // status-based left border color
  const borderAccent = {
    accepted: 'border-l-emerald-500',
    rejected: 'border-l-red-400',
    interviewing: 'border-l-indigo-500',
    shortlisted: 'border-l-violet-500',
    reviewed: 'border-l-blue-400',
  }[app.status] || 'border-l-slate-200 dark:border-l-dark-border';

  const latestNote = app.recruiterNotes?.length > 0
    ? [...app.recruiterNotes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0].note
    : '';

  return (
    <div className={`group overflow-hidden rounded-[24px] border border-slate-200 border-l-4 bg-white/90 shadow-sm transition-all duration-300 ${borderAccent} ${isExpanded ? 'shadow-[0_24px_70px_rgba(15,23,42,0.10)]' : 'hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)]'} dark:border-dark-border dark:bg-dark-card/90`}>
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 text-left outline-none transition focus:ring-4 focus:ring-primary/10"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl text-sm font-bold ${isAccepted ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-primary/10 text-primary'}`}>
            {initials}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{candidateName}</p>
              {isAccepted && <Lock className="h-3.5 w-3.5 flex-shrink-0 text-emerald-500" title="Locked - accepted" />}
            </div>
            <p className="mt-0.5 truncate text-sm text-slate-500 dark:text-slate-400">{app.jobSeekerId?.email}</p>
            <p className="mt-1 line-clamp-1 text-sm font-medium text-slate-600 dark:text-slate-300">{candidateHeadline}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatusBadge status={app.status} />
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-500 dark:bg-dark-bg dark:text-slate-300">
                Applied {fmtShort(app.appliedAt || app.createdAt)}
              </span>
              {candidateLocation !== 'Location not specified' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-500 dark:bg-dark-bg dark:text-slate-300">
                  <MapPin className="h-3 w-3" />
                  {candidateLocation}
                </span>
              )}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600 dark:bg-dark-bg dark:text-slate-300">
                {workExperienceCount} roles
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600 dark:bg-dark-bg dark:text-slate-300">
                {skillCount} skills
              </span>
              {topSkills.map((skill, idx) => (
                <span key={`${skill}-${idx}`} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-600 dark:border-dark-border dark:bg-dark-card dark:text-slate-300">
                  {skill}
                </span>
                ))}
              </div>
            </div>

          <div className="flex flex-shrink-0 items-center justify-between gap-3 sm:min-w-[96px] sm:flex-col sm:items-end">
            {app.rating > 0 && (
              <div className="hidden sm:flex gap-0.5">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} className={`h-3.5 w-3.5 ${app.rating >= s ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-700'}`} />)}
              </div>
            )}
            <div className="hidden md:flex flex-col items-end gap-1 text-right">
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Latest</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{fmtShort(app.appliedAt || app.createdAt)}</span>
            </div>
            <div className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-200 ${isExpanded ? 'border-primary bg-primary text-white rotate-180' : 'border-slate-200 text-slate-400 dark:border-dark-border'}`}>
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-slate-100 bg-slate-50/80 dark:border-dark-border dark:bg-dark-bg/60">
          <div className="sm:hidden flex items-center gap-2 px-5 pt-4">
            <StatusBadge status={app.status} />
            <span className="text-xs text-slate-400">{fmtShort(app.appliedAt || app.createdAt)}</span>
          </div>

          <div className="grid grid-cols-1 gap-6 p-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.95fr)] xl:p-6">
            <div className="space-y-5">

              {isAccepted && (
                <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">Candidate accepted</p>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                      This decision is locked. Accept and Reject actions are disabled.
                    </p>
                  </div>
                </div>
              )}

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-dark-border dark:bg-dark-card">
                <p className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  <MessageSquare className="h-3.5 w-3.5" /> Cover Letter
                </p>
                {app.coverLetter ? (
                  <div className="max-h-44 overflow-y-auto whitespace-pre-wrap rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-sm leading-relaxed text-slate-700 dark:border-dark-border dark:bg-dark-bg dark:text-slate-300">
                    {app.coverLetter}
                  </div>
                ) : (
                  <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-3 text-sm italic text-slate-400 dark:border-dark-border dark:bg-dark-bg">
                    No cover letter provided.
                  </p>
                )}
              </div>

              {app.screeningAnswers?.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-dark-border dark:bg-dark-card">
                  <p className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    <Award className="h-3.5 w-3.5" /> Screening Answers
                  </p>
                  <div className="space-y-2.5">
                    {app.screeningAnswers.map((sa, i) => (
                      <div key={i} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5 dark:border-dark-border dark:bg-dark-bg">
                        <p className="mb-1.5 text-xs font-semibold text-slate-500">Q: {sa.question}</p>
                        <p className="border-l-2 border-primary/30 pl-3 text-sm text-slate-700 dark:text-slate-300">{sa.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!isAccepted && app.interviewDetails?.scheduledAt && (
                <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4 shadow-sm dark:border-indigo-800 dark:bg-indigo-900/20">
                  <p className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-400">
                    <Video className="h-3.5 w-3.5" /> Interview Scheduled
                  </p>
                  <div className="space-y-2 rounded-2xl border border-indigo-100 bg-white/80 p-4 dark:border-indigo-800 dark:bg-dark-card">
                    <p className="text-sm font-semibold text-indigo-800 dark:text-indigo-300">{fmtTime(app.interviewDetails.scheduledAt)}</p>
                    {app.interviewDetails.meetingLink && (
                      <a href={app.interviewDetails.meetingLink} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:underline hover:text-indigo-700">
                        <ExternalLink className="h-3 w-3" /> Join Meeting
                      </a>
                    )}
                    {app.interviewDetails.notes && (
                      <p className="border-t border-indigo-100 pt-2 text-xs italic text-slate-500 dark:border-indigo-800">{app.interviewDetails.notes}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-5 xl:sticky xl:top-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-card">
                <div className="flex items-start gap-4">
                  {profile.profilePicture ? (
                    <img
                      src={profile.profilePicture}
                      alt={candidateName}
                      className="h-14 w-14 flex-shrink-0 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-dark-border"
                    />
                  ) : (
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-base font-bold text-primary">
                      {initials}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-base font-bold text-slate-900 dark:text-white">{candidateName}</p>
                      {isAccepted && <Lock className="h-3.5 w-3.5 text-emerald-500" title="Locked - accepted" />}
                    </div>
                    <p className="mt-1 text-sm font-medium text-primary">{candidateHeadline}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-dark-bg">{app.jobSeekerId?.email}</span>
                      {profile.phone && <span className="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-dark-bg">{profile.phone}</span>}
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-dark-bg">{candidateLocation}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  {[
                    { label: 'Experience', value: `${workExperienceCount} roles`, tone: 'bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-300' },
                    { label: 'Education', value: `${educationCount} entries`, tone: 'bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-300' },
                    { label: 'Skills', value: `${skillCount} listed`, tone: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300' },
                    { label: 'Resume', value: profile.resume?.fileName ? 'Uploaded' : 'Missing', tone: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300' },
                  ].map((item) => (
                    <div key={item.label} className={`rounded-2xl border border-white/80 p-3 shadow-sm ${item.tone}`}>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] opacity-70">{item.label}</p>
                      <p className="mt-1 text-sm font-bold">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 dark:border-dark-border dark:bg-dark-bg">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Summary</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">{candidateSummary}</p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-slate-100 bg-white p-4 dark:border-dark-border dark:bg-dark-bg">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Resume</p>
                    <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">{resumeFile}</p>
                    {profile.resume?.uploadedAt && (
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Uploaded {fmt(profile.resume.uploadedAt)}</p>
                    )}
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-white p-4 dark:border-dark-border dark:bg-dark-bg">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Contact</p>
                    <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">{app.jobSeekerId?.email || 'Email not available'}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{profile.phone || 'Phone not available'}</p>
                  </div>
                </div>

                {latestExperience && (
                  <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-4 dark:border-dark-border dark:bg-dark-bg">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Latest Experience</p>
                    <div className="mt-2">
                      <p className="font-semibold text-slate-900 dark:text-white">{latestExperience.title} · {latestExperience.company}</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {fmtMonthYear(latestExperience.startDate)} - {latestExperience.isCurrentRole ? 'Present' : fmtMonthYear(latestExperience.endDate)}
                      </p>
                      {latestExperience.description && (
                        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{latestExperience.description}</p>
                      )}
                    </div>
                  </div>
                )}

                {latestEducation && (
                  <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-4 dark:border-dark-border dark:bg-dark-bg">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Latest Education</p>
                    <div className="mt-2">
                      <p className="font-semibold text-slate-900 dark:text-white">{latestEducation.degree} · {latestEducation.institution}</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {fmtMonthYear(latestEducation.startDate)} - {latestEducation.endDate ? fmtMonthYear(latestEducation.endDate) : 'Present'}
                      </p>
                    </div>
                  </div>
                )}

                {(socialLinks.linkedin || socialLinks.github || socialLinks.portfolio) && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {socialLinks.linkedin && (
                      <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-primary/30 hover:text-primary dark:border-dark-border dark:bg-dark-bg">
                        LinkedIn
                      </a>
                    )}
                    {socialLinks.github && (
                      <a href={socialLinks.github} target="_blank" rel="noreferrer" className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-primary/30 hover:text-primary dark:border-dark-border dark:bg-dark-bg">
                        GitHub
                      </a>
                    )}
                    {socialLinks.portfolio && (
                      <a href={socialLinks.portfolio} target="_blank" rel="noreferrer" className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-primary/30 hover:text-primary dark:border-dark-border dark:bg-dark-bg">
                        Portfolio
                      </a>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-dark-border dark:bg-dark-card">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Pipeline Actions</p>

                <button onClick={() => { const id = app.jobSeekerId?._id || app.jobSeekerId; if (id) navigate(`/recruiter/candidates/${id}`); }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-dark-border dark:text-slate-300 dark:hover:bg-dark-hover">
                  <ExternalLink className="h-4 w-4" /> View Profile
                </button>

                {!['accepted', 'rejected', 'withdrawn', 'interviewing'].includes(app.status) && (
                  <button onClick={() => onInterview(app._id)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-300 py-2.5 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50 dark:border-indigo-700 dark:text-indigo-400 dark:hover:bg-indigo-900/20">
                    <Calendar className="h-4 w-4" /> Schedule Interview
                  </button>
                )}

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button disabled={isAccepted} onClick={() => onStatus(app._id, 'rejected', app.status)}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-sm font-semibold transition-all ${isAccepted ? 'cursor-not-allowed border-slate-200 text-slate-300 opacity-30' : 'border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'}`}>
                    <XCircle className="h-3.5 w-3.5" /> Reject
                  </button>
                  <button disabled={isAccepted} onClick={() => onStatus(app._id, 'accepted', app.status)}
                    className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold transition-all ${isAccepted ? 'cursor-not-allowed bg-emerald-100 text-emerald-500 opacity-70 dark:bg-emerald-900/30' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}>
                    <CheckCircle className="h-3.5 w-3.5" /> {isAccepted ? 'Accepted ✓' : 'Accept'}
                  </button>
                </div>

                {app.status === 'rejected' && (
                  <button onClick={() => onDelete(app._id)}
                    className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-red-200 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-900/10">
                    <Trash2 className="h-3.5 w-3.5" /> Delete Application
                  </button>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-dark-border dark:bg-dark-card">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Rate Candidate</p>
                <StarRow value={app.rating} onChange={r => onRate(app._id, r)} />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-dark-border dark:bg-dark-card">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Internal Notes</p>
                <textarea rows={4} placeholder="Private notes for your team…"
                  className="w-full resize-none rounded-2xl border border-slate-200 p-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-primary/40 focus:ring-4 focus:ring-primary/10 dark:border-dark-border dark:bg-dark-bg dark:text-slate-200 dark:focus:ring-primary/20"
                  value={localNotes[app._id] ?? latestNote}
                  onChange={e => setLocalNotes(prev => ({ ...prev, [app._id]: e.target.value }))}
                />
                <button onClick={() => onSaveNotes(app._id, localNotes[app._id] ?? latestNote)}
                  className="mt-3 w-full rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
                  Save Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
