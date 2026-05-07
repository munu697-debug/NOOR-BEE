import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
// REPLACE THIS WITH YOUR ACTUAL FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyA-6wOQlvZMesBh2CBmDfgGymMFQonpJDk",
  authDomain: "ecommerce-noorbee.firebaseapp.com",
  databaseURL: "https://ecommerce-noorbee-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ecommerce-noorbee",
  storageBucket: "ecommerce-noorbee.firebasestorage.app",
  messagingSenderId: "498852339619",
  appId: "1:498852339619:web:7f5e176a0b4ec9e4998416",
  measurementId: "G-FWMJ53B1R9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Set persistent auth (local)
setPersistence(auth, browserLocalPersistence);

const db = getDatabase(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider, signInWithPopup, signOut, onAuthStateChanged };
