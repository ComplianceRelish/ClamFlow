import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import type { 
  RawMaterial, 
  Lot, 
  ProcessedBatch, 
  FinalProduct, 
  QualityCheck 
} from '../types';

function convertToCSV(data: any[], headers: string[]): string {
  const csvRows = [];
  
  // Add headers
  csvRows.push(headers.join(','));
  
  // Add data rows
  data.forEach(item => {
    const values = headers.map(header => {
      const value = item[header] || '';
      // Wrap value in quotes if it contains comma
      return value.toString().includes(',') ? `"${value}"` : value;
    });
    csvRows.push(values.join(','));
  });
  
  return csvRows.join('\n');
}

export function exportDashboardData(
  rawMaterials: RawMaterial[],
  lots: Lot[],
  processedBatches: ProcessedBatch[],
  finalProducts: FinalProduct[],
  qualityChecks: QualityCheck[]
) {
  const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm');
  
  // Raw Materials
  const rawMaterialsCSV = convertToCSV(rawMaterials, [
    'id', 'supplierId', 'quantity', 'temperature', 'qualityScore', 'receivedDate', 'status'
  ]);
  const rawMaterialsBlob = new Blob([rawMaterialsCSV], { type: 'text/csv;charset=utf-8' });
  saveAs(rawMaterialsBlob, `raw-materials_${timestamp}.csv`);

  // Lots
  const lotsCSV = convertToCSV(lots, [
    'id', 'lotNumber', 'createdAt', 'createdBy', 'status', 'totalQuantity'
  ]);
  const lotsBlob = new Blob([lotsCSV], { type: 'text/csv;charset=utf-8' });
  saveAs(lotsBlob, `lots_${timestamp}.csv`);

  // Processed Batches
  const processedBatchesCSV = convertToCSV(processedBatches, [
    'id', 'lotId', 'productType', 'grade', 'quantity', 'boxCount', 'processDate', 'status'
  ]);
  const processedBatchesBlob = new Blob([processedBatchesCSV], { type: 'text/csv;charset=utf-8' });
  saveAs(processedBatchesBlob, `processed-batches_${timestamp}.csv`);

  // Final Products
  const finalProductsCSV = convertToCSV(finalProducts, [
    'id', 'processedBatchId', 'productType', 'grade', 'quantity', 'cartonCount', 'packingDate', 'status'
  ]);
  const finalProductsBlob = new Blob([finalProductsCSV], { type: 'text/csv;charset=utf-8' });
  saveAs(finalProductsBlob, `final-products_${timestamp}.csv`);

  // Quality Checks
  const qualityChecksCSV = convertToCSV(qualityChecks, [
    'id', 'step', 'lotId', 'status', 'checkedAt', 'checkedBy', 'temperature', 'appearance', 'weight', 'comments'
  ]);
  const qualityChecksBlob = new Blob([qualityChecksCSV], { type: 'text/csv;charset=utf-8' });
  saveAs(qualityChecksBlob, `quality-checks_${timestamp}.csv`);
}

export function exportInventoryData(inventory: FinalProduct[]) {
  const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm');
  
  const headers = [
    'id',
    'processedBatchId',
    'productType',
    'grade',
    'quantity',
    'cartonCount',
    'packingDate',
    'status',
    'boxNumbers'
  ];
  
  const csv = convertToCSV(inventory, headers);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, `inventory_${timestamp}.csv`);
}