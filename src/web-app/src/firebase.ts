import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDhbfjCHCDDmIREO9-IboRp5nuxfx5uT88",
  authDomain: "doctormatt-board-games.firebaseapp.com",
  projectId: "doctormatt-board-games",
  storageBucket: "doctormatt-board-games.firebasestorage.app",
  messagingSenderId: "957766129835",
  appId: "1:957766129835:web:38d40ddd2364f6f14d3fee",
  measurementId: "G-PZPSSJ7M8F",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db, analytics };
