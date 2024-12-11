import React from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { useAuthStore } from '../store/authStore';
import { Shell } from 'lucide-react';
import { QRCode } from 'react-qr-code';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import type { ProcessedBatch, ByProduct } from '../types';

export function ProcessingForm() {
  const { lotId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addProcessedBatch, addByProduct, lots, productGrades } = useStore();
  const { register, handleSubmit, watch, reset } = useForm<ProcessedBatch>();
  const { register: registerByProduct, handleSubmit: handleByProductSubmit, reset: resetByProduct } = useForm<ByProduct>();
  const [currentBatch, setCurrentBatch] = React.useState<ProcessedBatch | null>(null);

  const lot = lots.find(l => l.id === lotId);
  const productType = watch('productType');

  // Filter grades based on selected product type
  const availableGrades = React.useMemo(() => {
    if (!productType) return [];
    return productGrades.filter(grade => grade.type === productType);
  }, [productGrades, productType]);

  if (!lot) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-4 bg-yellow-50 rounded-md">
        <p className="text-yellow-700">Lot not found or no longer active.</p>
      </div>
    );
  }

  const generateBoxNumbers = (count: number, lotNumber: string) => {
    return Array.from({ length: count }, (_, i) => {
      const paddedNumber = String(i + 1).padStart(4, '0');
      return `${lotNumber}-${paddedNumber}`;
    });
  };

  const onSubmit = async (data: ProcessedBatch) => {
    if (!user) return;

    const batchId = crypto.randomUUID();
    const boxNumbers = generateBoxNumbers(data.boxCount, lot.lotNumber);
    const selectedGrade = productGrades.find(g => g.id === data.grade);

    const qrData = {
      id: batchId,
      lotNumber: lot.lotNumber,
      type: data.productType,
      grade: selectedGrade?.name || '',
      quantity: data.quantity,
      date: new Date().toISOString(),
      boxNumbers
    };

    const batch = {
      ...data,
      id: batchId,
      lotId: lot.id,
      operatorId: user.id,
      processDate: new Date().toISOString(),
      status: 'pending',
      qrCode: JSON.stringify(qrData),
      boxNumbers,
      stage: 'processing'
    };

    await addProcessedBatch(batch);
    setCurrentBatch(batch);
    reset();
  };

  const onByProductSubmit = async (data: ByProduct) => {
    if (!user) return;

    await addByProduct({
      ...data,
      id: crypto.randomUUID(),
      processedBatchId: lot.id,
      date: new Date().toISOString()
    });

    resetByProduct();
  };

  const handlePrintLabels = async () => {
    if (!currentBatch) return;

    currentBatch.boxNumbers.forEach(async (boxNumber, index) => {
      const labelElement = document.getElementById(`label-${boxNumber}`);
      if (labelElement) {
        try {
          const dataUrl = await toPng(labelElement);
          saveAs(dataUrl, `label-${boxNumber}.png`);
        } catch (error) {
          console.error('Error generating label:', error);
        }
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-2">
        <Shell className="h-6 w-6 text-indigo-600" />
        <h1 className="text-2xl font-bold text-gray-900">Processing Form</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900">Lot #{lot.lotNumber}</h2>
          <p className="text-sm text-gray-500">Total Quantity: {lot.totalQuantity}kg</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Type</label>
            <select
              {...register('productType', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select Product Type</option>
              <option value="shell-on">Shell-On</option>
              <option value="meat">Meat</option>
            </select>
          </div>

          {productType && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Grade</label>
              <select
                {...register('grade', { required: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select Grade</option>
                {availableGrades.map(grade => (
                  <option key={grade.id} value={grade.id}>
                    {grade.code} - {grade.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity (kg)</label>
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

          <div>
            <label className="block text-sm font-medium text-gray-700">Box Count</label>
            <input
              type="number"
              {...register('boxCount', { 
                required: true,
                valueAsNumber: true,
                min: 1
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit Processing Form
          </button>
        </form>
      </div>

      {/* Box Labels */}
      {currentBatch && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Box Labels</h2>
          <div className="space-y-6">
            {currentBatch.boxNumbers.map((boxNumber) => (
              <div
                key={boxNumber}
                id={`label-${boxNumber}`}
                className="p-4 border rounded-lg"
              >
                <div className="flex justify-between mb-4">
                  <div>
                    <p className="font-bold">{boxNumber}</p>
                    <p>{currentBatch.productType === 'shell-on' ? 'Shell-On Clam' : 'Clam Meat'}</p>
                    <p>Grade: {productGrades.find(g => g.id === currentBatch?.grade)?.code}</p>
                  </div>
                  <QRCode
                    value={currentBatch.qrCode}
                    size={100}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Processed: {new Date(currentBatch.processDate).toLocaleDateString()}
                </p>
              </div>
            ))}
            <button
              onClick={handlePrintLabels}
              className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Print All Labels
            </button>
          </div>
        </div>
      )}

      {/* By-product Form */}
      {productType === 'meat' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Shell By-product</h2>
          
          <form onSubmit={handleByProductSubmit(onByProductSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Shell Weight (kg)</label>
              <input
                type="number"
                step="0.01"
                {...registerByProduct('shellWeight', { 
                  required: true,
                  valueAsNumber: true
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Disposal Method</label>
              <select
                {...registerByProduct('disposalMethod', { required: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select Disposal Method</option>
                <option value="recycling">Recycling</option>
                <option value="waste">Waste</option>
                <option value="other">Other</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Record By-product
            </button>
          </form>
        </div>
      )}
    </div>
  );
}