import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDRC0bmuCO-DsAVxJZ87EOpyo0nxTt3A9Y",
  authDomain: "new-aiview.firebaseapp.com",
  projectId: "new-aiview",
  storageBucket: "new-aiview.firebasestorage.app",
  messagingSenderId: "679303457970",
  appId: "1:679303457970:web:b70f31d68dc4803f942dab",
  measurementId: "G-6ZYW9K7Z9P"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);