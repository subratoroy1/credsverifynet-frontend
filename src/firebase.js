import firebase from "firebase";

const firebaseConfig = {
  apiKey: "xxxxxxxxxxxxxxxxxxxx",
  authDomain: "xxxxxxxx.firebaseapp.com",
  projectId: "credsverifynet",
  storageBucket: "credsverifynet.appspot.com",
  messagingSenderId: "111111111111",
  appId: "xxxxxxxxxxx",
  measurementId: "xxxxxxxxx",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();

export { db, auth };
