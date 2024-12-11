import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  Timestamp,
  where 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

// Collection operations
export function subscribeToCollection(collectionName: string, callback: (data: any[]) => void) {
  try {
    const q = query(collection(db, collectionName), orderBy('timestamp', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      callback(data);
    }, (error) => {
      console.error(`Error subscribing to ${collectionName}:`, error);
    });
  } catch (error) {
    console.error(`Error setting up subscription to ${collectionName}:`, error);
    return () => {};
  }
}

export async function addDocument(collectionName: string, data: any) {
  try {
    const docRef = doc(collection(db, collectionName), data.id);
    await setDoc(docRef, {
      ...data,
      timestamp: Timestamp.now()
    });
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error);
    throw error;
  }
}

export async function updateDocument(collectionName: string, id: string, data: any) {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    throw error;
  }
}

export async function deleteDocument(collectionName: string, id: string) {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    throw error;
  }
}

// Clear all documents in a collection
export async function clearCollection(collectionName: string) {
  try {
    const snapshot = await getDocs(collection(db, collectionName));
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error(`Error clearing collection ${collectionName}:`, error);
    throw error;
  }
}

// Initialize default grades
export async function initializeDefaultGrades() {
  try {
    // Clear existing grades
    await clearCollection('productGrades');

    // Shell-On grades
    const shellOnGrades = [
      { code: 'WH01', name: 'Grade 1', type: 'shell-on', description: 'Shell-On Grade 1' },
      { code: 'WH02', name: 'Grade 2', type: 'shell-on', description: 'Shell-On Grade 2' },
      { code: 'WH03', name: 'Grade 3', type: 'shell-on', description: 'Shell-On Grade 3' }
    ];

    // Meat grades
    const meatGrades = [
      { code: 'CM01', name: 'Grade 1', type: 'meat', description: 'Clam Meat Grade 1' },
      { code: 'CM02', name: 'Grade 2', type: 'meat', description: 'Clam Meat Grade 2' },
      { code: 'CM03', name: 'Grade 3', type: 'meat', description: 'Clam Meat Grade 3' }
    ];

    // Add all grades
    const allGrades = [...shellOnGrades, ...meatGrades];
    for (const grade of allGrades) {
      await addDocument('productGrades', {
        ...grade,
        id: crypto.randomUUID()
      });
    }
  } catch (error) {
    console.error('Error initializing default grades:', error);
    throw error;
  }
}