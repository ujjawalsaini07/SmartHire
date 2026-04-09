import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, Clock, ChevronRight, Building, MapPin, AlertCircle, XCircle, Trash2 } from 'lucide-react';
import { jobSeekerApi } from '@api/jobSeekerApi';
import Card from '@components/common/Card';
import Spinner from '@components/common/Spinner';
import Button from '@components/common/Button';
import toast from 'react-hot-toast';

const STATUS_TABS = [
  { label: 'All', value: '' },
  { label: 'Applied', value: 'applied' },
  { label: 'Interviewing', value: 'interviewing' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Rejected', value: 'rejected' },
];

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    fetchApplications();
  }, [activeTab]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (activeTab) params.status = activeTab;
      const res = await jobSeekerApi.getMyApplications(params);
      setApplications(res.data || res.applications || []);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
      setError('Failed to load applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (appId) => {
    if (!window.confirm("Are you sure you want to withdraw this application?")) return;
    try {
      await jobSeekerApi.withdrawApplication(appId);
      toast.success("Application withdrawn successfully");
      fetchApplications();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to withdraw application");
    }
  };

  const handleDelete = async (appId) => {
    if (!window.confirm("Are you sure you want to delete this application record?")) return;
    try {
      await jobSeekerApi.deleteApplication(appId);
      toast.success("Application deleted safely");
      fetchApplications();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete application");
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted': 
        return <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 rounded-full text-xs font-semibold uppercase tracking-wider">Accepted</span>;
      case 'rejected': 
        return <span className="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 rounded-full text-xs font-semibold uppercase tracking-wider">Rejected</span>;
      case 'interviewing': 
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 rounded-full text-xs font-semibold uppercase tracking-wider">Interviewing</span>;
      default: 
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400 rounded-full text-xs font-semibold uppercase tracking-wider">Applied</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <Send className="w-8 h-8 mr-3 text-primary" />
          My Applications
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Track the status of jobs you have applied to.
        </p>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.value
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white dark:bg-dark-card text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-hover'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
          </div>
          <button onClick={fetchApplications} className="px-4 py-2 text-sm font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 transition-colors">
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : applications.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-20 h-20 bg-gray-50 dark:bg-dark-bg rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {activeTab ? `No ${activeTab} applications` : 'No applications found'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
            {activeTab 
              ? `You don't have any applications with "${activeTab}" status.` 
              : "You haven't applied to any jobs yet. Start exploring opportunities!"}
          </p>
          {activeTab ? (
            <button 
              onClick={() => setActiveTab('')}
              className="px-6 py-2 bg-gray-100 dark:bg-dark-card text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-hover transition-colors inline-block font-medium"
            >
              Show All Applications
            </button>
          ) : (
            <Link 
              to="/jobs" 
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors inline-block font-medium"
            >
              Browse Jobs
            </Link>
          )}
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <Card key={app._id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                
                <div className="flex-1">
                  <div className="flex justify-between items-start md:block">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {app.jobId?.title || 'Unknown Role'}
                    </h3>
                    <div className="md:hidden">
                      {getStatusBadge(app.status)}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <div className="flex items-center">
                      <Building className="w-4 h-4 mr-1.5" />
                      {app.jobId?.companyId?.companyName || app.jobId?.company || 'Company'}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1.5" />
                      {app.jobId?.location?.isRemote ? 'Remote' : (app.jobId?.location?.city || 'Not specified')}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1.5" />
                      Applied on {new Date(app.appliedAt || app.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:flex-col md:items-end gap-4 mt-4 md:mt-0 border-t md:border-t-0 border-gray-100 dark:border-dark-border pt-4 md:pt-0">
                  <div className="hidden md:block mb-2">
                    {getStatusBadge(app.status)}
                  </div>
                  <div className="flex items-center gap-2">
                    {['submitted', 'reviewed', 'shortlisted', 'interviewing'].includes(app.status) && (
                      <Button size="sm" variant="outline" className="text-gray-500 hover:text-gray-700" onClick={() => handleWithdraw(app._id)}>
                        <XCircle className="w-4 h-4 mr-1" />
                        Withdraw
                      </Button>
                    )}
                    {['withdrawn', 'rejected'].includes(app.status) && (
                      <Button size="sm" variant="outline" className="text-red-500 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => handleDelete(app._id)}>
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    )}
                    <Link 
                      to={`/jobseeker/applications/${app._id}`}
                      className="flex items-center text-primary font-medium hover:text-primary-dark transition-colors px-2 py-1"
                    >
                      View Details
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>

              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
