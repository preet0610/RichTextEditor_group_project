import { Button } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import { MdArticle } from "react-icons/";

function DocumentRow({ id, fileName, date }) {
	const router = useRouter();
	return (
		<div
			onClick={() => router.push(`/doc/${id}`)}
			className="items-center p-4 rounded-lg hover:bg-gray-100 text-gray-700 text-sm cursor-pointer"
		>
			<MdArticle size="3xl" color="blue" />
			<p className="flex-grow pl-5 w-10 pr-10 truncate">{fileName}</p>
			<p className="pr-5 text-sm">{date?.to_Date().toLocaleDateString()}</p>
		</div>
	);
}

export default DocumentRow;
