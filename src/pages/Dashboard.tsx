import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  LineChart, Line, ResponsiveContainer 
} from 'recharts';
import { useStore } from '../store';
import { format, parseISO, subDays } from 'date-fns';
import { Filter, Download } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { exportDashboardData } from '../utils/exportData';

export function Dashboard() {
  const { 
    rawMaterials, 
    lots, 
    processedBatches, 
    finalProducts,
    qualityChecks 
  } = useStore();
  const { user } = useAuthStore();

  const [dateRange, setDateRange] = React.useState('7d');
  const canExport = user?.role === 'supervisor' || user?.role === 'management' || user?.role === 'admin';

  // Calculate date ranges
  const endDate = new Date();
  const startDate = subDays(endDate, dateRange === '7d' ? 7 : 30);

  // Process data for charts
  const processedData = processedBatches
    .filter(batch => {
      const date = parseISO(batch.processDate);
      return date >= startDate && date <= endDate;
    })
    .reduce((acc, batch) => {
      const date = format(parseISO(batch.processDate), 'MMM d');
      if (!acc[date]) {
        acc[date] = { date, shellOn: 0, meat: 0 };
      }
      if (batch.productType === 'shell-on') {
        acc[date].shellOn += batch.quantity;
      } else {
        acc[date].meat += batch.quantity;
      }
      return acc;
    }, {} as Record<string, any>);

  const chartData = Object.values(processedData);

  // Calculate yield data
  const yieldData = lots.map(lot => {
    const rawMaterialQuantity = lot.totalQuantity;
    const processedQuantity = processedBatches
      .filter(batch => batch.lotId === lot.id)
      .reduce((sum, batch) => sum + batch.quantity, 0);
    
    return {
      lot: lot.lotNumber,
      yield: ((processedQuantity / rawMaterialQuantity) * 100).toFixed(2)
    };
  });

  // Calculate quality metrics
  const qualityMetrics = {
    passed: qualityChecks.filter(check => check.status === 'passed').length,
    failed: qualityChecks.filter(check => check.status === 'failed').length,
    total: qualityChecks.length
  };

  const handleExport = () => {
    exportDashboardData(rawMaterials, lots, processedBatches, finalProducts, qualityChecks);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          {canExport && (
            <button
              onClick={handleExport}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </button>
          )}
        </div>
      </div>

      {/* Rest of the dashboard components remain the same */}
      {/* Production Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Production Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="shellOn" name="Shell-On" fill="#4F46E5" />
                <Bar dataKey="meat" name="Meat" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Yield Analysis */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Yield Analysis</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yieldData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="lot" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="yield" stroke="#4F46E5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quality Metrics */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quality Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Pass Rate</span>
              <span className="text-lg font-medium text-green-600">
                {qualityMetrics.total > 0
                  ? ((qualityMetrics.passed / qualityMetrics.total) * 100).toFixed(1)
                  : 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-green-600 h-2.5 rounded-full"
                style={{
                  width: `${qualityMetrics.total > 0
                    ? (qualityMetrics.passed / qualityMetrics.total) * 100
                    : 0}%`
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Passed</p>
                <p className="text-xl font-semibold text-green-600">
                  {qualityMetrics.passed}
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Failed</p>
                <p className="text-xl font-semibold text-red-600">
                  {qualityMetrics.failed}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[...processedBatches].reverse().slice(0, 5).map(batch => (
            <div key={batch.id} className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {batch.productType === 'shell-on' ? 'Shell-On Batch' : 'Meat Batch'} Processed
                </p>
                <p className="text-sm text-gray-500">
                  Quantity: {batch.quantity}kg | Boxes: {batch.boxCount}
                </p>
              </div>
              <span className="text-sm text-gray-500">
                {format(parseISO(batch.processDate), 'MMM d, yyyy')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}