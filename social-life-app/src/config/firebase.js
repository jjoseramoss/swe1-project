// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
//this config is public data so it doesn't need to be added to a gitignore :)
const firebaseConfig = {
  apiKey: "AIzaSyA_Ff7Zx3m_0Nr1BArcVE_9C2pHjOJkvAE",
  authDomain: "swe1-project.firebaseapp.com",
  projectId: "swe1-project",
  storageBucket: "swe1-project.firebasestorage.app",
  messagingSenderId: "595132676573",
  appId: "1:595132676573:web:ffd9130a6a5b20f4b1de34",
  measurementId: "G-M9LS0MHP3Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
