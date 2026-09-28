import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_HISTORY_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_HISTORY_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_HISTORY_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_HISTORY_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_HISTORY_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_HISTORY_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const imgDB = getStorage(app)
const txtDB = getFirestore(app)

export {imgDB,txtDB};