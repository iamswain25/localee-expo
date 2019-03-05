import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";
const config = {
  apiKey: "AIzaSyBI7To_UdRP4vO2Im5OVIq32eQ1WSs7mTY",
  authDomain: "localee0.firebaseapp.com",
  databaseURL: "https://localee0.firebaseio.com",
  projectId: "localee0",
  storageBucket: "localee0.appspot.com",
  messagingSenderId: "1048297469944"
};
firebase.initializeApp(config);
const firestore = firebase.firestore();
const GeoPoint = firebase.firestore.GeoPoint;
export { firestore, firebase, GeoPoint };
