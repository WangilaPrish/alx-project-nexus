import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAiyTy1VtqYSiGp5bkplfHrlV7FbSl2lVU",
  authDomain: "jobs-board-platforn.firebaseapp.com",
  projectId: "jobs-board-platforn",
  storageBucket: "jobs-board-platforn.appspot.com",
  messagingSenderId: "357616468060",
  appId: "1:357616468060:web:e8b267d765df4eac742699",
  measurementId: "G-KM2PSS4VN2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
