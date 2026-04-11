import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, User, LogOut, Settings, Bell, Trash2 } from 'lucide-react';
import useAuthStore from '@store/authStore';
import useThemeStore from '@store/themeStore';
import Button from '@components/common/Button';
import Avatar from '@components/common/Avatar';
import { notificationApi } from '@api/notificationApi';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const { isAuthenticated, user, logout } = useAuthStore();
  const { displayMode, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
  const [hasShownLoginPopup, setHasShownLoginPopup] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await notificationApi.getNotifications();
      if (res.success) {
        setNotifications(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated && (user?.role === 'jobseeker' || user?.role === 'recruiter')) {
      fetchNotifications();
    }
  }, [isAuthenticated, user?.role, location.pathname]); // Re-fetch on navigation for freshness

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
      toast.success("Notifications cleared");
      setIsNotificationMenuOpen(false);
    } catch (err) {
      toast.error("Failed to clear notifications");
    }
  };

  const handleLogout = () => {
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/');
    logout();
  };

  // Role-based profile and settings paths
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

  const recruiterNavLinks = [
    { to: '/recruiter/dashboard', label: 'Dashboard' },
    { to: '/contact', label: 'Contact' },
  ];

  const jobseekerNavLinks = [];

  const adminNavLinks = [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/contact', label: 'Contact' },
  ];

  const getNavLinks = () => {
    switch (user?.role) {
      case 'jobseeker': return jobseekerNavLinks;
      case 'recruiter': return recruiterNavLinks;
      case 'admin': return adminNavLinks;
      default: return publicNavLinks;
    }
  };

  const activeNavLinks = getNavLinks();

  return (
    <nav className="sticky top-0 z-50 border-b border-light-border/70 bg-white/80 shadow-[0_12px_34px_-24px_rgba(64,96,147,0.58)] backdrop-blur-xl dark:border-dark-border/70 dark:bg-dark-bg/80">
      <div className="container-custom">
        <div className="flex h-20 items-center justify-between py-2">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-600 shadow-soft">
              <span className="text-xl font-bold text-white">S</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-light-text dark:text-dark-text">
              SmartHire
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center rounded-full border border-light-border/80 bg-white/90 px-2 py-1 shadow-soft dark:border-dark-border/80 dark:bg-dark-bg-secondary/80 md:flex">
            {activeNavLinks.map((link, index) => (
              <NavLink
                key={index}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                      : 'text-light-text-secondary hover:bg-light-bg-tertiary hover:text-light-text dark:text-dark-text-secondary dark:hover:bg-dark-hover dark:hover:text-dark-text'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="rounded-lg border border-light-border bg-white p-2.5 text-light-text-secondary transition-colors hover:border-primary-300 hover:text-primary-600 dark:border-dark-border dark:bg-dark-bg-secondary dark:text-dark-text-secondary dark:hover:border-primary-500 dark:hover:text-primary-300"
            >
              {displayMode === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {isAuthenticated ? (
              <>
                {/* Notification Bell */}
                {(user?.role === 'jobseeker' || user?.role === 'recruiter') && (
                  <div className="relative">
                    <button
                      onClick={() => setIsNotificationMenuOpen(!isNotificationMenuOpen)}
                      className="relative rounded-lg border border-light-border bg-white p-2.5 text-light-text-secondary transition-colors hover:border-primary-300 hover:text-primary-600 dark:border-dark-border dark:bg-dark-bg-secondary dark:text-dark-text-secondary dark:hover:border-primary-500 dark:hover:text-primary-300"
                      aria-label="Open notifications"
                    >
                      <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                      {notifications.filter(n => !n.isRead).length > 0 && (
                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-dark-bg"></span>
                      )}
                    </button>

                    {isNotificationMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsNotificationMenuOpen(false)} />
                        <div className="absolute right-0 z-20 mt-2 flex max-h-96 w-80 flex-col rounded-2xl border border-light-border bg-white/95 shadow-large backdrop-blur-lg dark:border-dark-border dark:bg-dark-bg-secondary/95">
                          <div className="flex items-center justify-between border-b border-light-border px-3 py-3 dark:border-dark-border">
                            <h3 className="font-semibold text-light-text dark:text-dark-text">Notifications</h3>
                            {notifications.length > 0 && (
                              <button onClick={handleClearNotifications} className="text-xs text-error-600 hover:text-error-700 flex items-center">
                                <Trash2 className="w-3 h-3 mr-1" /> Clear All
                              </button>
                            )}
                          </div>
                          <div className="flex-1 overflow-y-auto">
                            {notifications.length > 0 ? (
                              <div className="flex flex-col">
                                {notifications.map(notif => (
                                  <div key={notif._id} className={`p-3 border-b border-light-border dark:border-dark-border last:border-0 ${!notif.isRead ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}`}>
                                    <p className="text-sm font-medium text-light-text dark:text-dark-text">{notif.title}</p>
                                    <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mt-1">{notif.message}</p>
                                    <p className="text-[10px] text-gray-400 mt-2">{new Date(notif.createdAt).toLocaleDateString()}</p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                No notifications to display.
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Profile Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 rounded-lg border border-light-border bg-white p-2 transition-colors hover:border-primary-300 hover:bg-primary-50/70 dark:border-dark-border dark:bg-dark-bg-secondary dark:hover:border-primary-500 dark:hover:bg-dark-hover"
                    aria-label="Open profile menu"
                  >
                    <Avatar src={user?.profilePicture} size="sm" />
                    <span className="hidden lg:block text-sm font-medium text-light-text dark:text-dark-text">
                      {user?.name || user?.email}
                    </span>
                  </button>

                  {isProfileMenuOpen && (
                    <>
                      {/* Backdrop to close menu */}
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsProfileMenuOpen(false)}
                      />
                      <div className="absolute right-0 z-20 mt-2 w-52 rounded-2xl border border-light-border bg-white/95 shadow-large backdrop-blur-lg dark:border-dark-border dark:bg-dark-bg-secondary/95">
                        <Link
                          to={getProfilePath()}
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center space-x-2 px-4 py-3 text-light-text transition-colors hover:bg-primary-50 dark:text-dark-text dark:hover:bg-dark-hover"
                        >
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </Link>
                        <Link
                          to={getSettingsPath()}
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center space-x-2 px-4 py-3 text-light-text transition-colors hover:bg-primary-50 dark:text-dark-text dark:hover:bg-dark-hover"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-2 border-t border-light-border px-4 py-3 text-error-600 transition-colors hover:bg-error-50 dark:border-dark-border dark:hover:bg-error-900/20"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button onClick={() => navigate('/register')}>Sign Up</Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-lg border border-light-border bg-white p-2.5 text-light-text-secondary transition-colors hover:border-primary-300 hover:text-primary-600 dark:border-dark-border dark:bg-dark-bg-secondary dark:text-dark-text-secondary dark:hover:border-primary-500 dark:hover:text-primary-300 md:hidden"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="space-y-2 border-t border-light-border py-4 dark:border-dark-border md:hidden">
            {activeNavLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block rounded-xl px-4 py-2.5 font-semibold transition-colors ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-light-text hover:bg-light-bg-tertiary dark:text-dark-text dark:hover:bg-dark-hover'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {isAuthenticated ? (
              <div className="space-y-1 border-t border-light-border pt-2 dark:border-dark-border">
                <Link
                  to={getProfilePath()}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-2 rounded-xl px-4 py-2.5 text-light-text transition-colors hover:bg-light-bg-tertiary dark:text-dark-text dark:hover:bg-dark-hover"
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Link>
                <Link
                  to={getSettingsPath()}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-2 rounded-xl px-4 py-2.5 text-light-text transition-colors hover:bg-light-bg-tertiary dark:text-dark-text dark:hover:bg-dark-hover"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 rounded-xl px-4 py-2.5 text-error-600 transition-colors hover:bg-error-50 dark:hover:bg-error-900/20"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="pt-4 space-y-2">
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
                >
                  Login
                </Button>
                <Button
                  className="w-full"
                  onClick={() => { navigate('/register'); setIsMobileMenuOpen(false); }}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
