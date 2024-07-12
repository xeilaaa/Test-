import React from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCB9nN9WPvUdhUheKvnhyx5cqkHaLOgy4E",
  authDomain: "lots-to-do-app.firebaseapp.com",
  projectId: "lots-to-do-app",
  storageBucket: "lots-to-do-app.appspot.com",
  messagingSenderId: "122814497648",
  appId: "1:122814497648:web:0983276b3b8f822f1f45b5",
  measurementId: "G-FNVX7YHT5L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
 const auth = getAuth(app);
 const db = getFirestore(app);

export { auth, db };