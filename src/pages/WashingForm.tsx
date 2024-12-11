import React from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { useAuthStore } from '../store/authStore';
import { Shell } from 'lucide-react';
import type { ProcessedBatch } from '../types';

export function WashingForm() {
  const { lotId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addProcessedBatch, lots } = useStore();
  const { register, handleSubmit, reset } = useForm<ProcessedBatch>();

  const lot = lots.find(l => l.id === lotId);

  if (!lot) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-4 bg-yellow-50 rounded-md">
        <p className="text-yellow-700">Lot not found or no longer active.</p>
      </div>
    );
  }

  const onSubmit = (data: ProcessedBatch) => {
    if (!user) return;

    const batchId = crypto.randomUUID();
    addProcessedBatch({
      ...data,
      id: batchId,
      lotId: lot.id,
      operatorId: user.id,
      stage: 'washing',
      processDate: new Date().toISOString(),
      status: 'pending',
      productType: 'shell-on', // Initial stage is always shell-on
      grade: 'ungraded',
      boxCount: Math.ceil(data.quantity / 25) // Assuming 25kg per box
    });

    reset();
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-2">
        <Shell className="h-6 w-6 text-indigo-600" />
        <h1 className="text-2xl font-bold text-gray-900">Washing Stage</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900">Lot #{lot.lotNumber}</h2>
          <p className="text-sm text-gray-500">Total Quantity: {lot.totalQuantity}kg</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity Processed (kg)</label>
            <input
              type="number"
              step="0.01"
              {...register('quantity', { 
                required: true,
                valueAsNumber: true,
                max: lot.totalQuantity
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Complete Washing Stage
          </button>
        </form>
      </div>
    </div>
  );
}