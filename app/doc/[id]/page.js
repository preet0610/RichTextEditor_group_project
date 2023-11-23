"use client";
import { Button, IconButton } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation'
import { db } from "../../firebase";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { signOut } from "firebase/auth";
import Login from "../../components/Login";
import {MdDescription} from "react-icons/md"
import {BsPeopleFill} from "react-icons/bs"
import TextEditor from "../../components/TextEditor"
import { UserAuth } from "../../context/AuthContext";
import { collection, doc, getDoc } from "firebase/firestore";
import { getServerSession } from "next-auth";

function Doc() {
    const router = useRouter();
    const {user} = UserAuth();
    if(!user)   return <Login />;  
    const pathname = usePathname()
    const id  = pathname.substring(5);
    const [snapshot, loadingSnapshot, error] = useDocument(doc(db,"userDocs",`${user.email}`,"docs",`${id}`));
    if(!loadingSnapshot && !snapshot?.data().name)
        router.replace("/")
    return (
        <div>
            <header className="flex justify-between items-center p-3 pb-1">
                <span onClick={() => router.push('/')} className="cursor-pointer">
                    <MdDescription size={50} color="#4284f3"/>
                </span>
                <div className="flex-grow px-2">
                    <h2>
                    {snapshot?.data().name}
                    </h2>
                    <div className="flex items-center text-sm space-x-1 -ml-1 h-8 text-gray-600">
                        <p className="option">File</p>
                        <p className="option">Edit</p>
                        <p className="option">View</p>
                        <p className="option">Insert</p>
                        <p className="option">Format</p>
                        <p className="option">Tools</p>
                    </div>
                </div>
                <Button
                    color="light-blue"
                    size="md"
                    className="hidden md:inline-flex h-10"
                >
                    <BsPeopleFill size={20} /> SHARE
                </Button>
                <img
                    className="cursor-pointer rounded-full h-10 w-10 ml-2"
                    src={user.photoURL}
                    alt=""
                />
            </header>
            <TextEditor />
        </div>
    )    
}

export default Doc;