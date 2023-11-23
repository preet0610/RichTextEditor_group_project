"use client";
import Header from "./components/Header";
import Login from "./components/Login";
import Image from "next/image";
import { IconButton } from "@material-tailwind/react";
import { FaBeer } from "react-icons/fa";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore"
import { useRouter } from "next/navigation";
import { MdArticle } from "react-icons/";

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

async function addDocument (name,user) {
	// console.log("Document adding");
	try{
		const docRef = await addDoc(collection(db,"userDocs",`${user.email}`,"docs"), {
			name:name,
			timeCreated:serverTimestamp()
		});
		console.log("Document added", docRef.id);
		return docRef.id;
	}
	catch (error)
	{
		console.error(error);
		return false;
	}
};
export default function Home() {
	const { user, googleSignIn, logOut } = UserAuth();
	if(!user)
		return <Login />;
	const router = useRouter();
	console.log(user);
	const [showModal, setShowModal] = useState(false);
	const [input, setInput] = useState("");
	const [snap, loading, error] = useCollection(collection(db,"userDocs",`${user.email}`,"docs"));
	const getData = async (user,setSnap) => {
		console.log(user, "from getData");
		const querySnapshot = await getDocs(collection(db,"userDocs",`${user.email}`,"docs"));
		querySnapshot.forEach((doc) => {
			console.log(doc.id, " => ", doc.data());
		});
		setSnap(querySnapshot);
	}
	const createDocument = async (name) => {
		if (!name) return;

		const id = await addDocument(name,user);
		if(id)
		{
			setInput("");
			setShowModal(false);
			router.push(`/doc/${id}`)
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
					onKeyDown={(e) => e.key === "Enter" && createDocument(input)}
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
				<Button
					variant="gradient"
					color="green"
					onClick={() => createDocument(input)}
				>
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
						{snap?.docs.map(doc => (
							<div
							onClick={() => router.push(`/doc/${doc.id}`)}
							className="flex items-center p-4 rounded-lg hover:bg-gray-100 text-gray-700 text-sm cursor-pointer"
						>
							<p className="flex-grow pl-5 w-10 pr-10 truncate">{doc.data().name}</p>
							<p className="pr-5 text-sm">{Date(doc.data().timeCreated?.seconds)}</p>
							{console.log(doc.data().timeCreated)}
						</div>
						))}
						</div>
					</section>
				</div>
			)}
		</div>
	);
}
