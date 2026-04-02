import { useState } from 'react';
import Card, { CardHeader } from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Save } from 'lucide-react';
import { useToast } from '../ui/Toast';

export default function Settings() {
  const { addToast } = useToast();
  const [profileData, setProfileData] = useState({
    name: 'Admin User',
    email: 'admin@crm.com',
    phone: '+1 (555) 123-4567',
  });
  const [companyData, setCompanyData] = useState({
    name: 'CRM Inc.',
    industry: 'Technology',
    website: 'https://crmapro.com',
  });
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [notifications, setNotifications] = useState({
    newLeads: true,
    dealUpdates: true,
    dailySummary: false,
    taskReminders: true,
  });

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      addToast('Profile updated successfully!', 'success');
    } catch {
      addToast('Failed to update profile. Please try again.', 'error');
    }
  }

  async function handleCompanySubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      addToast('Company information updated successfully!', 'success');
    } catch {
      addToast('Failed to update company information. Please try again.', 'error');
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      addToast('New passwords do not match.', 'error');
      return;
    }
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      addToast('Password updated successfully!', 'success');
      setPasswordData({ current: '', new: '', confirm: '' });
    } catch {
      addToast('Failed to update password. Please try again.', 'error');
    }
  }

  async function handleNotificationsSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      addToast('Notification preferences updated successfully!', 'success');
    } catch {
      addToast('Failed to update preferences. Please try again.', 'error');
    }
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account and application settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Profile Settings" />
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <Input
              label="Full Name"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
            />
            <Input
              label="Phone"
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
            />
            <Button type="submit">
              <Save size={20} className="mr-2" />
              Save Changes
            </Button>
          </form>
        </Card>

        <Card>
          <CardHeader title="Company Information" />
          <form onSubmit={handleCompanySubmit} className="space-y-4">
            <Input
              label="Company Name"
              value={companyData.name}
              onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
            />
            <Input
              label="Industry"
              value={companyData.industry}
              onChange={(e) => setCompanyData({ ...companyData, industry: e.target.value })}
            />
            <Input
              label="Website"
              value={companyData.website}
              onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
            />
            <Button type="submit">
              <Save size={20} className="mr-2" />
              Save Changes
            </Button>
          </form>
        </Card>

        <Card>
          <CardHeader title="Notification Preferences" />
          <form onSubmit={handleNotificationsSubmit} className="space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 rounded"
                checked={notifications.newLeads}
                onChange={(e) => setNotifications({ ...notifications, newLeads: e.target.checked })}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Email notifications for new leads</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 rounded"
                checked={notifications.dealUpdates}
                onChange={(e) => setNotifications({ ...notifications, dealUpdates: e.target.checked })}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Notifications for deal updates</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 rounded"
                checked={notifications.dailySummary}
                onChange={(e) => setNotifications({ ...notifications, dailySummary: e.target.checked })}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Daily summary reports</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 rounded"
                checked={notifications.taskReminders}
                onChange={(e) => setNotifications({ ...notifications, taskReminders: e.target.checked })}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Task reminders</span>
            </label>
            <Button type="submit">
              <Save size={20} className="mr-2" />
              Save Preferences
            </Button>
          </form>
        </Card>

        <Card>
          <CardHeader title="Security" />
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              value={passwordData.current}
              onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
            />
            <Input
              label="New Password"
              type="password"
              value={passwordData.new}
              onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={passwordData.confirm}
              onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
            />
            <Button type="submit">
              <Save size={20} className="mr-2" />
              Update Password
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
