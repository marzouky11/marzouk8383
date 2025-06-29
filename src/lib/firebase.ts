// It is recommended to store these values in environment variables
// For example, in a .env.local file
// NEXT_PUBLIC_FIREBASE_API_KEY=...

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBmt0xTpNe4lLbPcGxRQ4HuBWZxgIve3r0",
    authDomain: "khidmanow-e6c63.firebaseapp.com",
    projectId: "khidmanow-e6c63",
    storageBucket: "khidmanow-e6c63.firebasestorage.app",
    messagingSenderId: "771104615194",
    appId: "1:771104615194:web:6fe79bf12566da60d95aa3",
    measurementId: "G-VTP3YS7VVH"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
