import { useEffect, useState } from 'react';
import Card, { CardHeader } from '../ui/Card';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Badge from '../ui/Badge';
import { Plus, CheckCircle2, Circle, Clock } from 'lucide-react';
import { dataService } from '../../data/dummyData';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
  assigned_to: string;
  related_to_type: string;
  created_at: string;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    due_date: '',
    assigned_to: '',
    related_to_type: '',
  });

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    filterTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks, filterStatus, filterPriority]);

  async function loadTasks() {
    const data = await dataService.getTasks();
    setTasks(data);
  }

  function filterTasks() {
    let filtered = [...tasks];

    if (filterStatus !== 'all') {
      filtered = filtered.filter((task) => task.status === filterStatus);
    }

    if (filterPriority !== 'all') {
      filtered = filtered.filter((task) => task.priority === filterPriority);
    }

    setFilteredTasks(filtered);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await dataService.createTask(formData);

    setIsModalOpen(false);
    setFormData({
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      due_date: '',
      assigned_to: '',
      related_to_type: '',
    });
    loadTasks();
  }

  async function toggleTaskStatus(task: Task) {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    await dataService.updateTaskStatus(task.id, newStatus);
    loadTasks();
  }

  const getPriorityVariant = (priority: string) => {
    if (priority === 'high') return 'danger';
    if (priority === 'medium') return 'warning';
    return 'default';
  };

  // const getStatusVariant = (status: string) => {
  //   if (status === 'completed') return 'success';
  //   if (status === 'in_progress') return 'info';
  //   return 'default';
  // };

  const groupedTasks = {
    pending: filteredTasks.filter((t) => t.status === 'pending'),
    in_progress: filteredTasks.filter((t) => t.status === 'in_progress'),
    completed: filteredTasks.filter((t) => t.status === 'completed'),
  };

  const tasksByDate: Record<string, Task[]> = filteredTasks.reduce((acc, task) => {
    if (!task.due_date) return acc;
    const key = task.due_date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const sortedDates = Object.keys(tasksByDate).sort().slice(0, 14);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Tasks & Activities</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your tasks and stay organized</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={20} className="mr-2" />
          Add Task
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-2 rounded-lg text-sm transition ${viewMode === 'list'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            List View
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-3 py-2 rounded-lg text-sm transition ${viewMode === 'calendar'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Calendar View
          </button>
        </div>

        <div className="flex gap-4 flex-1 min-w-[330px]">
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'pending', label: 'Pending' },
              { value: 'in_progress', label: 'In Progress' },
              { value: 'completed', label: 'Completed' },
            ]}
          />
          <Select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            options={[
              { value: 'all', label: 'All Priorities' },
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
            ]}
          />
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader title="Pending" action={<Badge>{groupedTasks.pending.length}</Badge>} />
            <div className="space-y-2">
              {groupedTasks.pending.map((task) => (
                <div
                  key={task.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-2 flex-1">
                      <button
                        onClick={() => toggleTaskStatus(task)}
                        className="mt-1 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Circle size={20} />
                      </button>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                        {task.description && (
                          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-7">
                    <Badge size="sm" variant={getPriorityVariant(task.priority)}>
                      {task.priority}
                    </Badge>
                    {task.due_date && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={14} />
                        {new Date(task.due_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {groupedTasks.pending.length === 0 && (
                <p className="text-gray-500 text-center py-8">No pending tasks</p>
              )}
            </div>
          </Card>

          <Card>
            <CardHeader title="In Progress" action={<Badge variant="info">{groupedTasks.in_progress.length}</Badge>} />
            <div className="space-y-2">
              {groupedTasks.in_progress.map((task) => (
                <div
                  key={task.id}
                  className="p-4 border border-blue-200 bg-blue-50 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-2 flex-1">
                      <button
                        onClick={() => toggleTaskStatus(task)}
                        className="mt-1 text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <Circle size={20} className="fill-blue-600" />
                      </button>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                        {task.description && (
                          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-7">
                    <Badge size="sm" variant={getPriorityVariant(task.priority)}>
                      {task.priority}
                    </Badge>
                    {task.due_date && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={14} />
                        {new Date(task.due_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {groupedTasks.in_progress.length === 0 && (
                <p className="text-gray-500 text-center py-8">No tasks in progress</p>
              )}
            </div>
          </Card>

          <Card>
            <CardHeader title="Completed" action={<Badge variant="success">{groupedTasks.completed.length}</Badge>} />
            <div className="space-y-2">
              {groupedTasks.completed.map((task) => (
                <div
                  key={task.id}
                  className="p-4 border border-green-200 bg-green-50 rounded-lg hover:shadow-md transition-shadow opacity-75"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-2 flex-1">
                      <button
                        onClick={() => toggleTaskStatus(task)}
                        className="mt-1 text-green-600 hover:text-green-700 transition-colors"
                      >
                        <CheckCircle2 size={20} />
                      </button>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 line-through">{task.title}</h4>
                        {task.description && (
                          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-7">
                    <Badge size="sm" variant={getPriorityVariant(task.priority)}>
                      {task.priority}
                    </Badge>
                    {task.due_date && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={14} />
                        {new Date(task.due_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {groupedTasks.completed.length === 0 && (
                <p className="text-gray-500 text-center py-8">No completed tasks</p>
              )}
            </div>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader title="Calendar View" subtitle="Upcoming two weeks" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedDates.length === 0 && (
              <p className="text-gray-500 text-center py-8">No tasks scheduled</p>
            )}
            {sortedDates.map((date) => (
              <div key={date} className="rounded-lg border border-gray-200 p-4 bg-white">
                <h4 className="font-semibold text-gray-800 mb-2">
                  {new Date(date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                </h4>
                <div className="space-y-2">
                  {tasksByDate[date]?.map((task) => (
                    <div key={task.id} className="p-3 border border-gray-100 rounded-lg hover:shadow-sm transition-colors">
                      <h5 className="font-medium text-gray-900">{task.title}</h5>
                      <p className="text-xs text-gray-500">{task.status.replace('_', ' ')} • {task.priority}</p>
                      <p className="text-sm text-gray-600 mt-1">{task.description || 'No description'}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Task" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Task Title *"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'pending', label: 'Pending' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' },
              ]}
            />
            <Select
              label="Priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
              ]}
            />
            <Input
              label="Due Date"
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
            />
            <Input
              label="Assigned To"
              value={formData.assigned_to}
              onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Task</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
