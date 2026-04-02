import { useEffect, useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Badge from '../ui/Badge';
import { Plus, DollarSign } from 'lucide-react';
import { dataService, Deal, Customer } from '../../data/dummyData';

const STAGES = [
  { id: 'new', label: 'New', color: 'bg-gray-100' },
  { id: 'contacted', label: 'Contacted', color: 'bg-blue-100' },
  { id: 'qualified', label: 'Qualified', color: 'bg-yellow-100' },
  { id: 'proposal', label: 'Proposal', color: 'bg-orange-100' },
  { id: 'negotiation', label: 'Negotiation', color: 'bg-purple-100' },
  { id: 'won', label: 'Won', color: 'bg-green-100' },
];

export default function SalesPipeline() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    value: '',
    customer_id: '',
    status: 'new',
    assigned_to: '',
    probability: '50',
    expected_close_date: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [dealsData, customersData] = await Promise.all([
      dataService.getDeals(),
      dataService.getCustomers(),
    ]);

    setDeals(dealsData);
    setCustomers(customersData);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await dataService.createDeal({
      title: formData.title,
      value: parseFloat(formData.value),
      customer_id: formData.customer_id || undefined,
      status: formData.status,
      assigned_to: formData.assigned_to,
      probability: parseInt(formData.probability),
      expected_close_date: formData.expected_close_date || undefined,
    });

    setIsModalOpen(false);
    setFormData({
      title: '',
      value: '',
      customer_id: '',
      status: 'new',
      assigned_to: '',
      probability: '50',
      expected_close_date: '',
    });
    loadData();
  }

  async function updateDealStatus(dealId: string, newStatus: string) {
    await dataService.updateDealStatus(dealId, newStatus);
    loadData();
  }

  function handleDragStart(deal: Deal) {
    setDraggedDeal(deal);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function handleDrop(status: string) {
    if (draggedDeal) {
      updateDealStatus(draggedDeal.id, status);
      setDraggedDeal(null);
    }
  }

  function getDealsByStatus(status: string) {
    return deals.filter((deal) => deal.status === status);
  }

  function getTotalValue(status: string) {
    return getDealsByStatus(status).reduce((sum, deal) => sum + Number(deal.value || 0), 0);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Sales Pipeline</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track deals through your sales process</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={20} className="mr-2" />
          Add Deal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 overflow-x-auto">
        {STAGES.map((stage) => {
          const stageDeals = getDealsByStatus(stage.id);
          const totalValue = getTotalValue(stage.id);

          return (
            <div
              key={stage.id}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(stage.id)}
              className={`${stage.color} rounded-lg p-4 min-h-[600px]`}
            >
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{stage.label}</h3>
                  <Badge>{stageDeals.length}</Badge>
                </div>
                <p className="text-sm text-gray-600">
                  ${totalValue.toLocaleString()}
                </p>
              </div>

              <div className="space-y-3">
                {stageDeals.map((deal) => (
                  <div
                    key={deal.id}
                    draggable
                    onDragStart={() => handleDragStart(deal)}
                    className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow"
                  >
                    <h4 className="font-medium text-gray-900 mb-2">{deal.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <DollarSign size={16} />
                      <span className="font-semibold">
                        ${Number(deal.value || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge size="sm" variant="info">
                        {deal.probability}%
                      </Badge>
                      {deal.assigned_to && (
                        <span className="text-xs text-gray-500">{deal.assigned_to}</span>
                      )}
                    </div>
                    {deal.expected_close_date && (
                      <p className="text-xs text-gray-500 mt-2">
                        Close: {new Date(deal.expected_close_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Deal" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Deal Title *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <Input
              label="Value *"
              type="number"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              required
            />
            <Select
              label="Customer"
              value={formData.customer_id}
              onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
              options={[
                { value: '', label: 'Select Customer' },
                ...customers.map((c) => ({ value: c.id, label: c.name })),
              ]}
            />
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={STAGES.map((s) => ({ value: s.id, label: s.label }))}
            />
            <Input
              label="Assigned To"
              value={formData.assigned_to}
              onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
            />
            <Input
              label="Probability (%)"
              type="number"
              min="0"
              max="100"
              value={formData.probability}
              onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
            />
            <Input
              label="Expected Close Date"
              type="date"
              value={formData.expected_close_date}
              onChange={(e) => setFormData({ ...formData, expected_close_date: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Deal</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
