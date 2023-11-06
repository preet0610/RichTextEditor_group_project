"use client";
import Header from "./components/Header";
import Login from "./components/Login";
import Image from "next/image";
import { IconButton } from "@material-tailwind/react";
import { FaBeer } from "react-icons/fa";
import { doc, addDoc, setDoc } from "firebase/firestore";
import { useState } from "react";

import { useRouter } from "next/navigation";

import {
	Button,
	Dialog,
	DialogHeader,
	DialogBody,
	DialogFooter,
} from "@material-tailwind/react";

import { UserAuth } from "./context/AuthContext";
import { db } from "./firebase";

import { serverTimestamp } from "firebase/firestore";

export default function Home() {
	const { user } = UserAuth();
	const router = useRouter();

	const [showModal, setShowModal] = useState(false);
	const [input, setInput] = useState("");

	// const createDocument = () => {
	// 	if (!input) return;
	// 	db.collection("userDocs").doc(user.email).collection("docs").add({
	// 		fileName: input,
	// 		timestamp: firebase.firestore.FieldValue.serverTimestamp(),
	// 	});
	// 	setInput("");
	// 	setShowModal(false);
	// };

	const createDocument = async () => {
		if (!input) return;

		// router.push(`/doc/1`);

		const docRef = doc(db, "userDocs", user.email);

		try {
			console.log("hi");
			await setDoc(docRef, {
				fileName: input,
				timestamp: serverTimestamp(),
			});
			setInput("");
			setShowModal(false);
		} catch (error) {
			// Handle any errors that occur during document creation.
			console.error("Error adding document: ", error);
		}
	};

	const modal = (
		<Dialog open={showModal} handler={setShowModal}>
			<DialogHeader>create a Doc</DialogHeader>
			<DialogBody>
				<input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					type="text"
					className="outline-none w-full"
					onKeyDown={(e) => e.key === "Enter" && createDocument()}
				></input>
			</DialogBody>
			<DialogFooter>
				<Button
					variant="text"
					color="red"
					onClick={() => {
						setInput("");
						setShowModal(false);
					}}
					className="mr-1"
				>
					<span>Cancel</span>
				</Button>
				<Button variant="gradient" color="green" onClick={createDocument}>
					<span>Create</span>
				</Button>
			</DialogFooter>
		</Dialog>
	);

	return (
		<div>
			{!user ? (
				<Login />
			) : (
				<div>
					<Header />
					{modal}
					<section className="bg-[#F8F9FA] pb-10 px-10">
						<div className="max-w-3xl mx-auto">
							<div className="flex items-center justify-between py-6">
								<h2 className="text-gray-700 text-lg">Start a new Document</h2>
								<IconButton
									color="gray"
									variant="text"
									className="rounded ml-5 md:ml-20 h-20 border-0"
								>
									<FaBeer size={"lg"} />
								</IconButton>
							</div>
							<div>
								<div className="relative h-52 w-40 border-2 cursor-pointer hover:border-blue-700  shadow-lg">
									<Image
										src={"https://links.papareact.com/pju"}
										layout="fill"
										onClick={() => setShowModal(true)}
									/>
								</div>
								<p className="ml-2 mt-2 font-semibold text-sm text-gray-700">
									Blank
								</p>
							</div>
						</div>
					</section>
					<section className="bg-white px-10 md:px-0">
						<div className="max-w-3xl mx-auto py-8">
							<div className="flex items-center justify-between pb-5 text-gray-700">
								<h2 className="font-medium flex-grow">My Documents</h2>
								<p className="mr-12">Date Created</p>
								<FaBeer />
							</div>
						</div>
					</section>
				</div>
			)}
		</div>
	);
}
