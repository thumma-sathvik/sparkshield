// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBkzytG_G6ziNiWz9lIY2A8JkV0zPJZC9c",
  authDomain: "sparkshield-c499d.firebaseapp.com",
  projectId: "sparkshield-c499d",
  storageBucket: "sparkshield-c499d.firebasestorage.app",
  messagingSenderId: "353613894576",
  appId: "1:353613894576:web:41dc57ff705ec5aece7c75",
  measurementId: "G-KJFZE3PXW7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);