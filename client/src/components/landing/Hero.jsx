import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Briefcase, TrendingUp } from 'lucide-react';
import Button from '@components/common/Button';

const Hero = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    keyword: '',
    location: '',
  });
  
  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?keyword=${searchData.keyword}&location=${searchData.location}`);
  };
  
  const popularSearches = [
    'Frontend Developer',
    'Product Manager',
    'Data Scientist',
    'UX Designer',
  ];
  
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-dark-bg dark:via-dark-bg-secondary dark:to-dark-bg">
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
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-primary-100/20 to-accent-100/20 dark:from-primary-900/10 dark:to-accent-900/10 rounded-full blur-3xl"
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
          className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-accent-100/20 to-primary-100/20 dark:from-accent-900/10 dark:to-primary-900/10 rounded-full blur-3xl"
        />
      </div>
      
      <div className="container-custom relative z-10 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white dark:bg-dark-bg-secondary shadow-soft mb-8"
          >
            <TrendingUp className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-medium text-light-text dark:text-dark-text">
              10,000+ Jobs Posted This Month
            </span>
          </motion.div>
          
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance"
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
            className="text-xl text-light-text-secondary dark:text-dark-text-secondary mb-12 max-w-2xl mx-auto"
          >
            Connect with top employers and discover opportunities that match your skills and aspirations. Start your journey now.
          </motion.p>
          
          {/* Search Bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={handleSearch}
            className="relative max-w-4xl mx-auto mb-6"
          >
            <div className="flex flex-col md:flex-row gap-3 p-3 rounded-2xl bg-white dark:bg-dark-bg-secondary shadow-xl border border-gray-100 dark:border-dark-border">
              {/* Job Title Input */}
              <div className="flex-1 flex items-center space-x-3 px-5 py-3 rounded-xl bg-gray-50 dark:bg-dark-bg hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary transition-colors group">
                <Search className="w-5 h-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  value={searchData.keyword}
                  onChange={(e) => setSearchData({ ...searchData, keyword: e.target.value })}
                  className="flex-1 bg-transparent border-none focus:outline-none text-light-text dark:text-dark-text placeholder-gray-400 text-base"
                />
              </div>
              
              {/* Location Input */}
              <div className="flex-1 flex items-center space-x-3 px-5 py-3 rounded-xl bg-gray-50 dark:bg-dark-bg hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary transition-colors group">
                <MapPin className="w-5 h-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
                <input
                  type="text"
                  placeholder="City, state, or remote"
                  value={searchData.location}
                  onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
                  className="flex-1 bg-transparent border-none focus:outline-none text-light-text dark:text-dark-text placeholder-gray-400 text-base"
                />
              </div>
              
              {/* Search Button */}
              <Button 
                type="submit" 
                size="lg" 
                className="md:w-auto w-full px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Search className="w-5 h-5 mr-2" />
                Search Jobs
              </Button>
            </div>
            
            {/* Decorative gradient border effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity -z-10" />
          </motion.form>
          
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
                className="px-4 py-1.5 rounded-full bg-white dark:bg-dark-bg-secondary text-sm font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-colors border border-gray-100 dark:border-gray-800"
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
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
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
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-dark-bg to-transparent" />
    </section>
  );
};

export default Hero;
