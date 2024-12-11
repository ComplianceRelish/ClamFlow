import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAiO_WSjNxG9wKRzAal-6sQ22w2G8ZLZyQ",
  authDomain: "clamflow-44523.firebaseapp.com",
  projectId: "clamflow-44523",
  storageBucket: "clamflow-44523.appspot.com",
  messagingSenderId: "513376814199",
  appId: "1:513376814199:web:f46460c7bddf3154aaf272",
  measurementId: "G-WJ4SJXHETC"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Enable offline persistence
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser doesn\'t support persistence.');
    }
  });

export default app;