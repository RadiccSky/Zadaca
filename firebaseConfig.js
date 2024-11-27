import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC1qC41cVrpc0JPHUJGPWVYWK_ToNejIAE",
    authDomain: "mathapp-ed79d.firebaseapp.com",
    projectId: "mathapp-ed79d",
    storageBucket: "mathapp-ed79d.firebasestorage.app",
    messagingSenderId: "256406680719",
    appId: "1:256406680719:web:7086189bda7e9d92d9ecfa"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };