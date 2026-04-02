import { useState } from 'react';
import Layout from './components/layout/Layout';
import Dashboard from './components/pages/Dashboard';
import Leads from './components/pages/Leads';
import Customers from './components/pages/Customers';
import SalesPipeline from './components/pages/SalesPipeline';
import Tasks from './components/pages/Tasks';
import Reports from './components/pages/Reports';
import Settings from './components/pages/Settings';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'leads':
        return <Leads />;
      case 'customers':
        return <Customers />;
      case 'pipeline':
        return <SalesPipeline />;
      case 'tasks':
        return <Tasks />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return (
          <div className="p-8 bg-white rounded-lg shadow">
            <h1 className="text-2xl font-semibold">Page not found</h1>
            <p className="text-gray-600">Select a page from the sidebar to continue.</p>
          </div>
        );
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default App;
