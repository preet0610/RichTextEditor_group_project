import { IconButton } from "@material-tailwind/react";
import { FaBeer } from "react-icons/fa";
import React from "react";

import { UserAuth } from "../context/AuthContext";

function Header() {
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

	// console.log(user);

	const srcImg = user.photoURL;
	return (
		<div className="sticky top-0 z-50 flex items-center px-4 py-2 shadow-md bg-white">
			<IconButton color="gray" variant="text" className=" h-20 w-20 border-0 ">
				Menu
				{/* add Icon */}
			</IconButton>
			<FaBeer className="ml-4" />
			<h1 className="hidden md:inline-flex ml-2 text-gray-700 text-2xl">
				RichText
			</h1>
			<div className="mx-5 md:mx-20 flex flex-grow items-center px-5 py-2 bg-gray-100 text-gray-600 rounded-lg focus-within:text-gray-600 focus-within:shadow-md ">
				<FaBeer color="gray" />
				<input
					type="text"
					placeholder="Search"
					className="flex-grow px-5 text-base bg-transparent outline-none"
				/>
			</div>
			<IconButton
				color="gray"
				variant="text"
				className="rounded ml-5 md:ml-20 h-20 border-0 mx-5"
			>
				Apps
			</IconButton>
			Hi, {user.displayName}
			<img
				loading="lazy"
				className="cursor-pointer h-12 w-12 rounded-full ml-2"
				src={srcImg}
				onClick={handleSignOut}
			></img>
		</div>
	);
}

export default Header;
