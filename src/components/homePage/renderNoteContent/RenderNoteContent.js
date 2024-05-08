import React, { useCallback, useRef, useEffect } from 'react';

import ReactQuill from 'react-quill';
import QuillToolbar, { modules, formats } from './QuillToolbar';
// import { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import './renderNoteContent.css';

function RenderNoteContent({
	isSaveBtnLoading,
	handleNotesModalClosing,
	toggleShareDialogBox,
	openedNoteAllData,
	// noteText,
	openedNoteText,
	setOpenedNoteText,
	handleSaveBtnClick,
	openConfirmationDialog, // handleDeleteBtnClick,
	handleAddShareNoteUser,
	isShareNoteType,
	handleMsgShown,
}) {
	const quillRef = useRef(null);

	useEffect(() => {
		if (!isShareNoteType) quillRef?.current?.focus();
	}, [openedNoteAllData.noteId, isShareNoteType]);

	const showShareNoteError = useCallback(() => {
		handleMsgShown('Please create a account to edit this note', 'warning');
	}, [handleMsgShown]);

	return (
		<div className="text-editor">
			<QuillToolbar
				handleNotesModalClosing={handleNotesModalClosing}
				isSaveBtnLoading={isSaveBtnLoading}
				openConfirmationDialog={openConfirmationDialog}
				handleSaveBtnClick={handleSaveBtnClick}
				handleAddShareNoteUser={handleAddShareNoteUser}
				toggleShareDialogBox={toggleShareDialogBox}
				isShareNoteType={isShareNoteType}
				showShareNoteError={showShareNoteError}
			/>
			<ReactQuill
				ref={quillRef}
				theme="snow"
				formats={formats}
				value={openedNoteText}
				// defaultValue={new Delta().insert('Hello').insert('\n', { header: 1 }).insert('\n').insert('\n')}
				onChange={setOpenedNoteText}
				readOnly={isShareNoteType}
				placeholder="Write something awesome..."
				modules={modules}
			/>
		</div>
	);
}

export default RenderNoteContent;
