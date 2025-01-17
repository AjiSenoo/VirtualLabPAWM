// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDbaQm2GFJerBmzZpQcTQZWK_opa0WclCA",
    authDomain: "virtuallab-7a932.firebaseapp.com",
    projectId: "virtuallab-7a932",
    storageBucket: "virtuallab-7a932.firebasestorage.app",
    messagingSenderId: "487927243648",
    appId: "1:487927243648:web:5025ae5d85849d1341d765",
    measurementId: "G-G9ZB82ESX7"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);