// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// TODO: Replace with your Firebase project configuration
// You'll get this from Firebase Console > Project Settings > General > Your apps
const firebaseConfig = {
  apiKey: "AIzaSyAkB6c3m8QWdriPgEDoUmPDuhyWNg_ms_0",
  authDomain: "independence-day-2025-10857.firebaseapp.com",
  projectId: "independence-day-2025-10857",
  storageBucket: "independence-day-2025-10857.firebasestorage.app",
  messagingSenderId: "853758890375",
  appId: "1:853758890375:web:579bf39feee4fefb368322"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Optional: Connect to Firestore emulator in development
// Uncomment the lines below if you want to use the local emulator
// if (process.env.NODE_ENV === 'development') {
//   connectFirestoreEmulator(db, 'localhost', 8080);
// }

export default app;
