import React from 'react';
import { useStore } from '../../store';
import { Shell, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

export function QualityDashboard() {
  const { qualityChecks } = useStore();

  const recentChecks = qualityChecks
    .sort((a, b) => new Date(b.checkedAt).getTime() - new Date(a.checkedAt).getTime())
    .slice(0, 5);

  const stats = {
    total: qualityChecks.length,
    passed: qualityChecks.filter(check => check.status === 'passed').length,
    failed: qualityChecks.filter(check => check.status === 'failed').length,
  };

  const passRate = stats.total > 0 ? (stats.passed / stats.total) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shell className="h-6 w-6 text-indigo-600" />
          <h2 className="text-lg font-medium text-gray-900">Quality Control Overview</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Pass Rate</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-3xl font-semibold text-gray-900">
              {passRate.toFixed(1)}%
            </p>
          </div>
          <div className="mt-4">
            <div className="relative w-full h-2 bg-gray-200 rounded-full">
              <div
                className="absolute top-0 left-0 h-2 bg-green-500 rounded-full"
                style={{ width: `${passRate}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Passed Checks</h3>
          <div className="mt-2 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-3xl font-semibold text-gray-900">{stats.passed}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Failed Checks</h3>
          <div className="mt-2 flex items-center">
            <XCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-3xl font-semibold text-gray-900">{stats.failed}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Quality Checks</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {recentChecks.map(check => (
            <div key={check.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {check.step.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </p>
                  <p className="text-sm text-gray-500">
                    Lot ID: {check.lotId.slice(0, 8)}
                  </p>
                </div>
                <div className="flex items-center">
                  {check.status === 'passed' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="ml-2 text-sm text-gray-500">
                    {format(new Date(check.checkedAt), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}