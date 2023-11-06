import React from "react";
import Image from "next/image";

import { UserAuth } from "../context/AuthContext";

import { IconButton } from "@material-tailwind/react";

function Login() {
	const { user, googleSignIn, logOut } = UserAuth();
	const handleSignIn = async () => {
		try {
			await googleSignIn();
		} catch (error) {
			console.log(error);
		}
	};

	const handleSignOut = async () => {
		try {
			await logOut();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="flex flex-column items-center justify-center min-h-screen py-2">
			<Image
				src="https://links.papareact.com/1ui"
				height="300"
				width="550"
				objectFit="contain"
			/>
			<IconButton
				color="gray"
				variant="text"
				className="rounded ml-5 md:ml-20 h-20 border-0"
				onClick={handleSignIn}
			>
				Log In
			</IconButton>
			<IconButton
				color="gray"
				variant="text"
				className="rounded ml-5 md:ml-20 h-20 border-0"
				onClick={handleSignIn}
			>
				Sign UP
			</IconButton>
		</div>
	);
}

export default Login;
