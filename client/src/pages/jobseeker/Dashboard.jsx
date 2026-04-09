import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Bookmark, FileText, ChevronRight, Clock, CheckCircle, Star, MapPin } from 'lucide-react';
import { jobSeekerApi } from '@api/jobSeekerApi';
import useAuthStore from '@store/authStore';
import Card from '@components/common/Card';
import Spinner from '@components/common/Spinner';

const SkeletonCard = () => (
  <div className="animate-pulse p-6 bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-dark-border flex items-center justify-between">
    <div className="space-y-3">
      <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-8 w-14 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
  </div>
);

const SkeletonListItem = () => (
  <div className="animate-pulse flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-dark-border bg-gray-50/50 dark:bg-dark-bg-secondary">
    <div className="space-y-2 flex-1">
      <div className="h-4 w-44 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-3 w-28 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
    <div className="flex items-center gap-4">
      <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    applications: 0,
    savedJobs: 0,
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [appRes, savedRes] = await Promise.all([
        jobSeekerApi.getMyApplications({ limit: 5 }),
        jobSeekerApi.getSavedJobs()
      ]);
      
      setStats({
        applications: appRes.count || appRes.data?.length || 0,
        savedJobs: savedRes.count || savedRes.data?.savedJobs?.length || savedRes.savedJobs?.length || 0,
      });

      setRecentApplications(appRes.data || appRes.applications || []);

      // Fetch recommended jobs
      try {
        const recRes = await jobSeekerApi.getRecommendedJobs({ limit: 4 });
        setRecommendedJobs(recRes.data || []);
      } catch (recErr) {
        console.error('Failed to fetch recommended jobs:', recErr);
        // Non-critical — don't block dashboard
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'rejected': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'interviewing': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      default: return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-light-text dark:text-dark-text">
            Welcome back, {user?.name || user?.firstName}!
          </h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mt-1">
            Here is your daily career summary.
          </p>
        </div>
        <Link 
          to="/jobs" 
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
        >
          Find Jobs
        </Link>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
          </div>
          <button onClick={() => { setError(null); fetchDashboardData(); }} className="px-4 py-2 text-sm font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
            Retry
          </button>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
        ) : (
          <>
            <Card className="p-6 border-l-4 border-l-primary flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Applications</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.applications}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Briefcase className="w-6 h-6" />
              </div>
            </Card>
            
            <Card className="p-6 border-l-4 border-l-accent flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Saved Jobs</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.savedJobs}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                <Bookmark className="w-6 h-6" />
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-green-500 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Profile Status</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white mt-2">Active</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-500">
                <CheckCircle className="w-6 h-6" />
              </div>
            </Card>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <FileText className="w-5 h-5 mr-2 text-primary" />
              Recent Applications
            </h2>
            <Link 
              to="/jobseeker/applications" 
              className="text-sm font-medium text-primary hover:text-primary-dark flex items-center"
            >
              View all
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          {loading ? (
            <div className="space-y-4">
              <SkeletonListItem /><SkeletonListItem /><SkeletonListItem />
            </div>
          ) : recentApplications.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 dark:text-gray-400 mb-4">You haven't applied to any jobs yet.</p>
              <Link to="/jobs" className="text-primary font-medium hover:underline">Browse job listings</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentApplications.map((app) => (
                <div key={app._id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-dark-border bg-gray-50/50 dark:bg-dark-bg-secondary hover:shadow-sm transition-all">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {app.jobId?.title || 'Unknown Role'}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {app.jobId?.companyId?.companyName || app.jobId?.company || 'Unknown Company'}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(app.status)}`}>
                      {app.status || 'applied'}
                    </span>
                    <Link 
                      to={`/jobseeker/applications/${app._id}`}
                      className="p-2 text-gray-400 hover:text-primary transition-colors bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-100 dark:border-dark-border"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Suggested Action */}
        <div className="space-y-6">
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-none">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Enhance Your Profile</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Complete your profile with skills, experience, and a professional photo to stand out to recruiters.
            </p>
            <Link 
              to="/jobseeker/profile" 
              className="block text-center w-full py-2 bg-white dark:bg-dark-card rounded-lg shadow-sm font-medium text-primary hover:bg-gray-50 dark:hover:bg-dark-hover transition-colors"
            >
              Update Profile
            </Link>
          </Card>
        </div>
      </div>

      {/* Recommended Jobs */}
      {!loading && recommendedJobs.length > 0 && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              Recommended For You
            </h2>
            <Link 
              to="/jobs" 
              className="text-sm font-medium text-primary hover:text-primary-dark flex items-center"
            >
              Browse all
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendedJobs.map((job) => (
              <Link 
                key={job._id} 
                to={`/jobs`}
                className="block p-4 rounded-xl border border-gray-100 dark:border-dark-border bg-gray-50/50 dark:bg-dark-bg-secondary hover:shadow-md hover:border-primary/30 transition-all"
              >
                <div className="flex items-start gap-3">
                  {job.companyId?.companyLogo ? (
                    <img src={job.companyId.companyLogo} alt="" className="w-10 h-10 rounded-lg object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-primary" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-white truncate">{job.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {job.companyId?.companyName || 'Company'}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" />{job.location?.isRemote ? 'Remote' : (job.location?.city || 'N/A')}</span>
                      <span className="capitalize">{job.employmentType || 'Full-time'}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
