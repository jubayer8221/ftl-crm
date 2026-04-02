export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  source: string;
  assigned_to: string;
  notes?: string;
  created_at: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  industry: string;
  created_at: string;
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  customer_id?: string;
  status: string;
  assigned_to: string;
  probability: number;
  expected_close_date?: string;
  created_at: string;
}

export interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  created_at: string;
  created_by: string;
  related_to_type?: string;
  related_to_id?: string;
}

export interface Task {
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

const randomId = () => `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

let leads: Lead[] = [
  { id: 'l1', name: 'Jamie Parker', email: 'jamie@startup.com', phone: '+1-555-0101', company: 'Nimble Apps', status: 'new', source: 'website', assigned_to: 'Ava White', notes: 'First contact via chat.', created_at: '2026-03-20T09:24:00Z' },
  { id: 'l2', name: 'Maya Singh', email: 'maya@enterprise.com', phone: '+1-555-0115', company: 'EdgeCorp', status: 'contacted', source: 'referral', assigned_to: 'Liam Carter', notes: 'Requested pricing', created_at: '2026-03-25T11:07:00Z' },
  { id: 'l3', name: 'Noah Kim', email: 'noah@finance.io', phone: '+1-555-0123', company: 'FinEdge', status: 'qualified', source: 'email', assigned_to: 'Zoe Fields', notes: 'Ready for proposal', created_at: '2026-03-28T14:30:00Z' },
];

let customers: Customer[] = [
  { id: 'c1', name: 'Sara Johnson', email: 'sara@innovate.com', phone: '+1-555-0199', company: 'InnovateX', address: '123 Market St, San Francisco, CA', industry: 'Technology', created_at: '2026-01-18T10:00:00Z' },
  { id: 'c2', name: 'Kevin Wu', email: 'kevin@bankcorp.com', phone: '+1-555-0177', company: 'BankCorp', address: '450 2nd Ave, New York, NY', industry: 'Finance', created_at: '2026-02-08T15:20:00Z' },
];

let deals: Deal[] = [
  { id: 'd1', title: 'Enterprise CRM Implementation', value: 52000, customer_id: 'c1', status: 'proposal', assigned_to: 'Ava White', probability: 60, expected_close_date: '2026-04-15', created_at: '2026-02-25T12:00:00Z' },
  { id: 'd2', title: 'Q2 Upsell Package', value: 18000, customer_id: 'c2', status: 'negotiation', assigned_to: 'Liam Carter', probability: 75, expected_close_date: '2026-04-10', created_at: '2026-03-04T09:00:00Z' },
  { id: 'd3', title: 'Small Business Starter', value: 7200, customer_id: 'c1', status: 'won', assigned_to: 'Zoe Fields', probability: 100, expected_close_date: '2026-03-30', created_at: '2026-02-10T11:30:00Z' },
];

let activities: Activity[] = [
  { id: 'a1', type: 'call', title: 'Follow-up with Jamie', description: 'Discussed product roadmap and timeline.', created_at: '2026-03-28T09:45:00Z', created_by: 'Ava White', related_to_type: 'lead', related_to_id: 'l1' },
  { id: 'a2', type: 'email', title: 'Proposal sent to Maya', description: 'Q1 discount applied.', created_at: '2026-03-27T16:00:00Z', created_by: 'Liam Carter', related_to_type: 'lead', related_to_id: 'l2' },
  { id: 'a3', type: 'meeting', title: 'Product demo with Noah', description: 'Live demo completed, next steps set.', created_at: '2026-03-26T13:30:00Z', created_by: 'Zoe Fields', related_to_type: 'lead', related_to_id: 'l3' },
];

let tasks: Task[] = [
  { id: 't1', title: 'Prepare Q2 deck', description: 'Sales deck review and update.', status: 'pending', priority: 'high', due_date: '2026-04-04', assigned_to: 'Ava White', related_to_type: 'deal', created_at: '2026-03-28T08:00:00Z' },
  { id: 't2', title: 'Customer outreach', description: 'Check in with BankCorp on open deal.', status: 'in_progress', priority: 'medium', due_date: '2026-04-06', assigned_to: 'Liam Carter', related_to_type: 'customer', created_at: '2026-03-29T11:00:00Z' },
  { id: 't3', title: 'Data import test', description: 'Validate leads upload from CSV.', status: 'completed', priority: 'low', due_date: '2026-03-31', assigned_to: 'Zoe Fields', related_to_type: 'project', created_at: '2026-03-25T09:05:00Z' },
];

const delay = async <T>(value: T, ms = 250): Promise<T> => new Promise((resolve) => setTimeout(() => resolve(value), ms));

export const dataService = {
  // Lead services
  getLeads: async () => delay([...leads]),
  createLead: async (lead: Omit<Lead, 'id' | 'created_at'>) => {
    const newLead: Lead = { ...lead, id: randomId(), created_at: new Date().toISOString() };
    leads = [newLead, ...leads];
    return delay(newLead);
  },
  updateLead: async (id: string, updated: Partial<Lead>) => {
    leads = leads.map((lead) => (lead.id === id ? { ...lead, ...updated } : lead));
    return delay(leads.find((lead) => lead.id === id) || null);
  },

  // Customer services
  getCustomers: async () => delay([...customers]),
  createCustomer: async (customer: Omit<Customer, 'id' | 'created_at'>) => {
    const newCustomer: Customer = { ...customer, id: randomId(), created_at: new Date().toISOString() };
    customers = [newCustomer, ...customers];
    return delay(newCustomer);
  },
  getCustomerDeals: async (customerId: string) => delay(deals.filter((deal) => deal.customer_id === customerId)),
  getCustomerActivities: async (customerId: string) => delay(activities.filter((activity) => activity.related_to_type === 'customer' && activity.related_to_id === customerId)),

  // Deal services
  getDeals: async () => delay([...deals]),
  createDeal: async (deal: Omit<Deal, 'id' | 'created_at'>) => {
    const newDeal: Deal = { ...deal, id: randomId(), created_at: new Date().toISOString() };
    deals = [newDeal, ...deals];
    return delay(newDeal);
  },
  updateDealStatus: async (id: string, status: string) => {
    deals = deals.map((deal) => (deal.id === id ? { ...deal, status } : deal));
    return delay(deals.find((deal) => deal.id === id) || null);
  },

  // Activity services
  getActivities: async () => delay([...activities].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())),
  createActivity: async (activity: Omit<Activity, 'id' | 'created_at'>) => {
    const newActivity: Activity = { ...activity, id: randomId(), created_at: new Date().toISOString() };
    activities = [newActivity, ...activities];
    return delay(newActivity);
  },

  // Task services
  getTasks: async () => delay([...tasks].sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())),
  createTask: async (task: Omit<Task, 'id' | 'created_at'>) => {
    const newTask: Task = { ...task, id: randomId(), created_at: new Date().toISOString() };
    tasks = [newTask, ...tasks];
    return delay(newTask);
  },
  updateTaskStatus: async (id: string, status: string) => {
    tasks = tasks.map((task) => (task.id === id ? { ...task, status } : task));
    return delay(tasks.find((task) => task.id === id) || null);
  },
};
