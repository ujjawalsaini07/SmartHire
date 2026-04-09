import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Activity, RefreshCw, AlertCircle } from 'lucide-react';
import { recruiterApi } from '@api/recruiterApi';
import Card from '@components/common/Card';
import Spinner from '@components/common/Spinner';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await recruiterApi.getDashboardAnalytics();
      setData(res.data);
    } catch (err) {
      console.error('Failed to load analytics', err);
      setError('Failed to load analytics data. Please try again.');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // Build chart data from the API response
  const jobChartData = (data?.jobs || []).map(job => ({
    name: job.title?.length > 20 ? job.title.substring(0, 20) + '…' : job.title,
    views: job.views || 0,
    applications: job.applicationCount || 0,
  }));

  // Build status breakdown from recent applications
  const statusCounts = {};
  (data?.recentApplications || []).forEach(app => {
    const s = app.status || 'applied';
    statusCounts[s] = (statusCounts[s] || 0) + 1;
  });
  const statusPieData = Object.entries(statusCounts).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <BarChart3 className="w-8 h-8 mr-3 text-primary" />
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track the performance of your job listings and applicant funnel.
          </p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg hover:bg-gray-50 dark:hover:bg-dark-hover transition-colors text-gray-700 dark:text-gray-300"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
          </div>
          <button onClick={fetchAnalytics} className="px-4 py-2 text-sm font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 transition-colors">
            Retry
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-transparent">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Listing Views</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{data?.summary?.totalViews || 0}</p>
            </div>
            <div className="p-3 bg-white dark:bg-dark-card rounded-xl shadow-sm">
              <Activity className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-500/5 to-transparent">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Applications</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{data?.summary?.totalApplications || 0}</p>
            </div>
            <div className="p-3 bg-white dark:bg-dark-card rounded-xl shadow-sm">
              <Users className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-500/5 to-transparent">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Jobs</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{data?.summary?.activeJobs || 0}</p>
            </div>
            <div className="p-3 bg-white dark:bg-dark-card rounded-xl shadow-sm">
              <TrendingUp className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart — Views vs Applications per Job */}
        <Card className="lg:col-span-2 p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Views vs Applications per Job</h2>
          {jobChartData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <BarChart3 className="w-12 h-12 mb-3" />
              <p>No job data available yet.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={jobChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  }}
                />
                <Bar dataKey="views" fill="#6366f1" radius={[4, 4, 0, 0]} name="Views" />
                <Bar dataKey="applications" fill="#22c55e" radius={[4, 4, 0, 0]} name="Applications" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Pie Chart — Application Status Breakdown */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Application Status</h2>
          {statusPieData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Users className="w-12 h-12 mb-3" />
              <p>No applications yet.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusPieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Performance Table */}
      {(data?.jobs || []).length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Job Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-dark-border">
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Job Title</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Views</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Applications</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Conversion</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.jobs.map(job => {
                  const views = job.views || 0;
                  const apps = job.applicationCount || 0;
                  const conversion = views > 0 ? ((apps / views) * 100).toFixed(1) : '0.0';
                  return (
                    <tr key={job._id} className="border-b border-gray-100 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-hover transition-colors">
                      <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{job.title}</td>
                      <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">{views.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">{apps}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={`font-medium ${parseFloat(conversion) > 5 ? 'text-green-600' : 'text-gray-600 dark:text-gray-400'}`}>
                          {conversion}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          job.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Analytics;
