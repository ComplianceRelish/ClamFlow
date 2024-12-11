export type UserRole = 'operator' | 'supervisor' | 'quality' | 'admin' | 'management';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  code: string;
  contact?: string;
}

export interface Supplier {
  id: string;
  name: string;
  code: string;
  contact: string;
}

export interface ProductGrade {
  id: string;
  name: string;
  code: string;
  type: 'shell-on' | 'meat';
  description: string;
}

export interface RawMaterial {
  id: string;
  supplierId: string;
  quantity: number;
  temperature: number;
  qualityScore: number;
  receivedDate: string;
  lotId?: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Lot {
  id: string;
  lotNumber: string;
  createdAt: string;
  createdBy: string;
  rawMaterialIds: string[];
  status: 'active' | 'completed';
  totalQuantity: number;
  currentStage: QualityCheckStep;
}

export interface ProcessedBatch {
  id: string;
  lotId: string;
  operatorId: string;
  productType: 'shell-on' | 'meat';
  grade: string;
  quantity: number;
  boxCount: number;
  processDate: string;
  status: 'pending' | 'approved' | 'rejected';
  qrCode: string;
  stage: QualityCheckStep;
}

export interface ByProduct {
  id: string;
  processedBatchId: string;
  shellWeight: number;
  disposalMethod: string;
  date: string;
}

export interface FinalProduct {
  id: string;
  processedBatchId: string;
  productType: 'shell-on' | 'meat';
  grade: string;
  quantity: number;
  cartonCount: number;
  packingDate: string;
  qrCode: string;
  status: 'pending' | 'approved' | 'rejected';
  boxNumbers: string[];
}

export interface QualityCheck {
  id: string;
  step: QualityCheckStep;
  lotId: string;
  status: 'passed' | 'failed';
  checkedAt: string;
  checkedBy: string;
  temperature?: number;
  appearance?: string;
  weight?: number;
  comments?: string;
  documents?: Array<{
    name: string;
    url: string;
  }>;
}

export type QualityCheckStep = 
  | 'raw-material'
  | 'washing'
  | 'depuration'
  | 'live-separation'
  | 'grading'
  | 'cooking'
  | 'meat-separation'
  | 'product-scan'
  | 'final-packing';

export interface LabelConfig {
  processedBy: string;
  exportedBy: string;
}