import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Briefcase, ArrowRight, Users, TrendingUp } from 'lucide-react';
import { publicApi } from '@api/publicApi';
import JobSearchBar from '@components/common/JobSearchBar';

/* ── Typewriter hook ── */
const useTypewriter = (words, { typingSpeed = 80, deletingSpeed = 50, pauseMs = 1800 } = {}) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const current = words[wordIndex % words.length];

    const tick = () => {
      if (!isDeleting) {
        setText(current.slice(0, text.length + 1));
        if (text.length + 1 === current.length) {
          timeoutRef.current = setTimeout(() => setIsDeleting(true), pauseMs);
          return;
        }
        timeoutRef.current = setTimeout(tick, typingSpeed);
      } else {
        setText(current.slice(0, text.length - 1));
        if (text.length - 1 === 0) {
          setIsDeleting(false);
          setWordIndex((w) => (w + 1) % words.length);
          return;
        }
        timeoutRef.current = setTimeout(tick, deletingSpeed);
      }
    };

    timeoutRef.current = setTimeout(tick, isDeleting ? deletingSpeed : typingSpeed);
    return () => clearTimeout(timeoutRef.current);
  }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseMs]);

  return text;
};

const Hero = () => {
  const navigate = useNavigate();
  const [jobCount, setJobCount] = useState(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const typewords = ['the Right Talent', 'your Dream Job', 'Top Candidates', 'your Next Opportunity'];
  const typed = useTypewriter(typewords, { typingSpeed: 70, deletingSpeed: 40, pauseMs: 1800 });

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await publicApi.getAllJobs({ limit: 1 });
        if (res.success && res.data?.pagination?.total) {
          setJobCount(res.data.pagination.total);
        }
      } catch {}
    };
    fetchCount();
  }, []);

  const popularSearches = [
    'Frontend Developer', 'Product Manager', 'Data Scientist', 'UX Designer', 'DevOps',
  ];

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section
      className="relative overflow-hidden"
      style={{ borderBottom: '1px solid var(--color-border)' }}
      ref={ref}
    >
      {/* ── Animated background blobs ── */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(0,201,177,0.05) 0%, transparent 50%, rgba(170,255,199,0.06) 100%)',
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.12, 1], x: [0, 18, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-25"
          style={{ background: 'radial-gradient(circle, rgba(0,201,177,0.4) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], x: [0, -16, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-48 -left-32 w-[420px] h-[420px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, rgba(170,255,199,0.5) 0%, transparent 70%)' }}
        />
        {/* Subtle grid */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.022] dark:opacity-[0.04]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="hero-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      <div className="container-custom pt-14 pb-16 md:pt-18 md:pb-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="max-w-[820px] mx-auto text-center relative z-10"
        >

          {/* ── Live jobs pill ── */}
          <motion.div variants={itemVariants} className="flex justify-center mb-6">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-[var(--radius-full)] border text-sm font-medium"
              style={{
                background: 'rgba(0,201,177,0.08)',
                borderColor: 'rgba(0,201,177,0.30)',
                color: 'var(--color-deep)',
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-teal)] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-teal)]" />
              </span>
              <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
              {jobCount !== null
                ? `${jobCount.toLocaleString()}+ live jobs available`
                : 'Thousands of live jobs available'}
            </div>
          </motion.div>

          {/* ── Headline with typewriter ── */}
          <motion.h1
            variants={itemVariants}
            className="text-[44px] md:text-[58px] lg:text-[68px] font-bold text-balance mb-5"
            style={{
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.03em',
              lineHeight: 1.09,
            }}
          >
            <span className="text-[var(--color-text-primary)] dark:text-[var(--dm-text-primary)]">
              Find{' '}
            </span>
            {/* Typewriter part */}
            <span
              className="inline-block min-w-[2px]"
              style={{
                background: 'linear-gradient(135deg, var(--color-teal) 0%, #2DD4BF 50%, var(--color-mint) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
              aria-label={typed}
            >
              {typed}
              {/* Blinking cursor */}
              <span
                className="inline-block w-[3px] ml-[2px] rounded-full"
                style={{
                  height: '0.85em',
                  background: 'var(--color-teal)',
                  verticalAlign: 'middle',
                  animation: 'blink-cursor 1.1s step-end infinite',
                }}
                aria-hidden="true"
              />
            </span>
          </motion.h1>

          {/* ── Subheadline ── */}
          <motion.p
            variants={itemVariants}
            className="mx-auto max-w-lg text-lg text-[var(--color-text-secondary)] dark:text-[var(--dm-text-secondary)] mb-8 text-balance"
            style={{ fontFamily: 'var(--font-body)', lineHeight: 1.65 }}
          >
            SmartHire connects ambitious talent with world-class companies. Smart matching, verified employers, and faster applications — all in one platform.
          </motion.p>

          {/* ── Search Bar ── */}
          <motion.div variants={itemVariants} className="mb-5">
            <JobSearchBar
              className="max-w-3xl mx-auto"
              variant="hero"
            />
          </motion.div>

          {/* ── Popular searches ── */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-2 mb-8"
          >
            <span className="text-sm text-[var(--color-text-muted)] dark:text-[var(--dm-text-muted)]">
              Trending:
            </span>
            {popularSearches.map((s) => (
              <button
                key={s}
                onClick={() => navigate(`/jobs?keyword=${encodeURIComponent(s)}`)}
                className="chip"
              >
                {s}
              </button>
            ))}
          </motion.div>

          {/* ── CTAs ── */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <button
              onClick={() => navigate('/register?role=jobseeker')}
              className="btn btn-primary btn-lg w-full sm:w-auto"
            >
              <Briefcase className="w-5 h-5" aria-hidden="true" />
              Find a Job
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              onClick={() => navigate('/register?role=recruiter')}
              className="btn btn-secondary btn-lg w-full sm:w-auto"
            >
              <Users className="w-5 h-5" aria-hidden="true" />
              Hire Talent
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
        style={{ background: 'linear-gradient(to top, var(--color-bg-base), transparent)' }}
      />

      {/* Blink keyframe */}
      <style>{`
        @keyframes blink-cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
};

export default Hero;
