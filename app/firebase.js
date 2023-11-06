// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyDc554grupfsN67iltK9q4PMbsLpnJ9ahs",
	authDomain: "richtextedd.firebaseapp.com",
	projectId: "richtextedd",
	storageBucket: "richtextedd.appspot.com",
	messagingSenderId: "730768564000",
	appId: "1:730768564000:web:99e7d9229a90a5a09c4145",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// Create a Firestore instance

const db = getFirestore(app);

export { auth, db };
