// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBN2szwGld8R5ideCHLokguHYWGFnNp9Lg",
  authDomain: "admincrud-b4150.firebaseapp.com",
  projectId: "admincrud-b4150",
  storageBucket: "admincrud-b4150.appspot.com",
  messagingSenderId: "706458682803",
  appId: "1:706458682803:web:7ff375bd9b854f7597b7c6",
  measurementId: "G-BF36Z8NKCP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };

