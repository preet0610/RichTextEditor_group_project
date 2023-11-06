import firebase from "firebase";

const firebaseConfig = {
	apiKey: "AIzaSyBRZ9zfjQ6eqnOItDi_SKETjQ2fcFKokG0",
	authDomain: "rich-text-857c6.firebaseapp.com",
	projectId: "rich-text-857c6",
	storageBucket: "rich-text-857c6.appspot.com",
	messagingSenderId: "711278973444",
	appId: "1:711278973444:web:e0dcaf4ce7f1b576e71b51",
};

//   This is firebase config file rich-text app

const app = !firebase.apps.length
	? firebase.initializeApp(firebaseConfig)
	: firebase.app();

const db = app.firestore();

export { db };
