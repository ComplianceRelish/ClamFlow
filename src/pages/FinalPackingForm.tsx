import React from 'react';
import { useForm } from 'react-hook-form';
import { toPng } from 'html-to-image';
import { useStore } from '../store';
import { ProductLabel } from '../components/ProductLabel';
import type { FinalProduct } from '../types';

export function FinalPackingForm() {
  const { addFinalProduct, processedBatches, productGrades } = useStore();
  const { register, handleSubmit, reset, watch } = useForm<FinalProduct>();
  const [showLabel, setShowLabel] = React.useState(false);
  const [currentProduct, setCurrentProduct] = React.useState<FinalProduct | null>(null);

  const productType = watch('productType');

  const onSubmit = async (data: FinalProduct) => {
    const id = crypto.randomUUID();
    const packingDate = new Date().toISOString();
    const boxNumbers = Array.from({ length: data.cartonCount }, (_, i) => {
      const paddedNumber = (i + 1).toString().padStart(4, '0');
      return `BOX-${paddedNumber}`;
    });
    
    const qrData = JSON.stringify({
      id,
      batchId: data.processedBatchId,
      productType: data.productType,
      grade: data.grade,
      quantity: data.quantity,
      cartons: data.cartonCount,
      boxNumbers,
      packingDate,
    });

    const product = {
      ...data,
      id,
      packingDate,
      qrCode: qrData,
      status: 'pending',
      boxNumbers,
    };

    addFinalProduct(product);
    setCurrentProduct(product);
    setShowLabel(true);
    reset();
  };

  const handlePrintLabel = async () => {
    if (!currentProduct) return;

    const labelElement = document.getElementById(`label-${currentProduct.id}`);
    if (labelElement) {
      try {
        const dataUrl = await toPng(labelElement);
        const link = document.createElement('a');
        link.download = `label-${currentProduct.id}.png`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error('Error generating label:', error);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Final Packing</h1>

      {/* Final Packing Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Processed Batch</label>
          <select
            {...register('processedBatchId')}
            className="mt-1 block w-full rounded-md border-gray-300"
          >
            <option value="">Select Batch</option>
            {processedBatches.map(batch => (
              <option key={batch.id} value={batch.id}>
                Batch #{batch.id.slice(0, 8)} - {batch.productType}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Product Type</label>
          <select
            {...register('productType')}
            className="mt-1 block w-full rounded-md border-gray-300"
          >
            <option value="shell-on">Shell-On</option>
            <option value="meat">Meat</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Grade</label>
          <select
            {...register('grade')}
            className="mt-1 block w-full rounded-md border-gray-300"
          >
            {productGrades
              .filter(grade => grade.type === productType)
              .map(grade => (
                <option key={grade.id} value={grade.id}>
                  {grade.name}
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
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Number of Cartons</label>
          <input
            type="number"
            {...register('cartonCount', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Complete Packing
        </button>
      </form>

      {/* Label Preview and Printing */}
      {showLabel && currentProduct && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Product Label</h2>
          <div className="flex justify-center mb-6">
            <ProductLabel
              productId={currentProduct.id}
              processedBy="ClamFlow Processing Unit"
              exportedBy="ClamFlow Exports"
              packingDate={currentProduct.packingDate}
              qrData={currentProduct.qrCode}
            />
          </div>
          <button
            onClick={handlePrintLabel}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            Print Label
          </button>
        </div>
      )}
    </div>
  );
}