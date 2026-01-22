import { NavLink } from "react-router-dom";

const Sidebar = ({ user }) => {  

  
  const MenuItem = ({ label, path = "#" }) => (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `block px-4 py-3 rounded-lg font-medium transition-all ${
          isActive
            ? "bg-blue-50 text-blue-700"
            : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
        }`
      }
    >
      {label}
    </NavLink>
  );

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-blue-600 tracking-tighter">
          SmartHire
        </h2>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-2">
          Menu
        </p>

        {user.role === "CANDIDATE" && (
          <>
            <MenuItem label="Dashboard" path="/dashboard" />
            <MenuItem label="My Resume" path="/resume" />
            <MenuItem label="Job Matches" path="/jobMatch"/>
            <MenuItem label="Applications" path="/applications"/>
          </>
        )}

        {user.role === "RECRUITER" && (
          <>
            <MenuItem label="Dashboard" path="/dashboard" />
            <MenuItem label="Post a Job" path="/postJob"/>
            <MenuItem label="Pending Applicants" path="/pending"/>
          </>
        )}

        {user.role === "ADMIN" && (
          <>
            <MenuItem label="Dashboard" path="/dashboard" />
            <MenuItem label="Manage Users" path="/manageUsers" />
            <MenuItem label="Manage Jobs" path="/manageJobs" />
            <MenuItem label="Analytics" path="/analytics"/>
          </>
        )}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-500 font-medium">Logged in as</p>
          <p className="text-sm font-bold text-gray-800 truncate">
            {user.name}
          </p>
          <p className="text-xs text-blue-600 font-semibold mt-1">
            {user.role}
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;