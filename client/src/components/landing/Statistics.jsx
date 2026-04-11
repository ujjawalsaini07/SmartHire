import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, Building2, TrendingUp } from 'lucide-react';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { publicApi } from '@api/publicApi';

const Statistics = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [jobCount, setJobCount] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await publicApi.getAllJobs({ limit: 1 });
        if (res.success && res.data?.pagination?.total) {
          setJobCount(res.data.pagination.total);
        }
      } catch (err) {
        console.error('Failed to fetch job count:', err);
      }
    };
    fetchStats();
  }, []);

  const formatCount = (count) => {
    if (count === null) return '...';
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K+`;
    return `${count}+`;
  };
  
  const stats = [
    {
      icon: Users,
      value: '50K+',
      label: 'Active Job Seekers',
      color: 'from-primary-500 to-primary-600',
    },
    {
      icon: Building2,
      value: '5K+',
      label: 'Companies Hiring',
      color: 'from-accent-500 to-accent-600',
    },
    {
      icon: Briefcase,
      value: jobCount !== null ? formatCount(jobCount) : '...',
      label: 'Active Job Listings',
      color: 'from-success-500 to-success-600',
    },
    {
      icon: TrendingUp,
      value: '95%',
      label: 'Success Rate',
      color: 'from-warning-500 to-warning-600',
    },
  ];
  
  return (
    <section ref={ref} className="py-16">
      <div className="container-custom">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card text-center p-6"
              >
                <div className={`mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.color} shadow-soft`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-4xl font-bold text-light-text dark:text-dark-text mb-2">
                  {stat.value}
                </h3>
                <p className="text-light-text-secondary dark:text-dark-text-secondary">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
