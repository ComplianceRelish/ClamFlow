import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Lot } from '../types';

interface ProcessStageCardProps {
  lot: Lot;
  availableStages: string[];
}

export function ProcessStageCard({ lot, availableStages }: ProcessStageCardProps) {
  const getStageUrl = (stage: string) => {
    switch (stage) {
      case 'grading': return `/grading/${lot.id}`;
      case 'processing': return `/processing/${lot.id}`;
      case 'packing': return `/packing/${lot.id}`;
      default: return '#';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">
          Lot #{lot.lotNumber}
        </h3>
        <div className="mt-4 space-y-4">
          {availableStages.map(stage => (
            <Link
              key={stage}
              to={getStageUrl(stage)}
              className="flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <span className="text-sm font-medium text-gray-900">
                {stage.charAt(0).toUpperCase() + stage.slice(1)}
              </span>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </Link>
          ))}
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-4 sm:px-6">
        <div className="text-sm">
          <span className="text-gray-500">Created: </span>
          <span className="text-gray-900">
            {new Date(lot.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="text-sm mt-1">
          <span className="text-gray-500">Total Quantity: </span>
          <span className="text-gray-900">{lot.totalQuantity}kg</span>
        </div>
      </div>
    </div>
  );
}