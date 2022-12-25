import { getAuth } from 'firebase/auth';
import { encryptText, decryptText } from '../utils';

import {
    getFirestore,
    collection,
    onSnapshot,
    getDocs,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
    query,
    where,
    serverTimestamp,
    orderBy,
} from 'firebase/firestore';

const auth = getAuth();
const database = getFirestore();
// collection ref
const colRef = collection(database, 'user_notes');

const userId = JSON.parse(localStorage.getItem('user_details'))?.userId || '';

function getUserAllNoteData(setAllNotes, setIsApiLoading, setMsg) {
    const getDataQuery = query(colRef, where('userId', '==', userId), orderBy('updatedOn', 'desc')); // orderBy('name', 'desc || ase')
    setIsApiLoading(true);
    onSnapshot(
        colRef,
        async (realSnapshot) => {
            await getDocs(getDataQuery)
                .then((snapshot) => {
                    let noteData = [];
                    snapshot.docs.forEach((doc) => {
                        noteData.push({
                            notesId: doc.id,
                            notesTitle: decryptText(doc.data().notesTitle),
                            noteType: doc.data().noteType,
                            noteData: JSON.parse(decryptText(doc.data().noteData)),
                            updatedOn: doc.data().updatedOn,
                        });
                    });
                    setIsApiLoading(false);
                    setAllNotes(noteData);
                })
                .catch((err) => {
                    setIsApiLoading(false);
                    console.log(err.message);
                    setMsg(err.code);
                });
        },
        (err) => {
            setIsApiLoading(false);
            console.log(err);
            setMsg(err.code);
        }
    );
}

//Add Notes
function addNewNote(upcomingData, handleNoteOpening, setMsg, setIsApiLoading) {
    const userId = auth?.currentUser?.uid;
    const { newNotesTitle, newNoteType, newNoteData } = upcomingData;

    const encryptTitle = encryptText(newNotesTitle ? newNotesTitle?.trim() : newNotesTitle);
    const stringifyedNoteData = JSON.stringify(newNoteData);
    const encryptNoteData = encryptText(stringifyedNoteData);

    addDoc(colRef, {
        userId,
        notesTitle: encryptTitle,
        noteType: newNoteType,
        noteData: encryptNoteData,
        createdAt: serverTimestamp(),
        updatedOn: serverTimestamp(),
    })
        .then((e) => {
            handleNoteOpening(e?.id, newNoteType, newNotesTitle, newNoteData);
            setIsApiLoading(false);
        })
        .catch((err) => {
            setIsApiLoading(false);
            setMsg(err.code);
            console.log(err);
        });
}
//delete Notes
function deleteData(noteId, setIsApiLoading, setMsg) {
    const docRef = doc(database, 'user_notes', noteId);

    deleteDoc(docRef)
        .then((e) => {
            setIsApiLoading(false);
        })
        .catch((err) => {
            console.log(err.message);
            setMsg(err.code);
        });
}

//update notes
function updateDocument(upcomingData, setIsSaveBtnLoading, setIsNotesModalOpen) {
    const { noteId, notesTitle, noteData } = upcomingData;
    const encryptTitle = encryptText(notesTitle ? notesTitle?.trim() : notesTitle);
    const stringifyedNoteData = JSON.stringify(noteData);
    const encryptNoteData = encryptText(stringifyedNoteData);

    const docRef = doc(database, 'user_notes', noteId);

    updateDoc(docRef, {
        notesTitle: encryptTitle,
        noteData: encryptNoteData,
        updatedOn: serverTimestamp(),
    })
        .then(() => {
            setIsSaveBtnLoading(false);
        })
        .catch((err) => {
            setIsNotesModalOpen(false);
            setIsSaveBtnLoading(false);
            console.log(err.message);
        });
}

export { getUserAllNoteData, addNewNote, deleteData, updateDocument };
