import React from 'react';
import { useStore } from '../../store';
import { useAuthStore } from '../../store/authStore';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowRight, Shell } from 'lucide-react';

export function LotsInProgress() {
  const { user } = useAuthStore();
  const { lots, processedBatches, qualityChecks } = useStore();
  
  // Get lots that are active and have raw materials assigned
  const activeLots = lots.filter(lot => 
    lot.status === 'active' && lot.rawMaterialIds.length > 0
  );

  const getLotStage = (lotId: string) => {
    // Get all quality checks for this lot
    const lotChecks = qualityChecks.filter(check => check.lotId === lotId);
    const lotBatches = processedBatches.filter(batch => batch.lotId === lotId);

    // If no batches exist, start with processing
    if (lotBatches.length === 0) {
      return 'processing';
    }

    // Get the last batch to determine current stage
    const lastBatch = lotBatches[lotBatches.length - 1];
    
    // If processing is done and quality check passed, move to final packing
    if (lastBatch.stage === 'processing') {
      const processingCheck = lotChecks.find(check => 
        check.step === 'processing' && 
        check.status === 'passed'
      );
      
      if (processingCheck) {
        return 'final-packing';
      }
    }

    // Stay at current stage
    return lastBatch.stage;
  };

  if (activeLots.length === 0) {
    return (
      <div className="bg-yellow-50 p-4 rounded-lg">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-yellow-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">No Active Lots</h3>
            <p className="mt-2 text-sm text-yellow-700">
              There are currently no active lots requiring operator attention.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shell className="h-6 w-6 text-indigo-600" />
          <h2 className="text-lg font-medium text-gray-900">Active Production Lots</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeLots.map(lot => {
          const currentStage = getLotStage(lot.id);
          if (currentStage === 'completed') return null;

          return (
            <div key={lot.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Lot #{lot.lotNumber}
                </h3>
                <div className="mt-4">
                  <Link
                    to={`/${currentStage}/${lot.id}`}
                    className="flex items-center justify-between px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        {currentStage === 'processing' ? 'Processing Stage' : 'Final Packing Stage'}
                      </span>
                      <p className="text-sm text-gray-500">
                        Ready for {currentStage === 'processing' ? 'processing' : 'packing'}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </Link>
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
        })}
      </div>
    </div>
  );
}