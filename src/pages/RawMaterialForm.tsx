import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import type { RawMaterial } from '../types';

export function RawMaterialForm() {
  const navigate = useNavigate();
  const { addRawMaterial, suppliers, users } = useStore();
  const { register, handleSubmit, reset } = useForm<RawMaterial>();
  
  const currentUser = users[0]; // TODO: Get from auth context
  const isSupervisor = currentUser?.role === 'supervisor';

  const onSubmit = (data: RawMaterial) => {
    addRawMaterial({
      ...data,
      id: crypto.randomUUID(),
      receivedDate: new Date().toISOString(),
    });
    reset();
    
    // Navigate to lot creation if supervisor
    if (isSupervisor) {
      navigate('/lot-creation');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Raw Material Receiving</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Supplier</label>
          <select
            {...register('supplierId')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {suppliers.map(supplier => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Quantity (kg)</label>
          <input
            type="number"
            step="0.01"
            {...register('quantity', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Temperature (°C)</label>
          <input
            type="number"
            step="0.1"
            {...register('temperature', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Quality Score</label>
          <input
            type="number"
            min="1"
            max="10"
            {...register('qualityScore', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </form>

      {!isSupervisor && (
        <div className="bg-yellow-50 p-4 rounded-md">
          <p className="text-sm text-yellow-700">
            Note: Only supervisors can proceed to lot creation. Please contact your supervisor to create lots from the submitted raw materials.
          </p>
        </div>
      )}
    </div>
  );
}