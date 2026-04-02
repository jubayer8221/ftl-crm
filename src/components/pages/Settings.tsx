import Card, { CardHeader } from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Save } from 'lucide-react';

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account and application settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Profile Settings" />
          <form className="space-y-4">
            <Input label="Full Name" defaultValue="Admin User" />
            <Input label="Email" type="email" defaultValue="admin@crm.com" />
            <Input label="Phone" defaultValue="+1 (555) 123-4567" />
            <Button>
              <Save size={20} className="mr-2" />
              Save Changes
            </Button>
          </form>
        </Card>

        <Card>
          <CardHeader title="Company Information" />
          <form className="space-y-4">
            <Input label="Company Name" defaultValue="CRM Inc." />
            <Input label="Industry" defaultValue="Technology" />
            <Input label="Website" defaultValue="https://crmapro.com" />
            <Button>
              <Save size={20} className="mr-2" />
              Save Changes
            </Button>
          </form>
        </Card>

        <Card>
          <CardHeader title="Notification Preferences" />
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
              <span className="text-sm text-gray-700">Email notifications for new leads</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
              <span className="text-sm text-gray-700">Notifications for deal updates</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm text-gray-700">Daily summary reports</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
              <span className="text-sm text-gray-700">Task reminders</span>
            </label>
            <Button>
              <Save size={20} className="mr-2" />
              Save Preferences
            </Button>
          </div>
        </Card>

        <Card>
          <CardHeader title="Security" />
          <form className="space-y-4">
            <Input label="Current Password" type="password" />
            <Input label="New Password" type="password" />
            <Input label="Confirm New Password" type="password" />
            <Button>
              <Save size={20} className="mr-2" />
              Update Password
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
