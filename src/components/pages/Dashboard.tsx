import { useEffect, useState } from 'react';
import Card, { CardHeader } from '../ui/Card';
import { TrendingUp, Users, DollarSign, Target, Clock } from 'lucide-react';
import { dataService } from '../../data/dummyData';
import Badge from '../ui/Badge';

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  trend: 'up' | 'down';
}

function KPICard({ title, value, change, icon: Icon, trend }: KPICardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</h3>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp
              size={16}
              className={trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400 rotate-180'}
            />
            <span
              className={`text-sm font-medium ${trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}
            >
              {change}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">vs last month</span>
          </div>
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
          <Icon size={24} className="text-blue-600 dark:text-blue-400" />
        </div>
      </div>
    </Card>
  );
}

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  created_at: string;
}

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  due_date: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalLeads: 0,
    revenue: 0,
    conversionRate: 0,
    activeDeals: 0,
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    const [leadsData, dealsData, activitiesData, tasksData] = await Promise.all([
      dataService.getLeads(),
      dataService.getDeals(),
      dataService.getActivities(),
      dataService.getTasks(),
    ]);

    const wonDeals = dealsData.filter((d) => d.status === 'won');
    const totalRevenue = wonDeals.reduce((sum, d) => sum + Number(d.value || 0), 0);
    const activeDeals = dealsData.filter((d) => d.status !== 'won' && d.status !== 'lost').length;

    setStats({
      totalLeads: leadsData.length,
      revenue: totalRevenue,
      conversionRate: leadsData.length > 0 ? (wonDeals.length / leadsData.length) * 100 : 0,
      activeDeals,
    });

    setActivities(activitiesData.slice(0, 5));
    setTasks(tasksData.slice(0, 5));
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getActivityIcon = (type: string) => {
    const icons: Record<string, string> = {
      call: '📞',
      email: '📧',
      meeting: '🤝',
      note: '📝',
    };
    return icons[type] || '📋';
  };

  const getPriorityVariant = (priority: string) => {
    if (priority === 'high') return 'danger';
    if (priority === 'medium') return 'warning';
    return 'default';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Leads"
          value={stats.totalLeads.toString()}
          change="+12.5%"
          icon={Users}
          trend="up"
        />
        <KPICard
          title="Sales Revenue"
          value={formatCurrency(stats.revenue)}
          change="+23.1%"
          icon={DollarSign}
          trend="up"
        />
        <KPICard
          title="Conversion Rate"
          value={`${stats.conversionRate.toFixed(1)}%`}
          change="+4.3%"
          icon={TrendingUp}
          trend="up"
        />
        <KPICard
          title="Active Deals"
          value={stats.activeDeals.toString()}
          change="-2.4%"
          icon={Target}
          trend="down"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Sales Trends" subtitle="Last 6 months" />
          <div className="h-64 flex items-end justify-between gap-2 px-4">
            {[65, 75, 60, 80, 90, 85].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600" style={{ height: `${height}%` }}></div>
                <span className="text-xs text-gray-500">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Recent Activities" />
          <div className="space-y-3">
            {activities.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No recent activities</p>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="flex gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Upcoming Tasks" subtitle="Next 5 tasks due" />
        <div className="space-y-2">
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No upcoming tasks</p>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <Clock size={20} className="text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{task.title}</p>
                    <p className="text-sm text-gray-500">
                      Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getPriorityVariant(task.priority)}>
                    {task.priority}
                  </Badge>
                  <Badge variant={task.status === 'completed' ? 'success' : 'default'}>
                    {task.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
