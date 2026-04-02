import { useEffect, useState } from 'react';
import Card, { CardHeader } from '../ui/Card';
import { TrendingUp, Users, DollarSign, Target, Award } from 'lucide-react';
import { dataService } from '../../data/dummyData';

interface Stats {
  totalLeads: number;
  totalCustomers: number;
  totalDeals: number;
  totalRevenue: number;
  avgDealSize: number;
  conversionRate: number;
  wonDeals: number;
  lostDeals: number;
}

export default function Reports() {
  const [stats, setStats] = useState<Stats>({
    totalLeads: 0,
    totalCustomers: 0,
    totalDeals: 0,
    totalRevenue: 0,
    avgDealSize: 0,
    conversionRate: 0,
    wonDeals: 0,
    lostDeals: 0,
  });
  const [leadsBySource, setLeadsBySource] = useState<Record<string, number>>({});
  const [dealsByStatus, setDealsByStatus] = useState<Record<string, number>>({});

  useEffect(() => {
    loadReportData();
  }, []);

  async function loadReportData() {
    const [leads, customers, deals] = await Promise.all([
      dataService.getLeads(),
      dataService.getCustomers(),
      dataService.getDeals(),
    ]);

    const wonDeals = deals.filter((d) => d.status === 'won');
    const lostDeals = deals.filter((d) => d.status === 'lost');
    const totalRevenue = wonDeals.reduce((sum, d) => sum + Number(d.value || 0), 0);
    const avgDealSize = wonDeals.length > 0 ? totalRevenue / wonDeals.length : 0;

    setStats({
      totalLeads: leads.length,
      totalCustomers: customers.length,
      totalDeals: deals.length,
      totalRevenue,
      avgDealSize,
      conversionRate: leads.length > 0 ? (wonDeals.length / leads.length) * 100 : 0,
      wonDeals: wonDeals.length,
      lostDeals: lostDeals.length,
    });

    const sourceCount: Record<string, number> = {};
    leads.forEach((lead) => {
      sourceCount[lead.source] = (sourceCount[lead.source] || 0) + 1;
    });
    setLeadsBySource(sourceCount);

    const statusCount: Record<string, number> = {};
    deals.forEach((deal) => {
      statusCount[deal.status] = (statusCount[deal.status] || 0) + 1;
    });
    setDealsByStatus(statusCount);
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Reports & Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Insights and performance metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Leads</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats.totalLeads}</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users size={24} className="text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Customers</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats.totalCustomers}</h3>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Award size={24} className="text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <h3 className="text-3xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</h3>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <DollarSign size={24} className="text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Conversion Rate</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats.conversionRate.toFixed(1)}%</h3>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <TrendingUp size={24} className="text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Leads by Source" subtitle="Distribution of lead sources" />
          <div className="space-y-4">
            {Object.entries(leadsBySource).map(([source, count]) => {
              const percentage = stats.totalLeads > 0 ? (count / stats.totalLeads) * 100 : 0;
              return (
                <div key={source}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 capitalize">{source}</span>
                    <span className="text-sm text-gray-600">{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
            {Object.keys(leadsBySource).length === 0 && (
              <p className="text-gray-500 text-center py-8">No data available</p>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title="Deals by Status" subtitle="Pipeline distribution" />
          <div className="space-y-4">
            {Object.entries(dealsByStatus).map(([status, count]) => {
              const percentage = stats.totalDeals > 0 ? (count / stats.totalDeals) * 100 : 0;
              const colors: Record<string, string> = {
                new: 'bg-gray-600',
                contacted: 'bg-blue-600',
                qualified: 'bg-yellow-600',
                proposal: 'bg-orange-600',
                negotiation: 'bg-purple-600',
                won: 'bg-green-600',
                lost: 'bg-red-600',
              };
              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 capitalize">{status}</span>
                    <span className="text-sm text-gray-600">{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${colors[status] || 'bg-gray-600'} h-2 rounded-full transition-all`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
            {Object.keys(dealsByStatus).length === 0 && (
              <p className="text-gray-500 text-center py-8">No data available</p>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader title="Average Deal Size" />
          <div className="text-center py-8">
            <h2 className="text-4xl font-bold text-gray-900">{formatCurrency(stats.avgDealSize)}</h2>
            <p className="text-sm text-gray-600 mt-2">Per won deal</p>
          </div>
        </Card>

        <Card>
          <CardHeader title="Win Rate" />
          <div className="text-center py-8">
            <h2 className="text-4xl font-bold text-green-600">
              {stats.totalDeals > 0 ? ((stats.wonDeals / stats.totalDeals) * 100).toFixed(1) : 0}%
            </h2>
            <p className="text-sm text-gray-600 mt-2">{stats.wonDeals} won / {stats.totalDeals} total</p>
          </div>
        </Card>

        <Card>
          <CardHeader title="Active Pipeline" />
          <div className="text-center py-8">
            <div className="flex items-center justify-center gap-2">
              <Target size={32} className="text-blue-600" />
              <h2 className="text-4xl font-bold text-gray-900">
                {stats.totalDeals - stats.wonDeals - stats.lostDeals}
              </h2>
            </div>
            <p className="text-sm text-gray-600 mt-2">Active deals</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
