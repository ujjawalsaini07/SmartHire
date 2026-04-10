// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { Users, Briefcase, FileText, TrendingUp, ChevronRight, CheckCircle2, X, Bell } from 'lucide-react';
// import { recruiterApi } from '@api/recruiterApi';
// import { notificationApi } from '@api/notificationApi';
// import useAuthStore from '@store/authStore';
// import Card from '@components/common/Card';
// import Spinner from '@components/common/Spinner';

// const SkeletonCard = () => (
//   <div className="animate-pulse p-6 bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-dark-border">
//     <div className="flex justify-between items-start">
//       <div className="space-y-3 flex-1">
//         <div className="h-4 w-24 bg-gray-200 dark:bg-dark-bg-tertiary rounded"></div>
//         <div className="h-8 w-16 bg-gray-200 dark:bg-dark-bg-tertiary rounded"></div>
//       </div>
//       <div className="w-12 h-12 bg-gray-200 dark:bg-dark-bg-tertiary rounded-lg"></div>
//     </div>
//   </div>
// );

// const SkeletonListItem = () => (
//   <div className="animate-pulse flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-dark-border bg-gray-50/50 dark:bg-dark-bg-secondary">
//     <div className="space-y-2 flex-1">
//       <div className="h-4 w-48 bg-gray-200 dark:bg-dark-bg-tertiary rounded"></div>
//       <div className="h-3 w-24 bg-gray-200 dark:bg-dark-bg-tertiary rounded"></div>
//     </div>
//     <div className="h-8 w-20 bg-gray-200 dark:bg-dark-bg-tertiary rounded"></div>
//   </div>
// );

// const Dashboard = () => {
//   const { user } = useAuthStore();
//   const [stats, setStats] = useState({
//     activeJobs: 0,
//     totalApplications: 0,
//   });
//   const [recentJobs, setRecentJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       // Fetch recruiter jobs to compile stats
//       const jobsRes = await recruiterApi.getMyJobs({ limit: 5 });
//       const jobs = jobsRes.data || jobsRes.jobs || [];
      
//       setStats({
//         activeJobs: jobs.filter(j => j.status === 'active').length || jobs.length,
//         totalApplications: jobs.reduce((acc, job) => acc + (job.applicationCount || 0), 0),
//       });

//       setRecentJobs(jobs.slice(0, 4));

//       try {
//         const notifRes = await notificationApi.getNotifications();
//         if (notifRes.success) {
//           setNotifications(notifRes.data.filter(n => !n.isRead));
//         }
//       } catch (err) {
//         console.error('Failed to fetch notifications');
//       }
//     } catch (err) {
//       console.error('Failed to fetch dashboard data:', err);
//       setError('Failed to load dashboard data. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const dismissNotification = async (id) => {
//     try {
//       await notificationApi.deleteNotification(id);
//       setNotifications(notifications.filter(n => n._id !== id));
//     } catch (err) {
//       console.error('Failed to dismiss notification');
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto space-y-6">

//       Notification Banner Stack
//       {notifications.length > 0 && (
//         <div className="space-y-3 mb-6">
//           {notifications.map(notif => (
//             <div key={notif._id} className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-4 flex items-start justify-between relative shadow-sm">
//               <div className="flex items-start gap-4">
//                 <div className="p-2 bg-white dark:bg-dark-bg-secondary rounded-full shadow-sm mt-1">
//                   <Bell className="w-5 h-5 text-primary-600 dark:text-primary-400" />
//                 </div>
//                 <div>
//                   <h4 className="font-semibold text-light-text dark:text-dark-text">{notif.title}</h4>
//                   <p className="text-light-text-secondary dark:text-dark-text-secondary pr-6 mt-1 whitespace-pre-wrap text-sm">{notif.message}</p>
//                 </div>
//               </div>
//               <button 
//                 onClick={() => dismissNotification(notif._id)}
//                 className="absolute top-4 right-4 p-1 text-gray-500 hover:bg-white dark:hover:bg-dark-bg rounded-full transition-colors"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}

//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
//             Welcome back, {user?.name?.split(' ')[0] || 'Recruiter'}!
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400 mt-1">
//             Manage your company's pipeline and active listings.
//           </p>
//         </div>
//         <Link 
//           to="/recruiter/post-job" 
//           className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
//         >
//           Post New Job
//         </Link>
//       </div>

