import React from 'react';
import { useStore } from '../store';
import { useAuthStore } from '../store/authStore';
import { QualityStepForm } from '../components/QualityStepForm';
import { QualityDashboard } from '../components/quality/QualityDashboard';
import { ClipboardCheck, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Tab } from '@headlessui/react';
import { Navigate } from 'react-router-dom';
import type { QualityCheckStep } from '../types';

const PRODUCTION_STEPS: { step: QualityCheckStep; label: string }[] = [
  { step: 'raw-material-receiving', label: 'Raw Material Receiving' },
  { step: 'rotary-screen-washing', label: 'Rotary Screen Washing' },
  { step: 'depuration', label: 'Depuration' },
  { step: 'pressure-washer', label: 'Pressure Washer' },
  { step: 'live-separation', label: 'Live Separation' },
  { step: 'grading', label: 'Grading' },
  { step: 'cooking', label: 'Cooking' },
  { step: 'meat-separation', label: 'Meat Separation' },
  { step: 'final-qc-release', label: 'Final QC Release' }
];

const FINAL_PACKING_STEPS: { step: QualityCheckStep; label: string }[] = [
  { step: 'form3-product-in', label: 'Final Packing - Product IN' },
  { step: 'form3-microbiology', label: 'Final Packing - Quality Parameters' }
];

export function QualityControl() {
  const { user } = useAuthStore();
  const { qualityChecks, lots, finalProducts } = useStore();
  const [selectedLot, setSelectedLot] = React.useState<string | null>(null);
  const [selectedStep, setSelectedStep] = React.useState<QualityCheckStep | null>(null);
  const [activeTab, setActiveTab] = React.useState<'dashboard' | 'production' | 'final-packing'>('dashboard');

  // Redirect if not quality control role
  if (!user || user.role !== 'quality') {
    return <Navigate to="/" replace />;
  }

  const activeLots = lots.filter(lot => lot.status === 'active');
  const pendingFinalProducts = finalProducts.filter(p => p.status === 'pending');

  const getStepStatus = (lotId: string, step: QualityCheckStep) => {
    const check = qualityChecks.find(c => c.lotId === lotId && c.step === step);
    return check?.status || 'pending';
  };

  const canPerformStep = (lotId: string, stepIndex: number, steps: typeof PRODUCTION_STEPS) => {
    if (stepIndex === 0) return true;
    const previousStep = steps[stepIndex - 1].step;
    return getStepStatus(lotId, previousStep) === 'passed';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quality Control</h1>
        <div className="flex items-center space-x-2">
          <ClipboardCheck className="h-6 w-6 text-indigo-600" />
          <span className="text-sm text-gray-500">
            Active Lots: {activeLots.length}
          </span>
        </div>
      </div>

      <Tab.Group onChange={(index) => setActiveTab(['dashboard', 'production', 'final-packing'][index])}>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-6">
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5
             ${selected
              ? 'bg-white text-blue-700 shadow'
              : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
            }`
          }>
            Dashboard
          </Tab>
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5
             ${selected
              ? 'bg-white text-blue-700 shadow'
              : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
            }`
          }>
            Production QC
          </Tab>
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5
             ${selected
              ? 'bg-white text-blue-700 shadow'
              : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
            }`
          }>
            Final Packing QC
          </Tab>
        </Tab.List>

        <Tab.Panels>
          <Tab.Panel>
            <QualityDashboard />
          </Tab.Panel>

          <Tab.Panel>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Production QC Content */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Select Lot</h2>
                <div className="space-y-2">
                  {activeLots.map(lot => (
                    <button
                      key={lot.id}
                      onClick={() => setSelectedLot(lot.id)}
                      className={`w-full text-left p-4 rounded-lg border hover:bg-gray-50 ${
                        selectedLot === lot.id ? 'border-indigo-500 ring-2 ring-indigo-200' : ''
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Lot #{lot.lotNumber}</span>
                        <span className="text-sm text-gray-500">
                          Created: {new Date(lot.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedLot && (
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Quality Steps</h2>
                  <div className="space-y-2">
                    {PRODUCTION_STEPS.map((qualityStep, index) => {
                      const status = getStepStatus(selectedLot, qualityStep.step);
                      const enabled = canPerformStep(selectedLot, index, PRODUCTION_STEPS);
                      
                      return (
                        <button
                          key={qualityStep.step}
                          onClick={() => enabled && setSelectedStep(qualityStep.step)}
                          disabled={!enabled}
                          className={`w-full text-left p-4 rounded-lg border hover:bg-gray-50 ${
                            !enabled ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                              {getStatusIcon(status)}
                              <span className="font-medium">{qualityStep.label}</span>
                            </div>
                            <span className={`text-sm font-medium ${
                              status === 'passed' ? 'text-green-600' :
                              status === 'failed' ? 'text-red-600' :
                              'text-yellow-600'
                            }`}>
                              {status.toUpperCase()}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </Tab.Panel>

          <Tab.Panel>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Final Packing QC Content */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Pending Final Products</h2>
                <div className="space-y-2">
                  {pendingFinalProducts.map(product => (
                    <button
                      key={product.id}
                      onClick={() => setSelectedLot(product.id)}
                      className={`w-full text-left p-4 rounded-lg border hover:bg-gray-50 ${
                        selectedLot === product.id ? 'border-indigo-500 ring-2 ring-indigo-200' : ''
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Product #{product.id.slice(0, 8)}</span>
                        <span className="text-sm text-gray-500">
                          Packed: {new Date(product.packingDate).toLocaleDateString()}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedLot && (
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Final Packing Steps</h2>
                  <div className="space-y-2">
                    {FINAL_PACKING_STEPS.map((qualityStep, index) => {
                      const status = getStepStatus(selectedLot, qualityStep.step);
                      const enabled = canPerformStep(selectedLot, index, FINAL_PACKING_STEPS);
                      
                      return (
                        <button
                          key={qualityStep.step}
                          onClick={() => enabled && setSelectedStep(qualityStep.step)}
                          disabled={!enabled}
                          className={`w-full text-left p-4 rounded-lg border hover:bg-gray-50 ${
                            !enabled ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                              {getStatusIcon(status)}
                              <span className="font-medium">{qualityStep.label}</span>
                            </div>
                            <span className={`text-sm font-medium ${
                              status === 'passed' ? 'text-green-600' :
                              status === 'failed' ? 'text-red-600' :
                              'text-yellow-600'
                            }`}>
                              {status.toUpperCase()}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      {/* Quality Check Form */}
      {selectedLot && selectedStep && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Quality Check: {
              [...PRODUCTION_STEPS, ...FINAL_PACKING_STEPS].find(s => s.step === selectedStep)?.label
            }
          </h2>
          <QualityStepForm
            step={selectedStep}
            lotId={selectedLot}
            onComplete={() => setSelectedStep(null)}
          />
        </div>
      )}
    </div>
  );
}