// lib/firebase.ts

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCqD8eMZDiUYTfAH4y-e0CcT-3LULbG1pI",
  authDomain: "existance-b2e51.firebaseapp.com",
  projectId: "existance-b2e51",
  storageBucket: "existance-b2e51.appspot.com",
  messagingSenderId: "878135023594",
  appId: "1:878135023594:web:c8879e4d6fb85a51d68493",
  measurementId: "G-LMDQMDCWV4"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Export the Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
