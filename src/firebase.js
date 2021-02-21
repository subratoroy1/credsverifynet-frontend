import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyD0kpLvddRDD6AawbU9y3ucgJvqKl7EAvU",
  authDomain: "credsverifynet.firebaseapp.com",
  projectId: "credsverifynet",
  storageBucket: "credsverifynet.appspot.com",
  messagingSenderId: "620384758669",
  appId: "1:620384758669:web:f81d0af4dcebc4fa2cebc4",
  measurementId: "G-EEFLPVZ193",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();

export { db, auth };
