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

  const jobseekerNavLinks = [
    { to: '/jobseeker/dashboard', label: 'Dashboard' },
    { to: '/contact', label: 'Contact' },
  ];

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
    <nav className="sticky top-0 z-40 bg-white dark:bg-dark-bg border-b border-light-border dark:border-dark-border">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-xl font-bold text-light-text dark:text-dark-text">
              SmartHire
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {activeNavLinks.map((link, index) => (
              <NavLink
                key={index}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary transition-colors"
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
                      className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary transition-colors"
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
                        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-bg-secondary rounded-lg shadow-large border border-light-border dark:border-dark-border z-20 flex flex-col max-h-96">
                          <div className="p-3 border-b border-light-border dark:border-dark-border flex items-center justify-between">
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
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary transition-colors"
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
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-bg-secondary rounded-lg shadow-large border border-light-border dark:border-dark-border z-20">
                        <Link
                          to={getProfilePath()}
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center space-x-2 px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary transition-colors text-light-text dark:text-dark-text"
                        >
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </Link>
                        <Link
                          to={getSettingsPath()}
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center space-x-2 px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary transition-colors text-light-text dark:text-dark-text"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-2 px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary transition-colors text-error-600 border-t border-light-border dark:border-dark-border"
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
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary transition-colors"
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
          <div className="md:hidden py-4 space-y-2 border-t border-light-border dark:border-dark-border">
            {activeNavLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary text-light-text dark:text-dark-text'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {isAuthenticated ? (
              <div className="pt-2 space-y-1 border-t border-light-border dark:border-dark-border">
                <Link
                  to={getProfilePath()}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary text-light-text dark:text-dark-text"
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Link>
                <Link
                  to={getSettingsPath()}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary text-light-text dark:text-dark-text"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary text-error-600"
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
