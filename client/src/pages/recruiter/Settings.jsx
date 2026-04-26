import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, Bell, Shield, Key, Eye, EyeOff } from 'lucide-react';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import toast from 'react-hot-toast';
import { authApi } from '@api/authApi';
import Input from '@components/common/Input';
import Modal from '@components/common/Modal';
import useAuthStore from '@store/authStore';

const Settings = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('notifications');
  
  // Tab 1: Notifications State
  const [notifications, setNotifications] = useState({
    dailyDigest: true,
    newApplicants: true
  });

  // Tab 2: Password State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const requiredDeleteText = 'DELETE';
  const isDeleteTextValid = deleteConfirmationText.trim() === requiredDeleteText;

  const handleNotificationsSave = (e) => {
    e.preventDefault();
    toast.success('Notification preferences saved successfully');
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

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const openDeleteModal = () => {
    setDeleteConfirmationText('');
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (isDeletingAccount) return;
    setIsDeleteModalOpen(false);
    setDeleteConfirmationText('');
  };

  const handleDeleteAccount = async () => {
    if (!isDeleteTextValid) {
      return toast.error('Please type DELETE to confirm account deletion');
    }

    try {
      setIsDeletingAccount(true);
      await authApi.deleteMyAccount();
      closeDeleteModal();
      logout();
      toast.success('Your account has been deleted successfully');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete account');
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <SettingsIcon className="w-8 h-8 mr-3 text-primary" />
          Account Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your account defaults and password.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation/Tabs */}
        <div className="space-y-2">
          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'notifications'
                ? 'bg-primary/10 text-primary'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-hover'
            }`}
          >
            <Bell className="w-5 h-5 mr-3" /> Notifications
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
          <button
            onClick={() => setActiveTab('privacy')}
            className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'privacy'
                ? 'bg-primary/10 text-primary'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-hover'
            }`}
          >
            <Shield className="w-5 h-5 mr-3" /> Privacy
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6">
            
            {activeTab === 'notifications' && (
              <>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Notification Preferences</h2>
                <form onSubmit={handleNotificationsSave} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Daily Digest</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Receive a daily summary of platform activity.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={notifications.dailyDigest} onChange={() => setNotifications({...notifications, dailyDigest: !notifications.dailyDigest})} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">New Applicants Alert</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Instantly get notified when someone applies.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={notifications.newApplicants} onChange={() => setNotifications({...notifications, newApplicants: !notifications.newApplicants})} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="pt-4 border-t border-gray-100 dark:border-dark-border flex justify-end">
                    <Button type="submit">Save Preferences</Button>
                  </div>
                </form>
              </>
            )}

            {activeTab === 'password' && (
              <>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Change Password</h2>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="relative">
                    <Input
                      label="Current Password"
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                      className="pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute right-3 top-10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      aria-label={showPasswords.current ? 'Hide current password' : 'Show current password'}
                    >
                      {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      label="New Password"
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      className="pr-12"
                      required
                      helperText="Minimum 8 characters"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute right-3 top-10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      aria-label={showPasswords.new ? 'Hide new password' : 'Show new password'}
                    >
                      {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      label="Confirm New Password"
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      className="pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute right-3 top-10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      aria-label={showPasswords.confirm ? 'Hide confirm password' : 'Show confirm password'}
                    >
                      {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button type="submit" isLoading={isChangingPassword}>
                      Update Password
                    </Button>
                  </div>
                </form>
              </>
            )}

            {activeTab === 'privacy' && (
              <>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Privacy Options</h2>
                <div className="space-y-6">
                  <div className="pt-1 border-t border-gray-100 dark:border-dark-border">
                    <h4 className="font-semibold text-error-600 mb-2">Danger Zone</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Deleting your account will permanently remove your recruiter account, jobs, and related data.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      isLoading={isDeletingAccount}
                      onClick={openDeleteModal}
                      className="border-error-500 text-error-500 hover:bg-error-50 dark:hover:bg-error-900/20"
                    >
                      Delete Account
                    </Button>
                  </div>
                </div>
              </>
            )}

          </Card>
        </div>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title="Confirm Account Deletion"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            This action is permanent. To continue, type <span className="font-semibold text-error-600">DELETE</span> below.
          </p>
          <Input
            label="Type DELETE to confirm"
            value={deleteConfirmationText}
            onChange={(e) => setDeleteConfirmationText(e.target.value)}
            placeholder="DELETE"
            autoFocus
          />
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={closeDeleteModal}
              disabled={isDeletingAccount}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              isLoading={isDeletingAccount}
              disabled={!isDeleteTextValid || isDeletingAccount}
              onClick={handleDeleteAccount}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Settings;
