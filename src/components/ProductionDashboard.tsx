import React from 'react';
import { useStore } from '../store';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer 
} from 'recharts';
import { Shell, Package, CheckCircle } from 'lucide-react';

export function ProductionDashboard() {
  const { lots, processedBatches, qualityChecks } = useStore();

  const activeLotCount = lots.filter(lot => lot.status === 'active').length;
  const completedLotCount = lots.filter(lot => lot.status === 'completed').length;
  const totalProcessedQuantity = processedBatches.reduce((sum, batch) => sum + batch.quantity, 0);
  const passedQualityChecks = qualityChecks.filter(check => check.status === 'passed').length;

  const processedData = processedBatches.reduce((acc, batch) => {
    const date = new Date(batch.processDate).toLocaleDateString();
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

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Shell className="h-8 w-8 text-indigo-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Lots</p>
              <p className="text-2xl font-semibold text-gray-900">{activeLotCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completed Lots</p>
              <p className="text-2xl font-semibold text-gray-900">{completedLotCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Shell className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Processed</p>
              <p className="text-2xl font-semibold text-gray-900">{totalProcessedQuantity}kg</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Quality Checks Passed</p>
              <p className="text-2xl font-semibold text-gray-900">{passedQualityChecks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Production Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Production Overview</h3>
        <div className="h-80">
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

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium text-gray-900">Recent Production Activity</h3>
        </div>
        <div className="border-t border-gray-200 divide-y divide-gray-200">
          {processedBatches.slice(0, 5).map(batch => (
            <div key={batch.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {batch.productType === 'shell-on' ? 'Shell-On' : 'Meat'} Processing
                  </p>
                  <p className="text-sm text-gray-500">
                    Lot #{batch.lotId.slice(0, 8)} - {batch.quantity}kg
                  </p>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(batch.processDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}