import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAsp5J4YFVlzxle6JbyMF1avaAxaKXO7fY",
  authDomain: "tawzifak-30c62.firebaseapp.com",
  projectId: "tawzifak-30c62",
  storageBucket: "tawzifak-30c62.appspot.com",
  messagingSenderId: "699343711686",
  appId: "1:699343711686:web:87b31244c755995c4256c7",
  measurementId: "G-FJ9YT2861Z"
};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
