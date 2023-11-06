import { useContext, createContext, useState, useEffect } from "react";
import {
	signInWithPopup,
	signOut,
	onAuthStateChanged,
	GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase";
import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

// Function to add user data to Firestore
const addUserToFirestore = async (uid, userData) => {
	const userRef = doc(db, "users", uid);
	try {
		await setDoc(userRef, userData, { merge: true });
		console.log("User data added to Firestore");
	} catch (error) {
		console.error("Error adding user data to Firestore:", error);
	}
};

// Function to retrieve user data from Firestore
const getUserDataFromFirestore = async (uid) => {
	const userRef = doc(db, "users", uid);
	try {
		const userSnapshot = await getDoc(userRef);
		if (userSnapshot.exists()) {
			return userSnapshot.data();
		} else {
			console.log("User data not found in Firestore");
			return null;
		}
	} catch (error) {
		console.error("Error retrieving user data from Firestore:", error);
		return null;
	}
};

export const AuthContextProvider = ({ children }) => {
	const [user, setUser] = useState(null);

	const googleSignIn = () => {
		const provider = new GoogleAuthProvider();
		signInWithPopup(auth, provider);
	};
	const logOut = () => {
		signOut(auth);
	};

	// this is used for :
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			if (currentUser) {
				// Add user to Firestore when signing in
				addUserToFirestore(currentUser.uid, {
					displayName: currentUser.displayName,
					email: currentUser.email,
					// Add other user data as needed
				});
			}

			setUser(currentUser);
		});
		return () => unsubscribe();
	}, [user]);

	return (
		<AuthContext.Provider value={{ user, googleSignIn, logOut }}>
			{children}
		</AuthContext.Provider>
	);
};

export const UserAuth = () => {
	return useContext(AuthContext);
};
