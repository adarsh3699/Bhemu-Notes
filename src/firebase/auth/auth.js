import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    sendEmailVerification,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
} from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyDtwrqzjyug397_iZptPuBA_xgsRqYNujQ',
    databaseURL: 'https://learning-firebase-2b9af-default-rtdb.firebaseio.com',
    projectId: 'learning-firebase-2b9af',
    storageBucket: 'learning-firebase-2b9af.appspot.com',
    messagingSenderId: '147784663877',
    appId: '1:147784663877:web:930807a84b5d2aafaeb42c',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

getAnalytics(app);

function handleLoginForm(e, setMsg) {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!email || !password) return setMsg('Please Enter Your Email and Password');

    signInWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            console.log('user signed');
            document.location.href = '/home';
        })
        .catch((err) => {
            setMsg(err.code);
        });
}

function handleSignUpForm(e, setMsg) {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;
    const confPassword = e.target.confPassword.value;
    const displayName = e.target.displayName.value;

    if (!email || !password || !confPassword || !displayName) return setMsg('Please enter all data');
    if (password !== confPassword) return setMsg("Passwords didn't match.");

    createUserWithEmailAndPassword(auth, email, password, displayName)
        .then((cred) => {
            sendEmailVerification(cred.user).then(() => {
                setMsg('Email verification sent. Please also check in spam');
            });

            updateProfile(cred.user, { displayName, emailVerified: true })
                .then(() => {
                    console.log('user signed');
                    document.location.href = '/home';
                })
                .catch((err) => {
                    setMsg(err.code);
                });
        })
        .catch((err) => {
            setMsg(err.code);
        });
}

function handleSignOut() {
    signOut(auth)
        .then(() => {
            console.log('sgin out');
        })
        .catch((err) => {
            console.log(err.code);
        });
}

function handleForgetPassword(e, setMsg) {
    e.preventDefault();

    const email = e.target.email.value;
    sendPasswordResetEmail(auth, email)
        .then(() => {
            setMsg('Password reset email sent. Please also check spam');
        })
        .catch((error) => {
            console.log(error.code);
            setMsg(error.code);
        });
}

function handleUserState(currentPage) {
    if (!currentPage) return console.log('Missing currentPage');
    onAuthStateChanged(auth, (user) => {
        console.log(user);
        if (currentPage === 'loginPage' && user !== null) {
            console.log('if');
            document.location.href = '/home';
        } else if (currentPage === 'homePage' && user === null) {
            document.location.href = '/';
            console.log('else');
        }
    });
}

export { handleSignUpForm, handleLoginForm, handleSignOut, handleUserState, handleForgetPassword };
