import { useEffect, useState } from 'react';
import { Settings as SettingsIcon, Server, Key } from 'lucide-react';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import toast from 'react-hot-toast';
import { authApi } from '@api/authApi';
import { adminApi } from '@api/adminApi';
import Input from '@components/common/Input';
import Spinner from '@components/common/Spinner';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('platform');
  const defaultPlatformConfig = {
    registrationOpen: true,
    maintenanceMode: false,
    autoModerateJobs: true,
  };

  // Tab 1: Platform State
  const [platformConfig, setPlatformConfig] = useState(defaultPlatformConfig);
  const [savedPlatformConfig, setSavedPlatformConfig] = useState(defaultPlatformConfig);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  // Tab 2: Password State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const hasConfigChanges =
    platformConfig.registrationOpen !== savedPlatformConfig.registrationOpen ||
    platformConfig.maintenanceMode !== savedPlatformConfig.maintenanceMode ||
    platformConfig.autoModerateJobs !== savedPlatformConfig.autoModerateJobs;

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoadingConfig(true);
        const response = await adminApi.getSystemSettings();
        const incoming = response?.data || {};
        const normalized = {
          registrationOpen: incoming.registrationOpen ?? defaultPlatformConfig.registrationOpen,
          maintenanceMode: incoming.maintenanceMode ?? defaultPlatformConfig.maintenanceMode,
          autoModerateJobs: incoming.autoModerateJobs ?? defaultPlatformConfig.autoModerateJobs,
        };
        setPlatformConfig(normalized);
        setSavedPlatformConfig(normalized);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load platform settings');
      } finally {
        setIsLoadingConfig(false);
      }
    };

    fetchSettings();
  }, []);

  const handleConfigSave = async (e) => {
    e.preventDefault();
    try {
      setIsSavingConfig(true);
      const response = await adminApi.updateSystemSettings(platformConfig);
      const saved = response?.data || platformConfig;
      const normalized = {
        registrationOpen: saved.registrationOpen ?? platformConfig.registrationOpen,
        maintenanceMode: saved.maintenanceMode ?? platformConfig.maintenanceMode,
        autoModerateJobs: saved.autoModerateJobs ?? platformConfig.autoModerateJobs,
      };

      setPlatformConfig(normalized);
      setSavedPlatformConfig(normalized);
      toast.success('Platform configuration saved successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save platform settings');
    } finally {
      setIsSavingConfig(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error("New passwords don't match");
    }
    if (passwordForm.newPassword.length < 8) {
      return toast.error("Password must be at least 8 characters");
    }

    try {
      setIsChangingPassword(true);
      await authApi.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      toast.success('Password changed successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <SettingsIcon className="w-8 h-8 mr-3 text-primary" />
          System Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage system configurations and admin security.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation/Tabs */}
        <div className="space-y-2">
          <button
            onClick={() => setActiveTab('platform')}
            className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'platform'
                ? 'bg-primary/10 text-primary'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-hover'
            }`}
          >
            <Server className="w-5 h-5 mr-3" /> Platform
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'password'
                ? 'bg-primary/10 text-primary'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-hover'
            }`}
          >
            <Key className="w-5 h-5 mr-3" /> Security
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6">
            
            {activeTab === 'platform' && (
              <>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Platform Configuration</h2>
                {isLoadingConfig ? (
                  <div className="py-12 flex justify-center">
                    <Spinner size="md" />
                  </div>
                ) : (
                <form onSubmit={handleConfigSave} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Open Registration</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Allow new users to sign up.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={platformConfig.registrationOpen} onChange={() => setPlatformConfig({...platformConfig, registrationOpen: !platformConfig.registrationOpen})} disabled={isSavingConfig} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Auto-Moderate Jobs</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Automatically approve jobs from verified recruiters.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={platformConfig.autoModerateJobs} onChange={() => setPlatformConfig({...platformConfig, autoModerateJobs: !platformConfig.autoModerateJobs})} disabled={isSavingConfig} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Maintenance Mode</h4>
                      <p className="text-sm text-error-500">Put the site into maintenance mode. Only admins will have access.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={platformConfig.maintenanceMode} onChange={() => setPlatformConfig({...platformConfig, maintenanceMode: !platformConfig.maintenanceMode})} disabled={isSavingConfig} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="pt-4 border-t border-gray-100 dark:border-dark-border flex justify-end">
                    <Button type="submit" isLoading={isSavingConfig} disabled={!hasConfigChanges || isSavingConfig}>
                      Save Changes
                    </Button>
                  </div>
                </form>
                )}
              </>
            )}

            {activeTab === 'password' && (
              <>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Change Password</h2>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <Input
                    label="Current Password"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                    required
                  />
                  <Input
                    label="New Password"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    required
                    helperText="Minimum 8 characters"
                  />
                  <Input
                    label="Confirm New Password"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    required
                  />
                  <div className="pt-4 flex justify-end">
                    <Button type="submit" isLoading={isChangingPassword}>
                      Update Password
                    </Button>
                  </div>
                </form>
              </>
            )}

          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
