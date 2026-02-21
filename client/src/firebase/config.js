// ============================================================
// FIREBASE CONFIGURATION
// Replace the values below with your Firebase project config.
// You can find these in: Firebase Console → Project Settings → Your Apps
// ============================================================
import { initializeApp } from 'firebase/app';
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

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
