import React from 'react';
import { useForm } from 'react-hook-form';
import { useStore } from '../../store';
import { Shell } from 'lucide-react';
import type { RawMaterial } from '../../types';

export function RawMaterialEntry() {
  const { addRawMaterial, suppliers } = useStore();
  const { register, handleSubmit, reset } = useForm<RawMaterial>();

  const onSubmit = (data: RawMaterial) => {
    addRawMaterial({
      ...data,
      id: crypto.randomUUID(),
      receivedDate: new Date().toISOString(),
      status: 'pending'
    });
    reset();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Shell className="h-6 w-6 text-indigo-600" />
        <h2 className="text-lg font-medium text-gray-900">Raw Material Entry</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Supplier</label>
          <select
            {...register('supplierId', { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select Supplier</option>
            {suppliers.map(supplier => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name} ({supplier.code})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Quantity (kg)</label>
          <input
            type="number"
            step="0.01"
            {...register('quantity', { 
              required: true,
              valueAsNumber: true,
              min: 0
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Temperature (°C)</label>
          <input
            type="number"
            step="0.1"
            {...register('temperature', { 
              required: true,
              valueAsNumber: true
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Quality Score (1-10)</label>
          <input
            type="number"
            min="1"
            max="10"
            {...register('qualityScore', { 
              required: true,
              valueAsNumber: true,
              min: 1,
              max: 10
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit Raw Material
        </button>
      </form>
    </div>
  );
}