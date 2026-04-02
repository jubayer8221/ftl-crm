import { LayoutDashboard, Users, CircleUser as UserCircle, Target, CheckSquare, BarChart3, Settings, PanelRightOpen, PanelRightClose, } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'customers', label: 'Customers', icon: UserCircle },
    { id: 'pipeline', label: 'Sales Pipeline', icon: Target },
    { id: 'tasks', label: 'Tasks & Activities', icon: CheckSquare },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div
      className={`bg-gray-900 text-white h-screen sticky top-0 transition-all duration-300 flex flex-col ${isCollapsed ? 'w-20' : 'w-64'
        }`}
    >
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && <h1 className="text-2xl font-bold">CRM</h1>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors ml-auto"
        >
          {isCollapsed ? <PanelRightClose size={20} /> : <PanelRightOpen size={20} />}
        </button>
      </div>

      <nav className="flex-1 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg mb-1 transition-colors ${isActive
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
            >
              <Icon size={20} />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {!isCollapsed && (
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
              <UserCircle size={24} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">Admin User</p>
              <p className="text-xs text-gray-400">admin@crm.com</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
