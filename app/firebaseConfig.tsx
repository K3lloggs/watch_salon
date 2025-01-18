// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDWDQx80cSrbxhZ6ScKmbiXON7Kq71znaM",
  authDomain: "salon-5c0e1.firebaseapp.com",
  projectId: "salon-5c0e1",
  storageBucket: "salon-5c0e1.firebasestorage.app",
  messagingSenderId: "347061878586",
  appId: "1:347061878586:web:828008b3664bcaaf7a1a03",
  measurementId: "G-E4Q09LHSRF"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app);
const analytics = getAnalytics(app);
