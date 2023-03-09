// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js'
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https:/www.gstatic.com/firebasejs/9.17.1/firebase-auth.js"

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCYrEMnL6bZHOcv5Dg-kfhztAm44OsqaoI",
  authDomain: "e-commerce-5ec90.firebaseapp.com",
  projectId: "e-commerce-5ec90",
  storageBucket: "e-commerce-5ec90.appspot.com",
  messagingSenderId: "71935022764",
  appId: "1:71935022764:web:61e93ddfe7368ddf59b109",
  measurementId: "G-T2THEX3766"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app);
const auth = getAuth()
const provider = new GoogleAuthProvider()

export const authModule = { auth,analytics, provider, signInWithPopup, onAuthStateChanged }