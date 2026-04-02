import { useEffect, useState, useCallback } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Table from '../ui/Table';
import Badge from '../ui/Badge';
import { Plus, Filter } from 'lucide-react';
import { dataService, Lead } from '../../data/dummyData';
import { useToast } from '../ui/Toast';

interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  source: string;
  assigned_to: string;
  notes: string;
}

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSource, setFilterSource] = useState('all');
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'new',
    source: 'website',
    assigned_to: '',
    notes: '',
  });

  const { addToast } = useToast();

  useEffect(() => {
    loadLeads();
  }, []);

  const filterLeads = useCallback(() => {
    let filtered = [...leads];

    if (searchTerm) {
      filtered = filtered.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((lead) => lead.status === filterStatus);
    }

    if (filterSource !== 'all') {
      filtered = filtered.filter((lead) => lead.source === filterSource);
    }

    setFilteredLeads(filtered);
  }, [leads, searchTerm, filterStatus, filterSource]);

  useEffect(() => {
    filterLeads();
  }, [filterLeads]);

  async function loadLeads() {
    const data = await dataService.getLeads();
    setLeads(data);
  }

  function openModal(lead?: Lead) {
    if (lead) {
      setEditingLead(lead);
      setFormData({
        name: lead.name,
        email: lead.email || '',
        phone: lead.phone || '',
        company: lead.company || '',
        status: lead.status,
        source: lead.source,
        assigned_to: lead.assigned_to || '',
        notes: '',
      });
    } else {
      setEditingLead(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        status: 'new',
        source: 'website',
        assigned_to: '',
        notes: '',
      });
    }
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingLead(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      if (editingLead) {
        await dataService.updateLead(editingLead.id, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          status: formData.status,
          source: formData.source,
          assigned_to: formData.assigned_to,
          notes: formData.notes,
        });
        addToast('Lead updated successfully!', 'success');
      } else {
        await dataService.createLead({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          status: formData.status,
          source: formData.source,
          assigned_to: formData.assigned_to,
          notes: formData.notes,
        });
        addToast('Lead created successfully!', 'success');
      }

      closeModal();
      loadLeads();
    } catch {
      addToast('An error occurred. Please try again.', 'error');
    }
  }

  const getStatusVariant = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
      new: 'info',
      contacted: 'warning',
      qualified: 'success',
      lost: 'danger',
    };
    return variants[status] || 'default';
  };

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'company', header: 'Company' },
    {
      key: 'status',
      header: 'Status',
      render: (value: unknown) => (
        <Badge variant={getStatusVariant(value as string)}>{value as string}</Badge>
      ),
    },
    { key: 'source', header: 'Source' },
    { key: 'assigned_to', header: 'Assigned To' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Leads</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and track your sales leads</p>
        </div>
        <Button onClick={() => openModal()}>
          <Plus size={20} className="mr-2" />
          Add Lead
        </Button>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'new', label: 'New' },
                { value: 'contacted', label: 'Contacted' },
                { value: 'qualified', label: 'Qualified' },
                { value: 'lost', label: 'Lost' },
              ]}
            />
            <Select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              options={[
                { value: 'all', label: 'All Sources' },
                { value: 'website', label: 'Website' },
                { value: 'referral', label: 'Referral' },
                { value: 'social', label: 'Social' },
                { value: 'email', label: 'Email' },
              ]}
            />
            <Button variant="outline">
              <Filter size={20} />
            </Button>
          </div>
        </div>

        <Table columns={columns} data={filteredLeads as unknown as Record<string, unknown>[]} onRowClick={(row) => openModal(row as unknown as Lead)} />
      </Card>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingLead ? 'Edit Lead' : 'Add New Lead'} size="lg">
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
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'new', label: 'New' },
                { value: 'contacted', label: 'Contacted' },
                { value: 'qualified', label: 'Qualified' },
                { value: 'lost', label: 'Lost' },
              ]}
            />
            <Select
              label="Source"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              options={[
                { value: 'website', label: 'Website' },
                { value: 'referral', label: 'Referral' },
                { value: 'social', label: 'Social Media' },
                { value: 'email', label: 'Email Campaign' },
              ]}
            />
            <Input
              label="Assigned To"
              value={formData.assigned_to}
              onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit">{editingLead ? 'Update Lead' : 'Add Lead'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