//       {/* Error State */}
//       {error && (
//         <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
//               <Briefcase className="w-5 h-5 text-red-500" />
//             </div>
//             <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
//           </div>
//           <button onClick={() => { setError(null); fetchDashboardData(); }} className="px-4 py-2 text-sm font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
//             Retry
//           </button>
//         </div>
//       )}

//       {/* Stats Overview */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {loading ? (
//           <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
//         ) : (
//           <>
//             <Card className="p-6 border-l-4 border-l-blue-500">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Jobs</p>
//                   <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.activeJobs}</p>
//                 </div>
//                 <div className="p-3 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg">
//                   <Briefcase className="w-6 h-6" />
//                 </div>
//               </div>
//             </Card>
            
//             <Card className="p-6 border-l-4 border-l-accent">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Applicants</p>
//                   <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalApplications}</p>
//                 </div>
//                 <div className="p-3 bg-accent/10 text-accent rounded-lg">
//                   <FileText className="w-6 h-6" />
//                 </div>
//               </div>
//             </Card>

//             <Card className="p-6 border-l-4 border-l-green-500">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Status</p>
//                   <p className="text-xl font-bold text-gray-900 dark:text-white mt-2">Verified</p>
//                 </div>
//                 <div className="p-3 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded-lg">
//                   <CheckCircle2 className="w-6 h-6" />
//                 </div>
//               </div>
//             </Card>
//           </>
//         )}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Recent Jobs */}
//         <Card className="p-6">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
//               <Briefcase className="w-5 h-5 mr-2 text-primary" />
//               Recent Job Postings
//             </h2>
//             <Link 
//               to="/recruiter/jobs" 
//               className="text-sm font-medium text-primary hover:text-primary-dark flex items-center"
//             >
//               View all
//               <ChevronRight className="w-4 h-4 ml-1" />
//             </Link>
//           </div>
          
//           {loading ? (
//             <div className="space-y-4">
//               <SkeletonListItem /><SkeletonListItem /><SkeletonListItem />
//             </div>
//           ) : recentJobs.length === 0 ? (
//             <div className="text-center py-6">
//               <p className="text-gray-500 dark:text-gray-400 mb-2">You haven't posted any jobs yet.</p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {recentJobs.map((job) => (
//                 <div key={job._id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-dark-border bg-gray-50/50 dark:bg-dark-bg-secondary hover:shadow-sm">
//                   <div>
//                     <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{job.title}</h3>
//                     <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{job.applicationCount || 0} applications</p>
//                   </div>
//                   <Link 
//                     to={`/recruiter/jobs/${job._id}`}
//                     className="flex-shrink-0 px-3 py-1.5 text-sm font-medium bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 transition-colors"
//                   >
//                     Manage
//                   </Link>
//                 </div>
//               ))}
//             </div>
//           )}
//         </Card>

//         {/* Quick Actions / Tips */}
//         <Card className="p-6 bg-primary/5 border-none">
//            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recruiting Tips</h2>
//            <div className="space-y-4">
//               <div className="flex items-start">
//                   <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold mr-3 flex-shrink-0">1</div>
//                   <p className="text-sm text-gray-700 dark:text-gray-300 pt-1">Provide clear salary ranges to increase application volume by up to 30%.</p>
//               </div>
//               <div className="flex items-start">
//                   <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold mr-3 flex-shrink-0">2</div>
//                   <p className="text-sm text-gray-700 dark:text-gray-300 pt-1">Engage with candidates quickly. Review applications within 48 hours for best retention.</p>
//               </div>
//               <div className="flex items-start">
//                   <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold mr-3 flex-shrink-0">3</div>
//                   <p className="text-sm text-gray-700 dark:text-gray-300 pt-1">Keep your Company Profile updated to build brand trust with prospective employees.</p>
//               </div>
//            </div>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, FileText, ChevronRight, CheckCircle2, X, Bell } from 'lucide-react';
import { recruiterApi } from '@api/recruiterApi';
import { notificationApi } from '@api/notificationApi';
import useAuthStore from '@store/authStore';
import Card from '@components/common/Card';

const SkeletonCard = () => (
  <div className="animate-pulse p-6 bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-dark-border">
    <div className="flex justify-between items-start">
      <div className="space-y-3 flex-1">
        <div className="h-4 w-24 bg-gray-200 dark:bg-dark-bg-tertiary rounded"></div>
        <div className="h-8 w-16 bg-gray-200 dark:bg-dark-bg-tertiary rounded"></div>
      </div>
      <div className="w-12 h-12 bg-gray-200 dark:bg-dark-bg-tertiary rounded-lg"></div>
    </div>
  </div>
);

