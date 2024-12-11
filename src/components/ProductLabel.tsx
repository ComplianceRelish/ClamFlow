import React from 'react';
import QRCode from 'qrcode.react';
import { format, addMonths } from 'date-fns';

interface ProductLabelProps {
  productId: string;
  processedBy: string;
  exportedBy: string;
  packingDate: string;
  qrData: string;
}

export function ProductLabel({ productId, processedBy, exportedBy, packingDate, qrData }: ProductLabelProps) {
  const expiryDate = addMonths(new Date(packingDate), 24);
  const isMobile = window.innerWidth < 768;

  return (
    <div 
      id={`label-${productId}`}
      className={`${isMobile ? 'w-[300px] h-[225px]' : 'w-[400px] h-[300px]'} p-4 md:p-6 border border-gray-300 rounded-lg bg-white shadow-lg`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4 md:mb-6">
        <div className="space-y-1">
          <p className="text-xs md:text-sm font-medium text-gray-600">Processed & Packed by:</p>
          <p className="text-sm md:text-lg font-bold text-gray-900">{processedBy}</p>
        </div>
        <div className="space-y-1 text-right">
          <p className="text-xs md:text-sm font-medium text-gray-600">Exported by:</p>
          <p className="text-sm md:text-lg font-bold text-gray-900">{exportedBy}</p>
        </div>
      </div>

      {/* Dates */}
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <div className="space-y-1">
          <p className="text-xs md:text-sm font-medium text-gray-600">Date of Packing:</p>
          <p className="text-sm md:text-base font-semibold text-gray-900">
            {format(new Date(packingDate), 'dd/MM/yyyy')}
          </p>
        </div>
        <div className="space-y-1 text-right">
          <p className="text-xs md:text-sm font-medium text-gray-600">Date of Expiry:</p>
          <p className="text-sm md:text-base font-semibold text-gray-900">
            {format(expiryDate, 'dd/MM/yyyy')}
          </p>
        </div>
      </div>

      {/* QR Code */}
      <div className="flex flex-col items-center">
        <QRCode 
          value={qrData} 
          size={isMobile ? 90 : 120}
          level="H"
          className="mb-3 md:mb-4"
        />
        <p className="text-[10px] md:text-xs text-gray-500 italic">Product of India</p>
      </div>
    </div>
  );
}