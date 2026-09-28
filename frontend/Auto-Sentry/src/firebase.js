// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_STORAGE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_STORAGE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_STORAGE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_STORAGE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_STORAGE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);