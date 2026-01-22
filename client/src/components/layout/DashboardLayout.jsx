import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const DashboardLayout = ({ children, user, logout }) => { 
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} />  
      <div className="flex-1">
        <Topbar user={user} logout={logout} /> 
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;