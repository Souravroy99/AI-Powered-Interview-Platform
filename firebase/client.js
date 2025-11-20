import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDC0ALSEEH7i57MUuGhtsYA2dEiqYqgY6c",
  authDomain: "aiview-811c5.firebaseapp.com",
  projectId: "aiview-811c5",
  storageBucket: "aiview-811c5.firebasestorage.app",
  messagingSenderId: "307015127630",
  appId: "1:307015127630:web:70f39052c0b3db7b5b291f",
  measurementId: "G-0FEGSLFEJ9"
}; 

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);