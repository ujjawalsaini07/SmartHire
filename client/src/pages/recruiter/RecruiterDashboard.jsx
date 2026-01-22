import DashboardLayout from "../../components/layout/DashboardLayout";
import useAuthStore from "../../store/auth.store";

const RecruiterDashboard = () => {
  const { user, logout } = useAuthStore(); 

  return (
    <DashboardLayout user={user} logout={logout}> 
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Recruiter Dashboard</h1>
        <p className="text-gray-500">Manage your job postings and candidate applications.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Jobs Posted" value="-" />
        <StatCard title="Total Applicants" value="-" />
        <StatCard title="Candidates Shortlisted" value="-" />
      </div>
    </DashboardLayout>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</p>
    <h2 className="text-4xl font-bold text-gray-900 mt-2">{value}</h2>
  </div>
);

export default RecruiterDashboard;