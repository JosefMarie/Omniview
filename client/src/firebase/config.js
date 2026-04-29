// ============================================================
// FIREBASE CONFIGURATION
// Safely initialized to prevent duplicate app errors in HMR
// ============================================================
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBg3cCi_0rTecPZoL_tbmgNpvNFdCP1BqM",
  authDomain: "joe-s-projects.firebaseapp.com",
  projectId: "joe-s-projects",
  storageBucket: "joe-s-projects.firebasestorage.app",
  messagingSenderId: "952931592539",
  appId: "1:952931592539:web:4f562b94b325bdcc58127e",
  measurementId: "G-RHE5PVW6BP"
};

let app;
try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    console.log("Firebase initialized successfully");
  } else {
    app = getApp();
    console.log("Using existing Firebase app");
  }
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
