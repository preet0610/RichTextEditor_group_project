import firebase from "firebase";

const firebaseConfig = {
	apiKey: "AIzaSyCsYJ61m6GcjivnTFDMf6qKJNbnfHN7B5k",
	authDomain: "rich-text-editor-cdb3c.firebaseapp.com",
	projectId: "rich-text-editor-cdb3c",
	storageBucket: "rich-text-editor-cdb3c.appspot.com",
	messagingSenderId: "521120323603",
	appId: "1:521120323603:web:106de77120b3828e5947e6"
  };

//   This is firebase config file rich-text app

const app = !firebase.apps.length
	? firebase.initializeApp(firebaseConfig)
	: firebase.app();

const db = app.firestore();

export { db };
