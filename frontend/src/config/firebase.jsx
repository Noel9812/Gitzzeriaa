// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyATOObOlxBkm71oD-kKdO2V4TflKedvEeM",
    authDomain: "gittzeria.firebaseapp.com",
    projectId: "gittzeria",
    storageBucket: "gittzeria.appspot.com",
    messagingSenderId: "498702583979",
    appId: "1:498702583979:web:ffe2a5e06e011a8f7c4fee",
    measurementId: "G-Z842GXFQX7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
 const auth = getAuth(app);
export const provider = new GoogleAuthProvider();


export { db , auth };