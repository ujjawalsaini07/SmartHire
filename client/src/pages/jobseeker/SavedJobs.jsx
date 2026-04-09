import { useState, useEffect } from 'react';
import { Bookmark, SearchX } from 'lucide-react';
import { jobSeekerApi } from '@api/jobSeekerApi';
import JobCard from '@components/jobs/JobCard';
import Spinner from '@components/common/Spinner';
import { toast } from 'react-hot-toast';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await jobSeekerApi.getSavedJobs();
      
      // Handle the nested structure often returned by this endpoint
      const jobsArray = Array.isArray(res.data) ? res.data : (res.savedJobs || []);
      setSavedJobs(jobsArray);
    } catch (err) {
      console.error('Failed to fetch saved jobs:', err);
      setError('Failed to load saved jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (jobId) => {
    try {
      await jobSeekerApi.unsaveJob(jobId);
      setSavedJobs(savedJobs.filter(item => item.jobId?._id !== jobId));
      toast.success('Job removed from saved list');
    } catch (err) {
      toast.error('Failed to unsave job');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <Bookmark className="w-8 h-8 mr-3 text-primary" />
          Saved Jobs
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Jobs you have bookmarked for later. 
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <SearchX className="w-5 h-5 text-red-500" />
            <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
          </div>
          <button onClick={fetchSavedJobs} className="px-4 py-2 text-sm font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 transition-colors">
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border p-12 text-center">
          <div className="w-20 h-20 bg-gray-50 dark:bg-dark-bg rounded-full flex items-center justify-center mx-auto mb-4">
            <SearchX className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No saved jobs</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            You haven't saved any jobs yet. When browsing jobs, click the bookmark icon to save them here.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {savedJobs.map((item) => (
            <div key={item._id} className="h-full flex flex-col">
              {item.jobId ? (
                <JobCard job={item.jobId} isSavedView={true} onUnsave={handleUnsave} />
              ) : (
                <div className="p-4 bg-red-50 text-red-500 rounded-lg border border-red-200">
                  Failed to load job details. The job may have been removed.
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
