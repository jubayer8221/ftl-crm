import { useEffect, useState } from 'react';
import Card, { CardHeader } from '../ui/Card';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Table from '../ui/Table';
import Badge from '../ui/Badge';
import { Plus, Mail, Phone, Building, ArrowLeft } from 'lucide-react';
import { dataService, Customer, Deal, Activity } from '../../data/dummyData';

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerDeals, setCustomerDeals] = useState<Deal[]>([]);
  const [customerActivities, setCustomerActivities] = useState<Activity[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    industry: '',
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      loadCustomerDetails(selectedCustomer.id);
    }
  }, [selectedCustomer]);

  async function loadCustomers() {
    const data = await dataService.getCustomers();
    setCustomers(data);
  }

  async function loadCustomerDetails(customerId: string) {
    const [dealsData, activitiesData] = await Promise.all([
      dataService.getCustomerDeals(customerId),
      dataService.getCustomerActivities(customerId),
    ]);

    setCustomerDeals(dealsData);
    setCustomerActivities(activitiesData);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await dataService.createCustomer(formData);
    setIsModalOpen(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      address: '',
      industry: '',
    });
    loadCustomers();
  }

  async function addActivity(type: string) {
    if (!selectedCustomer) return;

    await dataService.createActivity({
      type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} with ${selectedCustomer.name}`,
      description: `Added new ${type} activity`,
      related_to_type: 'customer',
      related_to_id: selectedCustomer.id,
      created_by: 'Admin User',
    });

    loadCustomerDetails(selectedCustomer.id);
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'company', header: 'Company' },
    { key: 'industry', header: 'Industry' },
  ];

  if (selectedCustomer) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setSelectedCustomer(null)}>
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{selectedCustomer.name}</h1>
            <p className="text-gray-600 mt-1">{selectedCustomer.company}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader title="Contact Information" />
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{selectedCustomer.email || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={20} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{selectedCustomer.phone || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building size={20} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Industry</p>
                  <p className="font-medium">{selectedCustomer.industry || 'N/A'}</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader
                title="Associated Deals"
                action={
                  <Badge>{customerDeals.length} {customerDeals.length === 1 ? 'Deal' : 'Deals'}</Badge>
                }
              />
              <div className="space-y-2">
                {customerDeals.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No deals yet</p>
                ) : (
                  customerDeals.map((deal) => (
                    <div key={deal.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{deal.title}</p>
                        <p className="text-sm text-gray-600">
                          ${deal.value.toLocaleString()}
                        </p>
                      </div>
                      <Badge variant={deal.status === 'won' ? 'success' : 'default'}>
                        {deal.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card>
              <CardHeader
                title="Activity Timeline"
                action={
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => addActivity('call')}>
                      Call
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => addActivity('email')}>
                      Email
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => addActivity('meeting')}>
                      Meeting
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => addActivity('note')}>
                      Note
                    </Button>
                  </div>
                }
              />
              <div className="space-y-4">
                {customerActivities.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No activities yet</p>
                ) : (
                  customerActivities.map((activity) => (
                    <div key={activity.id} className="flex gap-4 border-l-2 border-blue-500 pl-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge size="sm">{activity.type}</Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(activity.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">by {activity.created_by}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Customers</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your customer relationships</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={20} className="mr-2" />
          Add Customer
        </Button>
      </div>

      <Card>
        <div className="mb-6">
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Table
          columns={columns}
          data={filteredCustomers}
          onRowClick={(row) => setSelectedCustomer(row as unknown as Customer)}
        />
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Customer" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <Input
              label="Company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
            <Input
              label="Industry"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            />
            <Input
              label="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Customer</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
