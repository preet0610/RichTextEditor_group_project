import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertFromRaw, convertToRaw, ContentState, Modifier, CompositeDecorator} from "draft-js"
import { usePathname } from 'next/navigation'
import { count, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { UserAuth } from "../context/AuthContext";
import { useDocument } from "react-firebase-hooks/firestore";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import {
	Button,
	Dialog,
	DialogHeader,
	DialogBody,
	DialogFooter,
} from "@material-tailwind/react";

const Editor = dynamic(
    () => import("react-draft-wysiwyg").then((module) => module.Editor),
    {
        ssr: false
    }
);
const SearchHighlight = (props) => (
    <span className="bg-yellow">{props.children}</span>
  );
function TextEditor() {
    const {user} = UserAuth();
    const [showModal, setShowModal] = useState(false);
    const [inputFind, setInputFind] = useState("");
    const [inputReplace, setInputReplace] = useState("");
    const [editorState, setEditorState] = useState();
    const pathname = usePathname()
    const id  = pathname.substring(5);
    const [snapshot, loadingSnapshot, error] = useDocument(doc(db,"userDocs",`${user.email}`,"docs",`${id}`));
    let initEd;
    
    useEffect(() => {
        if(!loadingSnapshot && snapshot){
            console.log(snapshot.data());
            const html = snapshot.data().editorState;
            let contentBlock;
            if(html !== undefined)
            {
                contentBlock = htmlToDraft(html);
            }
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                initEd = EditorState.createWithContent(contentState);
            }
        }
        setEditorState(initEd);
    },[loadingSnapshot])
    const onEditorStateChange = (editorState) => {
        setEditorState(editorState);
        // console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())))
        const docRef = doc(db,"userDocs",`${user.email}`,"docs",`${id}`);
        setDoc(docRef, { editorState:draftToHtml(convertToRaw(editorState.getCurrentContent()))
        }, { merge: true });
        // console.log(editorState._immutable.currentContent.blockMap._list._tail.array)
    };
    const findWithRegex = (regex, contentBlock, callback) => {
        const text = contentBlock.getText();
        let matchArr, start, end;
        while ((matchArr = regex.exec(text)) !== null) {
          start = matchArr.index;
          end = start + matchArr[0].length;
          callback(start, end);
        }
      };
    const generateDecorator = (highlightTerm) => {
        const regex = new RegExp(highlightTerm, 'g');
        return new CompositeDecorator([{
          strategy: (contentBlock, callback) => {
            if (highlightTerm !== '') {
              findWithRegex(regex, contentBlock, callback);
            }
          },
          component: SearchHighlight,
        }])
      };
    // const modal = (
	// 	<Dialog open={showModal} handler={setShowModal}>
	// 		<DialogHeader>Find And Replace</DialogHeader>
	// 		<DialogBody>
    //             <label>Find:</label>
	// 			<input
	// 				value={inputFind}
	// 				onChange={(e) => setInputFind(e.target.value)}
	// 				type="text"
	// 				className="outline-none w-full bg-gray-100"
	// 			></input>
    //             <label>Replace:</label>
    //             <input
	// 				value={inputReplace}
	// 				onChange={(e) => setInputReplace(e.target.value)}
	// 				type="text"
	// 				className="outline-none w-full bg-gray-100"
	// 			></input>
	// 		</DialogBody>
	// 		<DialogFooter>
	// 			<Button
	// 				variant="text"
	// 				color="red"
	// 				onClick={() => {
	// 					setInputFind("");
    //                     setInputReplace("");
	// 					setShowModal(false);
	// 				}}
	// 				className="mr-1"
	// 			>
	// 				<span>Cancel</span>
	// 			</Button>
	// 			<Button
	// 				variant="gradient"
	// 				color="green"
	// 				// onClick={() => findReplace(inputFind,inputReplace)}
    //                 onClick={() => insertCharacter('a',editorState)}
	// 			>
	// 				<span>Find And Replace</span>
	// 			</Button>
	// 		</DialogFooter>
	// 	</Dialog>
	// );
    // function insertCharacter(characterToInsert, editorState) {
    //     const currentContent = editorState.getCurrentContent(),
    //           currentSelection = editorState.getSelection();
    //     console.log("currentSelection: ", currentSelection);
    //     const newContent = Modifier.replaceText(
    //       currentContent,
    //       currentSelection,
    //       characterToInsert
    //     );
      
    //     const newEditorState = EditorState.push(editorState, newContent, 'insert-characters');
      
    //      setEditorState(EditorState.forceSelection(newEditorState, newContent.getSelectionAfter()));
    //   }
    // const findReplace = (find,replace) => {
    //     setShowModal(false);
    //     console.log(find, replace);
    //     (editorState._immutable.currentContent.blockMap._list._tail.array).forEach(element => {
    //         console.log(element[1].text);
    //         var count = 0;
    //         console.log((element[1].text).replace(find,function(x){count+=1;return replace}));
    //         console.log(count);
    //     });
    //     // console.log(editorState);
    // }
    return (
        <div className="bg-[#f8f9fa] min-h-screen pb-16">
            <Editor
                editorState={editorState}
                onEditorStateChange={onEditorStateChange}
                toolbarClassName="flex sticky top-0 z-50 !justify-center mx-auto" 
                editorClassName="mt-6 bg-white shadow-lg max-w-5xl mx-auto mb-12 border p-10"
                toolbar={{
                    inline: { inDropdown: true },
                    list: { inDropdown: true },
                    textAlign: { inDropdown: true },
                    link: { inDropdown: true },
                    history: { inDropdown: true },
                  }}
                toolbarCustomButtons={[
                    <div className="search-and-replace">
          <input
            value={inputFind}
            onChange={(e) => {setInputFind(e.target.value);
                setEditorState(EditorState.set(editorState,{ decorator: generateDecorator(inputFind) }))    
            }}
            placeholder="Search..."
          />
          <input
            value={inputReplace}
            onChange={(e) => setInputReplace(e.target.value)}
            placeholder="Replace..."
          />
          <button>
            Replace
          </button>
        </div>
            ]}
            />
        </div>
    );
}

export default TextEditor;