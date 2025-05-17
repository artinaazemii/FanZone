import { initializeApp } from "firebase/app";
import { getAuth }       from "firebase/auth";
import { getFirestore }  from "firebase/firestore";
import { getStorage }    from "firebase/storage";

const firebaseConfig = {
  apiKey:            "AIzaSyBDSxr6tcko18OaGKR4FbV22-n-aLHD3VA",
  authDomain:        "fanzone-5a8be.firebaseapp.com",
  projectId:         "fanzone-5a8be",
  storageBucket:     "fanzone-5a8be.appspot.com",
  messagingSenderId: "828963614536",
  appId:             "1:828963614536:web:6c8fc10f096a56ded08d7d",
  measurementId:     "G-V2EGR13YL8",
};


// if (Platform.OS === 'web') {
//   auth = getAuth(app); // Web nuk mbështet getReactNativePersistence
// } else {
//   auth = initializeAuth(app, {
//     persistence: getReactNativePersistence(AsyncStorage),
//   });
// }

const app      = initializeApp(firebaseConfig);
export const auth    = getAuth(app);
export const db      = getFirestore(app);
export const storage = getStorage(app);
