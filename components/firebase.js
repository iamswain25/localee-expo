import firebase from "firebase/app";
import "firebase/firestore";
import { GeoCollectionReference, GeoFirestore } from "geofirestore";
// import "firebase/storage";
// import "firebase/auth";
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
const geofirestore = new GeoFirestore(firestore);
let user = null;
const fs = {
  addTopic: async _obj => firestore.collection("topics").add(_obj),
  getMapTags: async _region => {
    const { latitude, longitude, latitudeDelta, longitudeDelta } = _region;
    console.log(latitude, longitude, latitudeDelta, longitudeDelta);
    let zoom = Math.round(Math.log(360 / Math.abs(longitudeDelta)) / Math.LN2);
    console.log(zoom);
    return geofirestore
      .collection("tags")
      .where("zoomLevel", "array-contains", zoom)
      .near({
        center: new GeoPoint(latitude, longitude),
        radius: latitudeDelta * 55
      })
      .get();
  }
};

export { firestore, firebase, GeoPoint, user, fs };
