import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Sun, Moon, User, LogOut, Settings, Bell,
  Trash2, ChevronDown
} from 'lucide-react';
import useAuthStore from '@store/authStore';
import useThemeStore from '@store/themeStore';
import Avatar from '@components/common/Avatar';
import { notificationApi } from '@api/notificationApi';
import toast from 'react-hot-toast';
import Logo from '@components/common/Logo';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasShownLoginPopup, setHasShownLoginPopup] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { isAuthenticated, user, logout } = useAuthStore();
  const { displayMode, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await notificationApi.getNotifications();
      if (res.success) setNotifications(res.data);
    } catch {}
  };

  useEffect(() => {
    if (isAuthenticated && (user?.role === 'jobseeker' || user?.role === 'recruiter')) {
      fetchNotifications();
    }
  }, [isAuthenticated, user?.role, location.pathname]);

  useEffect(() => {
    if (isAuthenticated && notifications.length > 0 && !hasShownLoginPopup) {
      const unreadCount = notifications.filter(n => !n.isRead).length;
      if (unreadCount > 0) {
        toast('You have unread notifications', { icon: '🔔' });
        setHasShownLoginPopup(true);
      }
    }
  }, [isAuthenticated, notifications, hasShownLoginPopup]);

  const handleClearNotifications = async () => {
    try {
      await notificationApi.clearAll();
      setNotifications([]);
      toast.success('Notifications cleared');
      setIsNotificationMenuOpen(false);
    } catch {
      toast.error('Failed to clear notifications');
    }
  };

  const handleLogout = () => {
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/');
    logout();
  };

  const getProfilePath = () => {
    switch (user?.role) {
      case 'jobseeker': return '/jobseeker/profile';
      case 'recruiter': return '/recruiter/profile';
      case 'admin': return '/admin/users';
      default: return '/';
    }
  };

  const getSettingsPath = () => {
    switch (user?.role) {
      case 'jobseeker': return '/jobseeker/settings';
      case 'recruiter': return '/recruiter/settings';
      case 'admin': return '/admin/settings';
      default: return '/';
    }
  };

  const publicNavLinks = [
    { to: '/jobs', label: 'Browse Jobs' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  const getNavLinks = () => {
    switch (user?.role) {
      case 'jobseeker': return [];
      case 'recruiter': return [];
      case 'admin': return [];
      default: return publicNavLinks;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const activeLinks = getNavLinks();

  /* ─── Icon button base class ─── */
  const iconBtnCls = `
    relative flex items-center justify-center w-9 h-9 rounded-[var(--radius-lg)]
    border border-[var(--color-border)] bg-[var(--color-bg-card)]
    text-[var(--color-text-secondary)]
    hover:border-[var(--color-teal)] hover:text-[var(--color-teal)]
    dark:border-[var(--dm-border)] dark:bg-[var(--dm-bg-elevated)]
    dark:text-[var(--dm-text-secondary)]
    dark:hover:border-[var(--dm-accent-teal)] dark:hover:text-[var(--dm-accent-teal)]
    transition-all duration-200 focus-visible:outline-none
    focus-visible:ring-2 focus-visible:ring-[var(--color-teal)]
  `.trim();

  return (
    <header
      className={`navbar sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'shadow-md' : ''
      }`}
    >
      <div className="container-custom">
        <div className="flex h-[68px] items-center justify-between gap-4">

          {/* ─── Logo ─── */}
          <Logo size="md" />

          {/* ─── Desktop Nav ─── */}
          {activeLinks.length > 0 && (
            <nav
              className="hidden md:flex items-center gap-1 px-2 py-1.5 rounded-[var(--radius-full)]
                border border-[var(--color-border)] bg-[var(--color-bg-card)]/90
                dark:border-[var(--dm-border)] dark:bg-[var(--dm-bg-elevated)]/90
                backdrop-blur-md"
              aria-label="Main navigation"
            >
              {activeLinks.map((link, i) => (
                <NavLink
                  key={i}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-4 py-1.5 rounded-[var(--radius-full)] text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-[var(--color-teal)] text-white shadow-sm'
                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text-primary)] dark:text-[var(--dm-text-secondary)] dark:hover:bg-[var(--dm-bg-card)] dark:hover:text-[var(--dm-text-primary)]'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          )}

          {/* ─── Right controls ─── */}
          <div className="flex items-center gap-2">

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label={displayMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className={iconBtnCls}
            >
              <AnimatePresence mode="wait" initial={false}>
                {displayMode === 'dark' ? (
                  <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Sun className="w-4 h-4" />
                  </motion.span>
                ) : (
                  <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Moon className="w-4 h-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {isAuthenticated ? (
              <>
                {/* Notification Bell */}
                {(user?.role === 'jobseeker' || user?.role === 'recruiter') && (
                  <div className="relative" ref={notifRef}>
                    <button
                      onClick={() => setIsNotificationMenuOpen(!isNotificationMenuOpen)}
                      className={iconBtnCls}
                      aria-label="Open notifications"
                      aria-expanded={isNotificationMenuOpen}
                    >
                      <Bell className="w-4 h-4" />
                      {unreadCount > 0 && (
                        <span className="notif-dot" aria-label={`${unreadCount} unread notifications`} />
                      )}
                    </button>

                    <AnimatePresence>
                      {isNotificationMenuOpen && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setIsNotificationMenuOpen(false)} />
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                            transition={{ duration: 0.18 }}
                            className="absolute right-0 z-20 mt-2 w-80 card"
                            role="dialog"
                            aria-label="Notifications"
                          >
                            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)] dark:border-[var(--dm-border)]">
                              <h3 className="text-sm font-semibold text-[var(--color-text-primary)] dark:text-[var(--dm-text-primary)]">
                                Notifications
                                {unreadCount > 0 && (
                                  <span className="ml-2 badge badge-teal">{unreadCount} new</span>
                                )}
                              </h3>
                              {notifications.length > 0 && (
                                <button
                                  onClick={handleClearNotifications}
                                  className="flex items-center gap-1 text-xs text-[var(--color-error)] hover:opacity-80 transition-opacity"
                                >
                                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                                  Clear all
                                </button>
                              )}
                            </div>
                            <div className="max-h-80 overflow-y-auto divide-y divide-[var(--color-border)] dark:divide-[var(--dm-border)]">
                              {notifications.length > 0 ? (
                                notifications.map(notif => (
                                  <div
                                    key={notif._id}
                                    className={`px-4 py-3 transition-colors ${
                                      !notif.isRead
                                        ? 'bg-[var(--color-bg-subtle)] dark:bg-[var(--dm-bg-elevated)]'
                                        : ''
                                    }`}
                                  >
                                    <p className="text-sm font-medium text-[var(--color-text-primary)] dark:text-[var(--dm-text-primary)]">
                                      {notif.title}
                                    </p>
                                    <p className="text-xs text-[var(--color-text-secondary)] dark:text-[var(--dm-text-secondary)] mt-0.5 line-clamp-2">
                                      {notif.message}
                                    </p>
                                    <p className="text-[11px] text-[var(--color-text-muted)] dark:text-[var(--dm-text-muted)] mt-1">
                                      {new Date(notif.createdAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                ))
                              ) : (
                                <div className="flex flex-col items-center justify-center py-10 text-[var(--color-text-muted)] dark:text-[var(--dm-text-muted)]">
                                  <Bell className="w-8 h-8 mb-2 opacity-40" aria-hidden="true" />
                                  <p className="text-sm">No notifications yet</p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Profile Menu */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className={`
                      flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-[var(--radius-lg)]
                      border border-[var(--color-border)] bg-[var(--color-bg-card)]
                      hover:border-[var(--color-teal)]
                      dark:border-[var(--dm-border)] dark:bg-[var(--dm-bg-elevated)]
                      dark:hover:border-[var(--dm-accent-teal)]
                      transition-all duration-200
                    `}
                    aria-label="Open profile menu"
                    aria-expanded={isProfileMenuOpen}
                  >
                    <Avatar src={user?.profilePicture} size="sm" />
                    <span className="hidden lg:block text-sm font-medium text-[var(--color-text-primary)] dark:text-[var(--dm-text-primary)] max-w-[100px] truncate">
                      {user?.name || user?.email}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-[var(--color-text-muted)] dark:text-[var(--dm-text-muted)] transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </button>

                  <AnimatePresence>
                    {isProfileMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsProfileMenuOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.18 }}
                          className="absolute right-0 z-20 mt-2 w-52 card overflow-hidden"
                          role="menu"
                        >
                          <div className="px-4 py-3 border-b border-[var(--color-border)] dark:border-[var(--dm-border)]">
                            <p className="text-xs text-[var(--color-text-muted)] dark:text-[var(--dm-text-muted)]">Signed in as</p>
                            <p className="text-sm font-semibold text-[var(--color-text-primary)] dark:text-[var(--dm-text-primary)] truncate">
                              {user?.name || user?.email}
                            </p>
                            <span className="badge badge-teal mt-1 capitalize">{user?.role}</span>
                          </div>
                          <nav className="py-1">
                            <Link
                              to={getProfilePath()}
                              onClick={() => setIsProfileMenuOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--color-text-primary)] dark:text-[var(--dm-text-primary)] hover:bg-[var(--color-bg-subtle)] dark:hover:bg-[var(--dm-bg-elevated)] transition-colors"
                              role="menuitem"
                            >
                              <User className="w-4 h-4 text-[var(--color-text-muted)] dark:text-[var(--dm-text-muted)]" aria-hidden="true" />
                              Profile
                            </Link>
                            <Link
                              to={getSettingsPath()}
                              onClick={() => setIsProfileMenuOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--color-text-primary)] dark:text-[var(--dm-text-primary)] hover:bg-[var(--color-bg-subtle)] dark:hover:bg-[var(--dm-bg-elevated)] transition-colors"
                              role="menuitem"
                            >
                              <Settings className="w-4 h-4 text-[var(--color-text-muted)] dark:text-[var(--dm-text-muted)]" aria-hidden="true" />
                              Settings
                            </Link>
                            <div className="h-px bg-[var(--color-border)] dark:bg-[var(--dm-border)] mx-2 my-1" role="separator" />
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--color-error)] hover:bg-red-50 dark:hover:bg-red-900/15 transition-colors"
                              role="menuitem"
                            >
                              <LogOut className="w-4 h-4" aria-hidden="true" />
                              Sign out
                            </button>
                          </nav>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => navigate('/login')}
                  className="btn btn-ghost btn-sm"
                >
                  Sign in
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="btn btn-primary btn-sm"
                >
                  Get Started
                </button>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`${iconBtnCls} md:hidden`}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* ─── Mobile Drawer ─── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-[var(--color-border)] dark:border-[var(--dm-border)] md:hidden"
          >
            <nav className="container-custom py-4 space-y-1" aria-label="Mobile navigation">
              {activeLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-[var(--radius-lg)] px-4 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[var(--color-teal)] text-white'
                        : 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)] dark:text-[var(--dm-text-primary)] dark:hover:bg-[var(--dm-bg-elevated)]'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              {isAuthenticated ? (
                <div className="pt-2 border-t border-[var(--color-border)] dark:border-[var(--dm-border)] space-y-1">
                  <Link
                    to={getProfilePath()}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-[var(--radius-lg)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] dark:text-[var(--dm-text-primary)] hover:bg-[var(--color-bg-subtle)] dark:hover:bg-[var(--dm-bg-elevated)] transition-colors"
                  >
                    <User className="w-4 h-4" aria-hidden="true" /> Profile
                  </Link>
                  <Link
                    to={getSettingsPath()}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-[var(--radius-lg)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] dark:text-[var(--dm-text-primary)] hover:bg-[var(--color-bg-subtle)] dark:hover:bg-[var(--dm-bg-elevated)] transition-colors"
                  >
                    <Settings className="w-4 h-4" aria-hidden="true" /> Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 rounded-[var(--radius-lg)] px-4 py-2.5 text-sm text-[var(--color-error)] hover:bg-red-50 dark:hover:bg-red-900/15 transition-colors"
                  >
                    <LogOut className="w-4 h-4" aria-hidden="true" /> Sign out
                  </button>
                </div>
              ) : (
                <div className="pt-3 space-y-2">
                  <button
                    className="btn btn-ghost w-full"
                    onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
                  >
                    Sign in
                  </button>
                  <button
                    className="btn btn-primary w-full"
                    onClick={() => { navigate('/register'); setIsMobileMenuOpen(false); }}
                  >
                    Get Started
                  </button>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
