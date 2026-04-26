import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { publicApi } from '@api/publicApi';
import { motion, useInView } from 'framer-motion';
import { MapPin, Clock, DollarSign, ArrowRight, Briefcase, Bookmark, Flame } from 'lucide-react';

/* ── Skeleton ── */
const JobCardSkeleton = () => (
  <div className="card p-5 space-y-4">
    <div className="flex items-center gap-3">
      <div className="skeleton w-12 h-12 rounded-[var(--radius-lg)]" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-48" />
        <div className="skeleton h-3 w-32" />
      </div>
    </div>
    <div className="skeleton h-3 w-3/4" />
    <div className="flex gap-2">
      <div className="skeleton h-7 w-20 rounded-full" />
      <div className="skeleton h-7 w-20 rounded-full" />
    </div>
    <div className="skeleton h-9 rounded-[var(--radius-lg)]" />
  </div>
);

/* ── Job Card ── */
const JobCard = ({ job, index, inView }) => {
  const navigate = useNavigate();
  const companyName = job.companyId?.companyName || job.company?.name || 'Confidential';
  const location = job.location?.isRemote ? 'Remote' : (job.location?.city || 'Remote');
  const salary = job.salary?.min
    ? `$${(job.salary.min / 1000).toFixed(0)}k – $${(job.salary.max / 1000).toFixed(0)}k`
    : 'Competitive';
  const daysAgo = job.createdAt
    ? Math.max(0, Math.round((Date.now() - new Date(job.createdAt)) / 86400000))
    : 0;
  const isNew = daysAgo <= 3;
  const initial = companyName.charAt(0).toUpperCase();

  const typeColor = {
    'full-time': 'badge-teal',
    'part-time': 'badge-navy',
    'contract':  'badge-warning',
    'internship':'badge-gray',
    'remote':    'badge-success',
  }[job.employmentType?.toLowerCase()] || 'badge-gray';

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.52, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="card card-hover p-5 cursor-pointer group"
      onClick={() => navigate(`/jobs/${job._id}`)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {job.companyId?.companyLogo ? (
            <img
              src={job.companyId.companyLogo}
              alt={companyName}
              className="w-12 h-12 rounded-[var(--radius-lg)] object-cover border border-[var(--color-border)] dark:border-[var(--dm-border)]"
            />
          ) : (
            <div
              className="w-12 h-12 rounded-[var(--radius-lg)] flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, var(--color-teal), var(--color-deep))' }}
            >
              {initial}
            </div>
          )}
          <div>
            <h3
              className="font-semibold text-[15px] text-[var(--color-text-primary)] dark:text-[var(--dm-text-primary)] group-hover:text-[var(--color-teal)] dark:group-hover:text-[var(--dm-accent-teal)] transition-colors line-clamp-1"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {job.title}
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] dark:text-[var(--dm-text-secondary)]">
              {companyName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {isNew && (
            <span className="badge badge-teal">
              <Flame className="w-3 h-3" aria-hidden="true" />
              New
            </span>
          )}
          <button
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-[var(--radius-md)] text-[var(--color-text-muted)] dark:text-[var(--dm-text-muted)] hover:text-[var(--color-teal)] dark:hover:text-[var(--dm-accent-teal)] hover:bg-[var(--color-bg-subtle)] dark:hover:bg-[var(--dm-bg-elevated)] transition-colors"
            aria-label="Save job"
          >
            <Bookmark className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap gap-3 mb-4 text-xs text-[var(--color-text-muted)] dark:text-[var(--dm-text-muted)]">
        <span className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
          {location}
        </span>
        <span className="flex items-center gap-1">
          <DollarSign className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
          {salary}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
          {daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-5">
        <span className={`badge ${typeColor} capitalize`}>
          {job.employmentType || 'Full-time'}
        </span>
        {job.category?.name && (
          <span className="badge badge-gray">{job.category.name}</span>
        )}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/jobs/${job._id}`);
        }}
        className="btn btn-primary btn-sm w-full"
      >
        View & Apply
        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
      </button>
    </motion.article>
  );
};

const FeaturedJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        const res = await publicApi.getAllJobs({ limit: 6, isFeatured: true });
        if (res.success && res.data?.length > 0) {
          setJobs(res.data);
        } else {
          const latest = await publicApi.getAllJobs({ limit: 6, sortBy: 'newest' });
          if (latest.success) setJobs(latest.data || []);
        }
      } catch {}
      finally { setLoading(false); }
    };
    fetchFeaturedJobs();
  }, []);

  return (
    <section ref={ref} className="py-24">
      <div className="container-custom">

        {/* Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="max-w-xl">
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              className="section-label"
            >
              <Briefcase className="w-3.5 h-3.5" aria-hidden="true" />
              Featured Listings
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.06 }}
              className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] dark:text-[var(--dm-text-primary)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Jobs picked for{' '}
              <span className="gradient-text">you</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            <Link to="/jobs" className="btn btn-secondary btn-sm">
              Browse all jobs
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)
            : jobs.map((job, i) => (
                <JobCard key={job._id} job={job} index={i} inView={inView} />
              ))
          }
        </div>

        {/* Mobile CTA */}
        {!loading && (
          <div className="mt-10 text-center">
            <Link to="/jobs" className="btn btn-outline btn-md inline-flex">
              See all open positions
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedJobs;
