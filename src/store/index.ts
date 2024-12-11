import { create } from 'zustand';
import * as firebase from '../utils/firebase';
import type { 
  User, 
  Supplier, 
  ProductGrade, 
  RawMaterial,
  Lot,
  ProcessedBatch,
  ByProduct,
  FinalProduct,
  QualityCheck 
} from '../types';

interface AppState {
  users: User[];
  suppliers: Supplier[];
  productGrades: ProductGrade[];
  rawMaterials: RawMaterial[];
  lots: Lot[];
  processedBatches: ProcessedBatch[];
  byProducts: ByProduct[];
  finalProducts: FinalProduct[];
  qualityChecks: QualityCheck[];
  
  addUser: (user: User) => Promise<void>;
  addSupplier: (supplier: Supplier) => Promise<void>;
  addProductGrade: (grade: ProductGrade) => Promise<void>;
  addRawMaterial: (material: RawMaterial) => Promise<void>;
  createLot: (lot: Lot) => Promise<void>;
  assignRawMaterialsToLot: (lotId: string, rawMaterialIds: string[]) => Promise<void>;
  addProcessedBatch: (batch: ProcessedBatch) => Promise<void>;
  addByProduct: (byProduct: ByProduct) => Promise<void>;
  addFinalProduct: (product: FinalProduct) => Promise<void>;
  addQualityCheck: (check: QualityCheck) => Promise<void>;
  updateQualityCheck: (id: string, data: Partial<QualityCheck>) => Promise<void>;
}

export const useStore = create<AppState>((set) => {
  // Set up Firebase real-time listeners
  const unsubscribeCallbacks: (() => void)[] = [];

  // Subscribe to all collections
  unsubscribeCallbacks.push(
    firebase.subscribeToCollection('users', (users) => {
      set({ users });
    }),
    firebase.subscribeToCollection('suppliers', (suppliers) => {
      set({ suppliers });
    }),
    firebase.subscribeToCollection('productGrades', (grades) => {
      set({ productGrades: grades });
    }),
    firebase.subscribeToCollection('rawMaterials', (materials) => {
      set({ rawMaterials: materials });
    }),
    firebase.subscribeToCollection('lots', (lots) => {
      set({ lots });
    }),
    firebase.subscribeToCollection('processedBatches', (batches) => {
      set({ processedBatches: batches });
    }),
    firebase.subscribeToCollection('byProducts', (byProducts) => {
      set({ byProducts });
    }),
    firebase.subscribeToCollection('finalProducts', (products) => {
      set({ finalProducts: products });
    }),
    firebase.subscribeToCollection('qualityChecks', (checks) => {
      set({ qualityChecks: checks });
    })
  );

  // Clean up listeners on unmount
  window.addEventListener('beforeunload', () => {
    unsubscribeCallbacks.forEach(unsubscribe => unsubscribe());
  });

  return {
    users: [],
    suppliers: [],
    productGrades: [],
    rawMaterials: [],
    lots: [],
    processedBatches: [],
    byProducts: [],
    finalProducts: [],
    qualityChecks: [],

    addUser: async (user) => {
      await firebase.addDocument('users', user);
    },

    addSupplier: async (supplier) => {
      await firebase.addDocument('suppliers', supplier);
    },

    addProductGrade: async (grade) => {
      await firebase.addDocument('productGrades', grade);
    },

    addRawMaterial: async (material) => {
      await firebase.addDocument('rawMaterials', material);
    },

    createLot: async (lot) => {
      await firebase.addDocument('lots', lot);
    },

    assignRawMaterialsToLot: async (lotId, rawMaterialIds) => {
      for (const materialId of rawMaterialIds) {
        await firebase.updateDocument('rawMaterials', materialId, { lotId });
      }
    },

    addProcessedBatch: async (batch) => {
      await firebase.addDocument('processedBatches', batch);
    },

    addByProduct: async (byProduct) => {
      await firebase.addDocument('byProducts', byProduct);
    },

    addFinalProduct: async (product) => {
      await firebase.addDocument('finalProducts', product);
    },

    addQualityCheck: async (check) => {
      await firebase.addDocument('qualityChecks', check);
    },

    updateQualityCheck: async (id, data) => {
      await firebase.updateDocument('qualityChecks', id, data);
    }
  };
});