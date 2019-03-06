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
// firebase.auth().onAuthStateChanged(_user => {
//   user = _user;
// });
// firebase.auth().signInAnonymously();
const fs = {
  addTopic: async _obj => firestore.collection("topics").add(_obj),
  getMapTags: async _region => {
    const { latitude, longitude, latitudeDelta, longitudeDelta } = _region;
    let zoom = Math.round(Math.log(360 / longitudeDelta) / Math.LN2);
    console.log(zoom);
    let areaLevel = "city";
    if (zoom < 12 && zoom > 7) {
      areaLevel = "city";
    } else if (zoom < 7 && zoom > 3) {
      areaLevel = "region";
    }
    // const latitudeTop = latitude + latitudeDelta / 2;
    // const latitudeBottom = latitude - latitudeDelta / 2;
    // const longitudeRight = longitude + longitudeDelta / 2;
    // const longitudeLeft = longitude - longitudeDelta / 2;
    return geofirestore
      .collection("tags")
      .near({
        center: new GeoPoint(latitude, longitude),
        radius: latitudeDelta * 55
      })
      .where("areaLevel", "array-contains", areaLevel)
      .get();
  }
};

export { firestore, firebase, GeoPoint, user, fs };
