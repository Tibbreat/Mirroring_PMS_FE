// firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue } from 'firebase/database';
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyDCQx4ckv1rJxw5ZGSl96R5-8EWScThHSg",
    authDomain: "demowebsocket-c85fb.firebaseapp.com",
    databaseURL: "https://demowebsocket-c85fb-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "demowebsocket-c85fb",
    storageBucket: "demowebsocket-c85fb.appspot.com",
    messagingSenderId: "963477166802",
    appId: "1:963477166802:web:934877c70df2d9e3a36b0b",
    measurementId: "G-D9BLR8X5CS"
  };

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()
export { database, ref, set, onValue };
