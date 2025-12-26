import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_CONFIG_apiKey,
  authDomain: process.env.FIREBASE_CONFIG_authDomain,
  projectId: process.env.FIREBASE_CONFIG_projectId, 
  storageBucket: process.env.FIREBASE_CONFIG_storageBucket,
  messagingSenderId: process.env.FIREBASE_CONFIG_messagingSenderId,
  appId: process.env.FIREBASE_CONFIG_appId,
  measurementId: process.env.FIREBASE_CONFIG_measurementId
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);