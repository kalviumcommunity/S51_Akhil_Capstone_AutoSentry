import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyB9sSNOiVAsOQBm6suFfL7oKIv_tmKVyJg",
  authDomain: "autosentry-file-history.firebaseapp.com",
  projectId: "autosentry-file-history",
  storageBucket: "autosentry-file-history.appspot.com",
  messagingSenderId: "700278950726",
  appId: "1:700278950726:web:1e9fa5da47c022d29b7347",
  measurementId: "G-MPEVEZWW80"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const imgDB = getStorage(app)
const txtDB = getFirestore(app)

export {imgDB,txtDB};