const SkeletonListItem = () => (
  <div className="animate-pulse flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-dark-border bg-gray-50/50 dark:bg-dark-bg-secondary">
    <div className="space-y-2 flex-1">
      <div className="h-4 w-48 bg-gray-200 dark:bg-dark-bg-tertiary rounded"></div>
      <div className="h-3 w-24 bg-gray-200 dark:bg-dark-bg-tertiary rounded"></div>
    </div>
    <div className="h-8 w-20 bg-gray-200 dark:bg-dark-bg-tertiary rounded"></div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ activeJobs: 0, totalApplications: 0 });
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notifDismissed, setNotifDismissed] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const jobsRes = await recruiterApi.getMyJobs({ limit: 5 });
      const jobs = jobsRes.data || jobsRes.jobs || [];

      setStats({
        activeJobs: jobs.filter((j) => j.status === 'active').length || jobs.length,
        totalApplications: jobs.reduce((acc, job) => acc + (job.applicationCount || 0), 0),
      });

      setRecentJobs(jobs.slice(0, 4));

      try {
        const notifRes = await notificationApi.getNotifications();
        if (notifRes.success) {
          setNotifications(notifRes.data.filter((n) => !n.isRead));
        }
      } catch (err) {
        console.error('Failed to fetch notifications');
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* Notification Banner */}
      {notifications.length > 0 && !notifDismissed && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white dark:bg-dark-bg-secondary rounded-full shadow-sm">
              <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="font-semibold text-blue-800 dark:text-blue-200 text-sm">
                You have {notifications.length} new notification{notifications.length > 1 ? 's' : ''}
              </p>
              <p className="text-blue-600 dark:text-blue-400 text-xs mt-0.5">
                Check the bell icon in the navbar to view them.
              </p>
            </div>
          </div>
          <button
            onClick={() => setNotifDismissed(true)}
            className="p-1.5 text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name?.split(' ')[0] || 'Recruiter'}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your company's pipeline and active listings.
          </p>
        </div>
        <Link
          to="/recruiter/post-job"
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
        >
          Post New Job
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
          <button
            onClick={() => { setError(null); fetchDashboardData(); }}
            className="px-4 py-2 text-sm font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
          >
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
            <Card className="p-6 border-l-4 border-l-blue-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Jobs</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.activeJobs}</p>
                </div>
                <div className="p-3 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg">
                  <Briefcase className="w-6 h-6" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-accent">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Applicants</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalApplications}</p>
                </div>
                <div className="p-3 bg-accent/10 text-accent rounded-lg">
                  <FileText className="w-6 h-6" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-green-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Status</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white mt-2">Verified</p>
                </div>
                <div className="p-3 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded-lg">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Recent Jobs + Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-primary" />
              Recent Job Postings
            </h2>
            <Link
              to="/recruiter/jobs"
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
          ) : recentJobs.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500 dark:text-gray-400 mb-2">You haven't posted any jobs yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentJobs.map((job) => (
                <div
                  key={job._id}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-dark-border bg-gray-50/50 dark:bg-dark-bg-secondary hover:shadow-sm"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{job.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      {job.applicationCount || 0} applications
                    </p>
                  </div>
                  <Link
                    to={`/recruiter/jobs/${job._id}`}
                    className="flex-shrink-0 px-3 py-1.5 text-sm font-medium bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 transition-colors"
                  >
                    Manage
                  </Link>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recruiting Tips */}
        <Card className="p-6 bg-primary/5 border-none">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recruiting Tips</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold mr-3 flex-shrink-0">1</div>
              <p className="text-sm text-gray-700 dark:text-gray-300 pt-1">Provide clear salary ranges to increase application volume by up to 30%.</p>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold mr-3 flex-shrink-0">2</div>
              <p className="text-sm text-gray-700 dark:text-gray-300 pt-1">Engage with candidates quickly. Review applications within 48 hours for best retention.</p>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold mr-3 flex-shrink-0">3</div>
              <p className="text-sm text-gray-700 dark:text-gray-300 pt-1">Keep your Company Profile updated to build brand trust with prospective employees.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
