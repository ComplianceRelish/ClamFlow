import React from 'react';
import { useStore } from '../store';
import { Download } from 'lucide-react';
import { exportInventoryData } from '../utils/exportData';
import { useAuthStore } from '../store/authStore';

export function InventoryPanel() {
  const { finalProducts } = useStore();
  const { user } = useAuthStore();
  const inventory = finalProducts.filter(p => p.status === 'approved');
  const canExport = user?.role === 'supervisor' || user?.role === 'management' || user?.role === 'admin';

  const handleExport = () => {
    exportInventoryData(inventory);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Inventory</h2>
        {canExport && (
          <button
            onClick={handleExport}
            className="flex items-center px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
          >
            <Download className="h-4 w-4 mr-1.5" />
            Export Data
          </button>
        )}
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {inventory.map(product => (
            <li key={product.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {product.productType === 'shell-on' ? 'Shell-On Clam' : 'Clam Meat'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Grade: {product.grade} | Quantity: {product.quantity}kg
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {format(new Date(product.packingDate), 'MMM d, yyyy')}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}