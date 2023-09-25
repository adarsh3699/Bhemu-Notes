import React, { useState, useEffect, useCallback, useRef } from 'react';

import { handleUserState } from '../firebase/auth';
import { getUserAllNoteData, addNewNote, deleteData, updateDocument } from '../firebase/notes';
import { decryptText, userDeviceType } from '../utils';

import NavBar from '../components/homePage/navBar/NavBar';
import RenderNotesTitle from '../components/homePage/renderNotesTitle/RenderNotesTitle';
import RenderNoteContent from '../components/homePage/renderNoteContent/RenderNoteContent';
import ConfirmationDialog from '../components/confirmationDialog/ConfirmationDialogBox';
import ErrorMsg from '../components/errorMsg/ErrorMsg';

import Hotkeys from 'react-hot-keys';

import '../styles/homePage.css';

document.addEventListener(
	'keydown',
	(e) => {
		if (e.key === 's' && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
			e.preventDefault();
		}
	},
	true
);

const localStorageNotesData = JSON.parse(decryptText(localStorage.getItem('note_data')));

function HomePage() {
	const [msg, setMsg] = useState('');
	const [allNotes, setAllNotes] = useState(localStorageNotesData || []);

	const [myNotesId, setMyNotesId] = useState('');
	const [notesTitle, setNotesTitle] = useState('');
	const [openedNoteData, setOpenedNoteData] = useState([]);
	const [noteSharedWith, setNoteSharedWith] = useState([]);

	const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
	const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);

	const [isPageLoaded, setIsPageLoaded] = useState(false);
	const [isSaveBtnLoading, setIsSaveBtnLoading] = useState(false);
	const [isApiLoading, setIsApiLoading] = useState(false);
	const [focusedInput, setfocusedInput] = useState(null);
	const todoRef = useRef();
	const lastTextBoxRef = useRef();

	const openFirstNote = useCallback(function (allNotesAtr) {
		if (allNotesAtr.length === 0) return;
		setOpenedNoteData(allNotesAtr[0]?.noteData || []);
		setNotesTitle(allNotesAtr[0]?.notesTitle || '');
		setMyNotesId(allNotesAtr[0]?.notesId || '');
		setNoteSharedWith(allNotesAtr[0]?.noteSharedWith || []);
	}, []);

	// fetch All noteData
	useEffect(() => {
		handleUserState(true);
		if (JSON.parse(localStorage.getItem('user_details'))) {
			getUserAllNoteData(setAllNotes, setIsApiLoading, handleErrorShown);
			setIsPageLoaded(true);
			document.title = 'Bhemu Notes';
		}
	}, []);

	useEffect(() => {
		if (isNotesModalOpen === false && userDeviceType().desktop) {
			setIsNotesModalOpen(true);
			openFirstNote(allNotes);
		}
	}, [openFirstNote, allNotes, isNotesModalOpen]);

	const handleErrorShown = useCallback((msgText) => {
		if (msgText) {
			setMsg(msgText);
			setTimeout(() => {
				setMsg('');
			}, 2500);
		} else {
			console.log('Please Provide Text Msg');
		}
	}, []);

	const handleNoteOpening = useCallback(
		(noteId, title, data, shareWith) => {
			if (noteId) setMyNotesId(noteId);
			setNotesTitle(title);
			setOpenedNoteData(data);
			setIsNotesModalOpen(true);
			setNoteSharedWith(shareWith || []);
			if (userDeviceType().mobile) document.querySelector('body').style.overflow = 'hidden';
		},
		[setNotesTitle, setOpenedNoteData, setIsNotesModalOpen]
	);

	const handleNotesModalClosing = useCallback(() => {
		setIsNotesModalOpen(false);
		if (userDeviceType().mobile) document.querySelector('body').style.overflow = 'auto';
	}, []);

	//add Note Function
	const addNotes = useCallback(
		(e, notesTitle) => {
			setIsApiLoading(true);
			const newNotesTitle = notesTitle ? notesTitle : 'Enter Notes Title';
			const newNoteData = [{ element: '', type: 'note' }];

			const toSendNoteData = { newNotesTitle, newNoteData };
			handleNoteOpening('', newNotesTitle, newNoteData);
			addNewNote(toSendNoteData, setMyNotesId, handleErrorShown, setIsApiLoading);
		},
		[handleNoteOpening, handleErrorShown]
	);

	const handleAddNoteInputBox = useCallback(
		(e) => {
			e.preventDefault();
			const newNotesTitle = e.target.noteTitle.value.trim();
			if (newNotesTitle) {
				setIsApiLoading(true);
				const newNoteData = [{ element: '', type: 'note' }];

				const toSendNoteData = { newNotesTitle, newNoteData };
				handleNoteOpening('', newNotesTitle, newNoteData);
				addNewNote(toSendNoteData, setMyNotesId, handleErrorShown, setIsApiLoading);
				e.target.reset();
			}
		},
		[handleNoteOpening, handleErrorShown]
	);

	//handle note or todo save
	const handleSaveBtnClick = useCallback(async () => {
		setIsSaveBtnLoading(true);
		const toSendData = {
			noteId: myNotesId,
			notesTitle: document.getElementById('titleTextBox')?.innerText,
			noteData: openedNoteData,
			noteSharedWith: noteSharedWith,
		};
		updateDocument(toSendData, setIsSaveBtnLoading, setIsNotesModalOpen, handleErrorShown);
	}, [handleErrorShown, myNotesId, openedNoteData, noteSharedWith]);

	//handle note or todo delete
	const handleDeleteBtnClick = useCallback(async () => {
		handleNotesModalClosing();
		setIsConfirmationDialogOpen(false);

		deleteData(myNotesId, setIsApiLoading, handleErrorShown);
	}, [handleErrorShown, myNotesId, handleNotesModalClosing]);

	//handle todo checkbo click
	const handleCheckboxClick = useCallback(
		(index, isDone) => {
			const newToDos = openedNoteData.map(function (toDo, i) {
				return i === index ? { ...toDo, isDone: isDone ? false : true } : toDo;
			});
			setOpenedNoteData(newToDos);
		},
		[openedNoteData]
	);

	const handleNoteTextChange = useCallback(
		(index, e) => {
			const newToDos = openedNoteData.map(function (item, i) {
				return i === index ? { ...item, element: e.target.value } : item;
			});
			setOpenedNoteData(newToDos);
		},
		[openedNoteData]
	);

	const handleDeleteToDoBtnClick = useCallback(
		(index) => {
			let newToDos = openedNoteData.filter((data, i) => {
				return i !== index ? data : null;
			});

			setOpenedNoteData(newToDos);
		},
		[openedNoteData]
	);

	//function to handle when "ctrl + s" is pressed
	const handleShortcutKeyPress = useCallback(() => {
		if (isNotesModalOpen) {
			handleSaveBtnClick();
		}
	}, [handleSaveBtnClick, isNotesModalOpen]);

	const handleAddTodoBtn = useCallback(
		(e) => {
			let tempData = [...openedNoteData];
			if (lastTextBoxRef?.current) {
				lastTextBoxRef.current.style.minHeight = '';
				if (!lastTextBoxRef.current?.value.trim()) {
					tempData.splice(openedNoteData.length - 1, 0, { element: '', isDone: false, type: 'todo' });
					setfocusedInput(openedNoteData.length - 1);
				} else {
					tempData.push({ element: '', isDone: false, type: 'todo' }, { element: '', type: 'note' });
					setfocusedInput(openedNoteData.length);
				}
			}

			setOpenedNoteData(tempData);
		},
		[openedNoteData]
	);

	const handleAddShareNoteUser = useCallback(
		(e) => {
			e.preventDefault();
			if (e.target.shareEmailInput.value.trim() === '') return;
			setNoteSharedWith([...noteSharedWith, { userEmail: e.target.shareEmailInput.value, canEdit: false }]);
			e.target.reset();
		},
		[noteSharedWith]
	);

	const handleTodoEnterClick = useCallback(
		(e, index) => {
			e.preventDefault();
			if (e?.target?.value) {
				const tempData = [...openedNoteData];
				tempData.splice(index + 1, 0, { element: '', isDone: false, type: 'todo' });

				setOpenedNoteData(tempData);
			}
			document.getElementById('textbox_' + (index + 1)).focus();
			setfocusedInput(index + 1);
		},
		[openedNoteData]
	);

	// handleBackspaceClick in todo and note
	const handleBackspaceClick = useCallback(
		(e, index) => {
			if (e.target.value.trim() === '') {
				e.preventDefault();

				if (openedNoteData.length - 1 !== index) {
					//for last textbox
					let newToDos = openedNoteData.filter((data, i) => {
						return i !== index ? data : null;
					});
					setOpenedNoteData(newToDos);
				}
				if (openedNoteData.length - 1 !== index) {
					document.getElementById('textbox_' + (index - 1))?.focus();
				} else {
					setfocusedInput(index - 1);
				}
			}
		},
		[openedNoteData]
	);

	return (
		isPageLoaded && (
			<>
				<div id="homePage">
					<NavBar NavBarType="homePage" addNotes={addNotes} />

					<div id="allContent">
						<div id="notesTitleContainer">
							<RenderNotesTitle
								allNotes={allNotes}
								handleNoteOpening={handleNoteOpening}
								isApiLoading={isApiLoading}
								handleAddNoteInputBox={handleAddNoteInputBox}
							/>
						</div>
						{isNotesModalOpen && (
							<div id="noteContentContainer">
								{userDeviceType().mobile && <NavBar NavBarType="notesModal" addNotes={addNotes} />}
								<RenderNoteContent
									isSaveBtnLoading={isSaveBtnLoading}
									handleNotesModalClosing={handleNotesModalClosing}
									openConfirmationDialog={() => setIsConfirmationDialogOpen(true)}
									myNotesId={myNotesId}
									notesTitle={notesTitle}
									openedNoteData={openedNoteData}
									noteSharedWith={noteSharedWith}

									handleSaveBtnClick={handleSaveBtnClick}
									handleDeleteBtnClick={handleDeleteBtnClick}
									handleNoteTextChange={handleNoteTextChange}
									handleCheckboxClick={handleCheckboxClick}
									handleDeleteToDoBtnClick={handleDeleteToDoBtnClick}
									handleAddTodoBtn={handleAddTodoBtn}
									handleAddShareNoteUser={handleAddShareNoteUser}
									handleTodoEnterClick={handleTodoEnterClick}
									handleBackspaceClick={handleBackspaceClick}
									todoRef={todoRef}
									focusedInput={focusedInput}
									setfocusedInput={setfocusedInput}
									lastTextBoxRef={lastTextBoxRef}
								/>
							</div>
						)}
					</div>
				</div>

				<Hotkeys
					keyName="ctrl+s,control+s,⌘+s,ctrl+⇪+s,control+⇪+s,⌘+⇪+s"
					onKeyDown={handleShortcutKeyPress}
					// onKeyUp={onKeyUp}
					filter={(event) => {
						return true; //to enable shortcut key inside input, textarea and select too
					}}
				/>
				{isConfirmationDialogOpen && (
					<ConfirmationDialog
						title="Are You Sure?"
						message="You can't undo this action."
						isOpen={isConfirmationDialogOpen}
						setIsConfirmationDialogOpen={setIsConfirmationDialogOpen}
						onYesClick={handleDeleteBtnClick}
					/>
				)}
				{msg && <ErrorMsg isError={msg ? true : false} msgText={msg} />}
			</>
		)
	);
}

export default HomePage;
