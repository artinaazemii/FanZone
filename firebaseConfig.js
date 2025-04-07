import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserSessionPersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBDSxr6tcko18OaGKR4FbV22-n-aLHD3VA",
  authDomain: "fanzone-5a8be.firebaseapp.com",
  projectId: "fanzone-5a8be",
  storageBucket: "fanzone-5a8be.appspot.com",
  messagingSenderId: "828963614536",
  appId: "1:828963614536:web:6c8fc10f096a56ded08d7d",
  measurementId: "G-V2EGR13YL8" // mund të qëndrojë këtu, nuk është problem
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Set persistence
setPersistence(auth, browserSessionPersistence)  // Adjust the persistence according to your needs
  .then(() => {
    console.log('Persistence set');
  })
  .catch((error) => {
    console.error('Error setting persistence', error);
  });

export { auth };