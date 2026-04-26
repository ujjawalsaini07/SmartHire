import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, X, LogOut, Sun, Moon } from 'lucide-react';
import useAuthStore from '@store/authStore';
import useThemeStore from '@store/themeStore';
import Logo from '@components/common/Logo';

const Sidebar = ({ links = [], isMobile = false, onClose, isCollapsed = false, onToggleCollapse }) => {
  const { user, logout } = useAuthStore();
  const { displayMode, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
    logout();
  };

  const getRoleName = () => {
    switch (user?.role) {
      case 'jobseeker': return 'Job Seeker';
      case 'recruiter': return 'Recruiter';
      case 'admin':     return 'Admin';
      default:          return 'User';
    }
  };

  const getRoleGradient = () => {
    switch (user?.role) {
      case 'admin':     return 'from-[#7C3AED] to-[#4F46E5]';
      case 'recruiter': return 'from-[var(--color-teal)] to-[var(--color-deep)]';
      default:          return 'from-[#3B82F6] to-[#1E40AF]';
    }
  };

  return (
    <div className="sidebar-root flex h-full flex-col overflow-hidden">

      {/* ── Header / Logo ── */}
      <div className="flex h-[68px] items-center justify-between px-4 border-b border-[var(--color-border)] dark:border-[var(--dm-border)] flex-shrink-0">
        {(!isCollapsed || isMobile) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Logo size="sm" />
          </motion.div>
        )}

        {/* Collapse / Close button */}
        {!isMobile && onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className={`
              flex items-center justify-center w-8 h-8 rounded-[var(--radius-md)]
              border border-[var(--color-border)] dark:border-[var(--dm-border)]
              text-[var(--color-text-muted)] dark:text-[var(--dm-text-muted)]
              hover:border-[var(--color-teal)] hover:text-[var(--color-teal)]
              dark:hover:border-[var(--dm-accent-teal)] dark:hover:text-[var(--dm-accent-teal)]
              transition-all duration-200
              ${isCollapsed ? 'mx-auto' : ''}
            `}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft
              className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </button>
        )}

        {isMobile && onClose && (
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-[var(--radius-md)] border border-[var(--color-border)] dark:border-[var(--dm-border)] text-[var(--color-text-muted)] hover:text-[var(--color-error)] transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5 no-scrollbar" aria-label="Sidebar navigation">
        {links.map((link, index) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={index}
              to={link.to}
              title={isCollapsed && !isMobile ? link.label : undefined}
              onClick={() => isMobile && onClose && onClose()}
              className={({ isActive }) =>
                `sidebar-nav-item ${isActive ? 'sidebar-nav-item-active' : ''} ${
                  isCollapsed && !isMobile ? 'justify-center px-0' : ''
                }`
              }
            >
              {Icon && (
                <Icon
                  className={`flex-shrink-0 ${isCollapsed && !isMobile ? 'w-5 h-5' : 'w-4 h-4'}`}
                  aria-hidden="true"
                />
              )}
              <AnimatePresence initial={false}>
                {(!isCollapsed || isMobile) && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    {link.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </nav>

      {/* ── Footer ── */}
      <div className="flex-shrink-0 border-t border-[var(--color-border)] dark:border-[var(--dm-border)] p-3 space-y-2">

        {/* User info */}
        {(!isCollapsed || isMobile) && (
          <div className={`flex items-center gap-3 px-3 py-2 rounded-[var(--radius-lg)] bg-[var(--color-bg-subtle)] dark:bg-[var(--dm-bg-elevated)]`}>
            {/* Avatar circle with role gradient */}
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getRoleGradient()} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
              {(user?.name || user?.email || '?').charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-semibold text-[var(--color-text-primary)] dark:text-[var(--dm-text-primary)] truncate leading-tight">
                {user?.name || user?.email}
              </p>
              <p className="text-xs text-[var(--color-teal)] dark:text-[var(--dm-accent-teal)] font-medium">
                {getRoleName()}
              </p>
            </div>
          </div>
        )}

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          aria-label={displayMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className={`
            w-full flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-lg)]
            text-[13px] font-medium
            text-[var(--color-text-secondary)] dark:text-[var(--dm-text-secondary)]
            hover:bg-[var(--color-bg-subtle)] dark:hover:bg-[var(--dm-bg-elevated)]
            transition-colors duration-200
            ${isCollapsed && !isMobile ? 'justify-center' : ''}
          `}
        >
          {displayMode === 'dark' ? (
            <Sun className="w-4 h-4 flex-shrink-0 text-[var(--color-warning)]" aria-hidden="true" />
          ) : (
            <Moon className="w-4 h-4 flex-shrink-0 text-[var(--color-navy)]" aria-hidden="true" />
          )}
          {(!isCollapsed || isMobile) && (
            <span>{displayMode === 'dark' ? 'Light mode' : 'Dark mode'}</span>
          )}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`
            w-full flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-lg)]
            text-[13px] font-medium
            text-[var(--color-error)] hover:bg-red-50 dark:hover:bg-red-900/15
            transition-colors duration-200
            ${isCollapsed && !isMobile ? 'justify-center' : ''}
          `}
          aria-label="Sign out"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          {(!isCollapsed || isMobile) && <span>Sign out</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
