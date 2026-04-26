import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { Users, Briefcase, Building2, TrendingUp } from 'lucide-react';
import { publicApi } from '@api/publicApi';

/* ── Animated counter ── */
const Counter = ({ to, suffix = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 60, damping: 18 });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (inView) motionVal.set(to);
  }, [inView, to, motionVal]);

  useEffect(() => {
    const unsub = spring.on('change', (v) =>
      setDisplay(v >= 1000 ? `${(v / 1000).toFixed(1)}K` : Math.round(v).toString())
    );
    return unsub;
  }, [spring]);

  return <span ref={ref}>{display}{suffix}</span>;
};

const Statistics = () => {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });
  const [jobCount, setJobCount] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await publicApi.getAllJobs({ limit: 1 });
        if (res.success && res.data?.pagination?.total) {
          setJobCount(res.data.pagination.total);
        }
      } catch {}
    };
    fetchStats();
  }, []);

  const stats = [
    {
      icon: Users,
      value: 50000,
      suffix: '+',
      label: 'Active Job Seekers',
      accent: 'var(--color-teal)',
      bg: 'rgba(0,201,177,0.10)',
    },
    {
      icon: Building2,
      value: 5000,
      suffix: '+',
      label: 'Companies Hiring',
      accent: '#3B82F6',
      bg: 'rgba(59,130,246,0.10)',
    },
    {
      icon: Briefcase,
      value: jobCount ?? 800,
      suffix: '+',
      label: 'Active Job Listings',
      accent: '#7C3AED',
      bg: 'rgba(124,58,237,0.10)',
    },
    {
      icon: TrendingUp,
      value: 95,
      suffix: '%',
      label: 'Placement Rate',
      accent: '#F59E0B',
      bg: 'rgba(245,158,11,0.10)',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-16 border-b"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="container-custom">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="card p-6 flex flex-col items-center text-center gap-4"
              >
                <div
                  className="w-12 h-12 rounded-[var(--radius-lg)] flex items-center justify-center"
                  style={{ background: stat.bg }}
                >
                  <Icon className="w-6 h-6" style={{ color: stat.accent }} aria-hidden="true" />
                </div>
                <div>
                  <p
                    className="text-4xl font-bold mb-1"
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    {inView ? (
                      <Counter to={stat.value} suffix={stat.suffix} />
                    ) : (
                      <span>0{stat.suffix}</span>
                    )}
                  </p>
                  <p
                    className="text-sm text-[var(--color-text-secondary)] dark:text-[var(--dm-text-secondary)]"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {stat.label}
                  </p>
                </div>
                {/* Accent bar */}
                <div
                  className="w-10 h-1 rounded-full"
                  style={{ background: stat.accent }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
