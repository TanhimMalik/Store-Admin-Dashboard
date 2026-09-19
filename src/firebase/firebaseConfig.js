// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB9SFsq6t94vGXCRLOGr37TgHHVftkQZBA",
  authDomain: "store-admin-dash-tm.firebaseapp.com",
  projectId: "store-admin-dash-tm",
  storageBucket: "store-admin-dash-tm.firebasestorage.app",
  messagingSenderId: "424675441534",
  appId: "1:424675441534:web:aaae4f50297fff9075112f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth };
