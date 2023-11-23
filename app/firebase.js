// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyCsYJ61m6GcjivnTFDMf6qKJNbnfHN7B5k",
	authDomain: "rich-text-editor-cdb3c.firebaseapp.com",
	projectId: "rich-text-editor-cdb3c",
	storageBucket: "rich-text-editor-cdb3c.appspot.com",
	messagingSenderId: "521120323603",
	appId: "1:521120323603:web:106de77120b3828e5947e6"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// Create a Firestore instance

const db = getFirestore(app);

export { auth, db };
