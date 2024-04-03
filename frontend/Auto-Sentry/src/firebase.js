// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-zZZkQea2NPlxr0m1dLkHQsNatP6-eT8",
  authDomain: "akhil-storage.firebaseapp.com",
  projectId: "akhil-storage",
  storageBucket: "akhil-storage.appspot.com",
  messagingSenderId: "973708626181",
  appId: "1:973708626181:web:3f85b4f7178ea9e05a0f6c",
  measurementId: "G-BJJW0DRG3V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
