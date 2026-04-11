import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, TrendingUp } from 'lucide-react';
import Button from '@components/common/Button';
import JobSearchBar from '@components/common/JobSearchBar';
import { publicApi } from '@api/publicApi';

const Hero = () => {
  const navigate = useNavigate();
  const [jobCount, setJobCount] = useState(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await publicApi.getAllJobs({ limit: 1 });
        if (res.success && res.data?.pagination?.total) {
          setJobCount(res.data.pagination.total);
        }
      } catch (err) {
        // Silently fall back
      }
    };
    fetchCount();
  }, []);
  
  const popularSearches = [
    'Frontend Developer',
    'Product Manager',
    'Data Scientist',
    'UX Designer',
  ];
  
  return (
    <section className="relative overflow-hidden border-b border-light-border/70 bg-gradient-to-br from-primary-100/55 via-white to-warning-100/50 dark:border-dark-border/70 dark:from-primary-900/15 dark:via-dark-bg-secondary dark:to-success-900/10">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -right-1/2 -top-1/2 h-full w-full rounded-full bg-gradient-to-br from-primary-300/35 to-success-200/25 blur-3xl dark:from-primary-700/20 dark:to-success-600/10"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-1/2 -left-1/2 h-full w-full rounded-full bg-gradient-to-tr from-accent-200/28 to-primary-200/26 blur-3xl dark:from-accent-700/18 dark:to-primary-700/15"
        />
      </div>
      
      <div className="container-custom relative z-10 py-20 md:py-28">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 inline-flex items-center space-x-2 rounded-full border border-light-border bg-white/95 px-4 py-2 shadow-soft backdrop-blur-md dark:border-dark-border dark:bg-dark-bg-secondary/90"
          >
            <TrendingUp className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-medium text-light-text dark:text-dark-text">
              {jobCount !== null ? `${jobCount.toLocaleString()}+ Jobs Available` : 'Thousands of Jobs Available'}
            </span>
          </motion.div>
          
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 text-balance text-5xl font-bold leading-tight md:text-6xl lg:text-7xl"
          >
            Find Your{' '}
            <span className="gradient-text">Dream Career</span>
            <br />
            Today
          </motion.h1>
          
          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mb-12 max-w-2xl text-lg text-light-text-secondary dark:text-dark-text-secondary md:text-xl"
          >
            Connect with top employers and discover opportunities that match your skills and aspirations. Start your journey now.
          </motion.p>
          
          {/* Search Bar - Using Extracted Component */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <JobSearchBar className="max-w-4xl mx-auto mb-6" variant="default" />
          </motion.div>
          
          {/* Popular Searches */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-2"
          >
            <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              Popular:
            </span>
            {popularSearches.map((search) => (
              <button
                key={search}
                onClick={() => navigate(`/jobs?keyword=${search}`)}
                className="rounded-full border border-light-border bg-white px-4 py-1.5 text-sm font-semibold text-light-text-secondary transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 dark:border-dark-border dark:bg-dark-bg-secondary dark:text-dark-text-secondary dark:hover:border-primary-500 dark:hover:bg-primary-900/20 dark:hover:text-primary-300"
              >
                {search}
              </button>
            ))}
          </motion.div>
          
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button size="lg" onClick={() => navigate('/register?role=jobseeker')}>
              <Briefcase className="w-5 h-5 mr-2" />
              I'm Looking for a Job
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/register?role=recruiter')}>
              I'm Hiring
            </Button>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-light-bg dark:from-dark-bg to-transparent" />
    </section>
  );
};

export default Hero;
