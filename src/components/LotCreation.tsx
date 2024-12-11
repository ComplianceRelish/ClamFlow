import React from 'react';
import { useForm } from 'react-hook-form';
import { useStore } from '../store';
import { Shell, AlertCircle } from 'lucide-react';
import type { RawMaterial } from '../types';

interface LotFormData {
  lotNumber: string;
  rawMaterialIds: string[];
}

export function LotCreation() {
  const { rawMaterials, createLot, assignRawMaterialsToLot } = useStore();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<LotFormData>();

  // Filter raw materials that haven't been assigned to a lot
  const unassignedMaterials = rawMaterials.filter(material => !material.lotId);

  const calculateTotalQuantity = (selectedIds: string[]): number => {
    return selectedIds.reduce((total, id) => {
      const material = rawMaterials.find(m => m.id === id);
      return total + (material?.quantity || 0);
    }, 0);
  };

  const onSubmit = (data: LotFormData) => {
    const lotId = crypto.randomUUID();
    const totalQuantity = calculateTotalQuantity(data.rawMaterialIds);
    
    // Create new lot
    createLot({
      id: lotId,
      lotNumber: data.lotNumber,
      createdAt: new Date().toISOString(),
      createdBy: 'current-user-id', // TODO: Get from auth context
      rawMaterialIds: data.rawMaterialIds,
      status: 'active',
      totalQuantity
    });

    // Assign raw materials to the lot
    assignRawMaterialsToLot(lotId, data.rawMaterialIds);
    
    reset();
  };

  if (unassignedMaterials.length === 0) {
    return (
      <div className="bg-yellow-50 p-4 rounded-md">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-yellow-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              No Raw Materials Available
            </h3>
            <p className="mt-2 text-sm text-yellow-700">
              All raw materials have been assigned to lots. Add new raw materials to create a lot.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <div className="flex items-center space-x-2 mb-6">
        <Shell className="h-6 w-6 text-indigo-600" />
        <h2 className="text-lg font-medium text-gray-900">Create New Lot</h2>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Lot Number</label>
          <input
            type="text"
            {...register('lotNumber', { 
              required: 'Lot number is required',
              pattern: {
                value: /^[A-Za-z0-9-]+$/,
                message: 'Lot number can only contain letters, numbers, and hyphens'
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.lotNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.lotNumber.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Raw Materials
          </label>
          <div className="mt-2 space-y-2 max-h-60 overflow-y-auto border rounded-md p-4">
            {unassignedMaterials.map((material: RawMaterial) => (
              <label key={material.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                <input
                  type="checkbox"
                  value={material.id}
                  {...register('rawMaterialIds', {
                    required: 'Select at least one raw material'
                  })}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Received: {new Date(material.receivedDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Quantity: {material.quantity}kg | Temperature: {material.temperature}°C
                  </p>
                </div>
              </label>
            ))}
          </div>
          {errors.rawMaterialIds && (
            <p className="mt-1 text-sm text-red-600">{errors.rawMaterialIds.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Lot
        </button>
      </form>
    </div>
  );
}