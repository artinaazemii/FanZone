// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore, setLogLevel } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBDSxr6tcko18OaGKR4FbV22-n-aLHD3VA",
  authDomain: "fanzone-5a8be.firebaseapp.com",
  projectId: "fanzone-5a8be",
  storageBucket: "fanzone-5a8be.appspot.com",
  messagingSenderId: "828963614536",
  appId: "1:828963614536:web:6c8fc10f096a56ded08d7d",
  measurementId: "G-V2EGR13YL8" // mund të qëndrojë këtu, nuk është problem
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Optional: enable debug logs
setLogLevel('debug');
