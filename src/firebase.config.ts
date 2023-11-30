import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCnmzX7RqnUdGGLND-EiAtQhi8e6A-QCXg",
  authDomain: "admin-colors.firebaseapp.com",
  projectId: "admin-colors",
  storageBucket: "admin-colors.appspot.com",
  messagingSenderId: "1078187726948",
  appId: "1:1078187726948:web:c4522175ee752b8be42771",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
