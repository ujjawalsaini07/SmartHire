import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';
import Button from '@components/common/Button';

const JobSearchBar = ({ className = '', variant = 'default' }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [searchData, setSearchData] = useState({
    keyword: searchParams.get('keyword') || '',
    location: searchParams.get('location') || '',
  });

  // Sync with URL params
  useEffect(() => {
    setSearchData({
      keyword: searchParams.get('keyword') || '',
      location: searchParams.get('location') || '',
    });
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?keyword=${searchData.keyword}&location=${searchData.location}`);
  };

  // Variant styles
  const variants = {
    default: {
      container: 'shadow-large border border-light-border bg-white/90 backdrop-blur-xl dark:border-dark-border dark:bg-dark-bg-secondary/85',
      input: 'bg-light-bg-tertiary dark:bg-dark-bg hover:bg-white dark:hover:bg-dark-bg-tertiary',
    },
    compact: {
      container: 'shadow-soft border border-light-border bg-white/92 dark:border-dark-border dark:bg-dark-bg-secondary/90',
      input: 'bg-white dark:bg-dark-bg-tertiary',
    },
    minimal: {
      container: 'shadow-soft border border-light-border dark:border-dark-border',
      input: 'bg-transparent',
    },
  };

  const currentVariant = variants[variant] || variants.default;

  return (
    <form
      onSubmit={handleSearch}
      className={`relative group ${className}`}
    >
      <div className={`flex flex-col gap-3 rounded-3xl p-3 md:flex-row ${currentVariant.container}`}>
        {/* Job Title Input */}
        <div className={`group flex flex-1 items-center space-x-3 rounded-2xl px-5 py-3 transition-colors ${currentVariant.input}`}>
          <Search className="w-5 h-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
          <input
            type="text"
            placeholder="Job title, keywords, or company"
            value={searchData.keyword}
            onChange={(e) => setSearchData({ ...searchData, keyword: e.target.value })}
            className="flex-1 bg-transparent border-none outline-none ring-0 focus:ring-0 focus:outline-none focus:border-none focus-visible:ring-0 text-light-text dark:text-dark-text placeholder-gray-400 text-base"
            style={{ boxShadow: 'none' }}
          />
        </div>

        {/* Location Input */}
        <div className={`group flex flex-1 items-center space-x-3 rounded-2xl px-5 py-3 transition-colors ${currentVariant.input}`}>
          <MapPin className="w-5 h-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
          <input
            type="text"
            placeholder="City, state, or remote"
            value={searchData.location}
            onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
            className="flex-1 bg-transparent border-none outline-none ring-0 focus:ring-0 focus:outline-none focus:border-none focus-visible:ring-0 text-light-text dark:text-dark-text placeholder-gray-400 text-base"
            style={{ boxShadow: 'none' }}
          />
        </div>

        {/* Search Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full px-8 py-3 md:w-auto"
        >
          <Search className="w-5 h-5 mr-2" />
          Search Jobs
        </Button>
      </div>

      {/* Decorative gradient border effect */}
      <div className="absolute -inset-1 -z-10 rounded-3xl bg-gradient-to-r from-primary-400/20 via-success-400/20 to-accent-500/20 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />
    </form>
  );
};

export default JobSearchBar;
