import { collection, addDoc, updateDoc, doc, query, where, getDocs, orderBy, onSnapshot, Timestamp, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import type { 
  RawMaterial, 
  Lot, 
  ProcessedBatch, 
  ByProduct, 
  FinalProduct, 
  QualityCheck,
  User,
  Supplier,
  ProductGrade 
} from '../types';

// Create operations with custom IDs
export async function addUser(data: User) {
  const docRef = doc(collection(db, 'users'), data.id);
  await setDoc(docRef, {
    ...data,
    timestamp: Timestamp.now()
  });
}

export async function addSupplier(data: Supplier) {
  const docRef = doc(collection(db, 'suppliers'), data.id);
  await setDoc(docRef, {
    ...data,
    timestamp: Timestamp.now()
  });
}

export async function addProductGrade(data: ProductGrade) {
  const docRef = doc(collection(db, 'productGrades'), data.id);
  await setDoc(docRef, {
    ...data,
    timestamp: Timestamp.now()
  });
}

export async function addRawMaterial(data: RawMaterial) {
  const docRef = doc(collection(db, 'rawMaterials'), data.id);
  await setDoc(docRef, {
    ...data,
    timestamp: Timestamp.now()
  });
}

export async function createLot(data: Lot) {
  const docRef = doc(collection(db, 'lots'), data.id);
  await setDoc(docRef, {
    ...data,
    timestamp: Timestamp.now()
  });
}

export async function addProcessedBatch(data: ProcessedBatch) {
  const docRef = doc(collection(db, 'processedBatches'), data.id);
  await setDoc(docRef, {
    ...data,
    timestamp: Timestamp.now()
  });
}

export async function addByProduct(data: ByProduct) {
  const docRef = doc(collection(db, 'byProducts'), data.id);
  await setDoc(docRef, {
    ...data,
    timestamp: Timestamp.now()
  });
}

export async function addFinalProduct(data: FinalProduct) {
  const docRef = doc(collection(db, 'finalProducts'), data.id);
  await setDoc(docRef, {
    ...data,
    timestamp: Timestamp.now()
  });
}

export async function addQualityCheck(data: QualityCheck) {
  const docRef = doc(collection(db, 'qualityChecks'), data.id);
  await setDoc(docRef, {
    ...data,
    timestamp: Timestamp.now()
  });
}

// Real-time listeners
export function subscribeToUsers(callback: (data: User[]) => void) {
  const q = query(collection(db, 'users'), orderBy('timestamp', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const users = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as User));
    callback(users);
  });
}

export function subscribeToSuppliers(callback: (data: Supplier[]) => void) {
  const q = query(collection(db, 'suppliers'), orderBy('timestamp', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const suppliers = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Supplier));
    callback(suppliers);
  });
}

export function subscribeToProductGrades(callback: (data: ProductGrade[]) => void) {
  const q = query(collection(db, 'productGrades'), orderBy('timestamp', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const grades = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as ProductGrade));
    callback(grades);
  });
}

export function subscribeToRawMaterials(callback: (data: RawMaterial[]) => void) {
  const q = query(collection(db, 'rawMaterials'), orderBy('timestamp', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const materials = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as RawMaterial));
    callback(materials);
  });
}

export function subscribeToLots(callback: (data: Lot[]) => void) {
  const q = query(collection(db, 'lots'), orderBy('timestamp', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const lots = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Lot));
    callback(lots);
  });
}

export function subscribeToProcessedBatches(callback: (data: ProcessedBatch[]) => void) {
  const q = query(collection(db, 'processedBatches'), orderBy('timestamp', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const batches = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as ProcessedBatch));
    callback(batches);
  });
}

export function subscribeToFinalProducts(callback: (data: FinalProduct[]) => void) {
  const q = query(collection(db, 'finalProducts'), orderBy('timestamp', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const products = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as FinalProduct));
    callback(products);
  });
}

export function subscribeToQualityChecks(callback: (data: QualityCheck[]) => void) {
  const q = query(collection(db, 'qualityChecks'), orderBy('timestamp', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const checks = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as QualityCheck));
    callback(checks);
  });
}

// Update operations
export async function updateRawMaterial(id: string, data: Partial<RawMaterial>) {
  const docRef = doc(db, 'rawMaterials', id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now()
  });
}

export async function updateQualityCheck(id: string, data: Partial<QualityCheck>) {
  const docRef = doc(db, 'qualityChecks', id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now()
  });
}

// File upload helper
export async function uploadFile(file: File, path: string): Promise<string> {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
}