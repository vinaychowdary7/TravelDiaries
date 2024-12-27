import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAF7CKrIBr7vV-017Ko5hLyoYqTDhU_TRU",
  authDomain: "traveldiaries-blog.firebaseapp.com",
  projectId: "traveldiaries-blog",
  storageBucket: "traveldiaries-blog.firebasestorage.app",
  messagingSenderId: "968710005082",
  appId: "1:968710005082:web:4ca80504401d0f4c5d1363"
};

const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async() => {

    let user=null;
    await signInWithPopup(auth,provider)
    .then((result)=>{
        user=result.user;
    })
    .catch((err)=>{
        console.log(err)
    })
    return user;
}