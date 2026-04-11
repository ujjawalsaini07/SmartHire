import { NavLink } from 'react-router-dom';
import { ChevronLeft, X, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@store/authStore';
import Button from '@components/common/Button';

const Sidebar = ({ links = [], isMobile = false, onClose, isCollapsed = false, onToggleCollapse }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
    logout();
  };

  const getRoleName = () => {
    switch (user?.role) {
      case 'jobseeker':
        return 'Job Seeker';
      case 'recruiter':
        return 'Recruiter';
      case 'admin':
        return 'Admin';
      default:
        return 'User';
    }
  };

  return (
    <div className="flex h-full flex-col border-r border-light-border/80 bg-white/88 backdrop-blur-md dark:border-dark-border/80 dark:bg-dark-bg-secondary/92">
      {/* Sidebar Header - Collapse/Close Button */}
      <div className="flex justify-end border-b border-light-border/80 p-4 dark:border-dark-border/80">
        {!isMobile && onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="rounded-lg border border-light-border bg-white p-2 text-light-text-secondary transition-colors hover:border-primary-300 hover:text-primary-600 dark:border-dark-border dark:bg-dark-bg-tertiary dark:text-dark-text-secondary dark:hover:border-primary-500 dark:hover:text-primary-300"
            aria-label="Toggle sidebar"
          >
            <ChevronLeft
              className={`w-5 h-5 transition-transform ${
                isCollapsed ? 'rotate-180' : ''
              }`}
            />
          </button>
        )}
        {isMobile && onClose && (
          <button
            onClick={onClose}
            className="rounded-lg border border-light-border bg-white p-2 text-light-text-secondary transition-colors hover:border-primary-300 hover:text-primary-600 dark:border-dark-border dark:bg-dark-bg-tertiary dark:text-dark-text-secondary dark:hover:border-primary-500 dark:hover:text-primary-300"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1.5">
          {links.map((link, index) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={index}
                to={link.to}
                onClick={() => isMobile && onClose && onClose()}
                className={({ isActive }) =>
                  `flex items-center space-x-3 rounded-xl px-4 py-3 transition-colors ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-100 to-primary-50 text-primary-700 shadow-soft dark:from-primary-900/35 dark:to-primary-900/10 dark:text-primary-300'
                      : 'text-light-text-secondary hover:bg-light-bg-tertiary hover:text-light-text dark:text-dark-text-secondary dark:hover:bg-dark-hover dark:hover:text-dark-text'
                  }`
                }
              >
                {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
                {(!isCollapsed || isMobile) && (
                  <span className="font-medium">{link.label}</span>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* User Info & Logout */}
      <div className="space-y-2 border-t border-light-border/80 p-4 dark:border-dark-border/80">
        <div
          className={`rounded-xl border border-light-border bg-light-bg-tertiary px-3 py-2 dark:border-dark-border dark:bg-dark-bg-tertiary ${
            isCollapsed && !isMobile ? 'text-center' : ''
          }`}
        >
          {(!isCollapsed || isMobile) ? (
            <>
              <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                Logged in as
              </p>
              <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 capitalize">
                {getRoleName()}
              </p>
            </>
          ) : (
            <p className="text-xs font-semibold text-primary-600 dark:text-primary-400">
              {user?.role?.charAt(0).toUpperCase()}
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-error-600 hover:bg-error-50 dark:hover:bg-error-900/20"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {(!isCollapsed || isMobile) && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
