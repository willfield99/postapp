// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore} from 'firebase/firestore';//used to initialize connection to firestore
// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: "AIzaSyD3701gR3agYlCUrvCPt9pR6ciRfkezZHk",

  authDomain: "postapp-c8e64.firebaseapp.com",

  projectId: "postapp-c8e64",

  storageBucket: "postapp-c8e64.appspot.com",

  messagingSenderId: "858892365858",

  appId: "1:858892365858:web:21dc42a048ca0498d05a7b"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);//initalizingour db