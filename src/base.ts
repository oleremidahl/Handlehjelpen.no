import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC9kxlhhZ8sbqPpjbglf_kX4o6TZHp_1qo",
  authDomain: "feriemodus-8b552.firebaseapp.com",
  databaseURL: "https://feriemodus-8b552-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "feriemodus-8b552",
  storageBucket: "feriemodus-8b552.appspot.com",
  messagingSenderId: "14494775879",
  appId: "1:14494775879:web:3cba9547c5a85e51fb4f62",
  measurementId: "G-6D2EQVG1E0"
}; //this is where your firebase app values you copied will go

const app = firebase.initializeApp(firebaseConfig);

export const database = getDatabase(app);

export const auth = firebase.auth();