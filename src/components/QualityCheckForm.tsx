import React from 'react';
import { useForm } from 'react-hook-form';
import { useStore } from '../store';
import type { QualityCheck } from '../types';

interface QualityCheckFormProps {
  step: 'raw-material' | 'processing' | 'final-packing';
  referenceId: string;
  onComplete: () => void;
}

export function QualityCheckForm({ step, referenceId, onComplete }: QualityCheckFormProps) {
  const { addQualityCheck, updateQualityStatus } = useStore();
  const { register, handleSubmit } = useForm<QualityCheck>();

  const onSubmit = (data: QualityCheck) => {
    const checkId = crypto.randomUUID();
    const status = data.status;
    
    addQualityCheck({
      ...data,
      id: checkId,
      step,
      referenceId,
      checkedAt: new Date().toISOString(),
      checkedBy: 'current-user-id', // TODO: Get from auth context
    });

    // Update the status of the referenced item
    updateQualityStatus(
      step === 'raw-material' ? 'raw-material' : 
      step === 'processing' ? 'processed-batch' : 'final-product',
      referenceId,
      status === 'passed' ? 'approved' : 'rejected'
    );

    onComplete();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          {...register('status')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="passed">Passed</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {step === 'raw-material' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Temperature (°C)</label>
          <input
            type="number"
            step="0.1"
            {...register('temperature', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Appearance</label>
        <input
          type="text"
          {...register('appearance')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      {(step === 'processing' || step === 'final-packing') && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Weight Check (kg)</label>
          <input
            type="number"
            step="0.01"
            {...register('weight', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Comments</label>
        <textarea
          {...register('comments')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Submit Quality Check
      </button>
    </form>
  );
}