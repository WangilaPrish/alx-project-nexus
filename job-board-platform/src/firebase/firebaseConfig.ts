// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAiyTy1VtqYSiGp5bkplfHrlV7FbSl2lVU",
  authDomain: "jobs-board-platforn.firebaseapp.com",
  projectId: "jobs-board-platforn",
  storageBucket: "jobs-board-platforn.firebasestorage.app",
  messagingSenderId: "357616468060",
  appId: "1:357616468060:web:e8b267d765df4eac742699",
  measurementId: "G-KM2PSS4VN2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
