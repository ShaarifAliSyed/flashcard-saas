// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-EPxu9rpD1CQH06SZDA82lQ-8Y-Pgf70",
  authDomain: "flashcardsaas-5f45d.firebaseapp.com",
  projectId: "flashcardsaas-5f45d",
  storageBucket: "flashcardsaas-5f45d.appspot.com",
  messagingSenderId: "510479434654",
  appId: "1:510479434654:web:456a8f20114840cfcdcc8f",
  measurementId: "G-9SCSPXD8NN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

// Initialize Analytics if supported and in a browser environment
let analytics;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

// Initialize Firestore
const db = getFirestore(app)

export {db, analytics}