import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyBDSxr6tcko18OaGKR4FbV22-n-aLHD3VA",
  authDomain: "fanzone-5a8be.firebaseapp.com",
  projectId: "fanzone-5a8be",
  storageBucket: "fanzone-5a8be.appspot.com",
  messagingSenderId: "828963614536",
  appId: "1:828963614536:web:6c8fc10f096a56ded08d7d",
  measurementId: "G-V2EGR13YL8"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let auth;

if (Platform.OS === "web") {
  auth = getAuth(app);
} else {
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  } catch (e) {
    auth = getAuth(app); 
  }
}

const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
