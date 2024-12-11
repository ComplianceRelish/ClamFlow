import React from 'react';
import { useForm } from 'react-hook-form';
import { CheckCircle, XCircle } from 'lucide-react';
import { useStore } from '../store';
import { useAuthStore } from '../store/authStore';
import type { QualityCheck, QualityCheckStep } from '../types';

interface QualityStepFormProps {
  step: QualityCheckStep;
  lotId: string;
  onComplete: () => void;
}

export function QualityStepForm({ step, lotId, onComplete }: QualityStepFormProps) {
  const { addQualityCheck } = useStore();
  const { user } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm<QualityCheck>();

  const onSubmit = async (data: QualityCheck) => {
    if (!user) return;

    try {
      const qualityCheck: QualityCheck = {
        ...data,
        id: crypto.randomUUID(),
        step,
        lotId,
        checkedAt: new Date().toISOString(),
        checkedBy: user.id,
        status: data.status
      };

      await addQualityCheck(qualityCheck);
      onComplete();
    } catch (error) {
      console.error('Error submitting quality check:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <div className="mt-1 flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              {...register('status', { required: 'Status is required' })}
              value="passed"
              className="form-radio h-4 w-4 text-green-600"
            />
            <span className="ml-2 flex items-center text-sm text-gray-700">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              Pass
            </span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              {...register('status', { required: 'Status is required' })}
              value="failed"
              className="form-radio h-4 w-4 text-red-600"
            />
            <span className="ml-2 flex items-center text-sm text-gray-700">
              <XCircle className="h-4 w-4 text-red-500 mr-1" />
              Fail
            </span>
          </label>
        </div>
        {errors.status && (
          <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
        )}
      </div>

      {(step === 'raw-material' || step === 'washing') && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Temperature (°C)</label>
          <input
            type="number"
            step="0.1"
            {...register('temperature', { 
              required: 'Temperature is required',
              valueAsNumber: true 
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.temperature && (
            <p className="mt-1 text-sm text-red-600">{errors.temperature.message}</p>
          )}
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