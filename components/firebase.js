import firebase from "firebase/app";
import Supercluster from "supercluster";
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
    // console.log(latitude, longitude, latitudeDelta, longitudeDelta);
    let zoom = Math.round(Math.log(360 / Math.abs(longitudeDelta)) / Math.LN2);
    console.log(zoom);
    const qs = await geofirestore
      .collection("tags")
      .where("zoomLevel", "array-contains", zoom)
      .near({
        center: new GeoPoint(latitude, longitude),
        radius: latitudeDelta * 55
      })
      .get();
    const rawMarkers = qs.docs.map(d => {
      const {
        tag,
        searchCount,
        topicCount,
        clickCount,
        coordinates
      } = d.data();
      return {
        geometry: {
          coordinates: [coordinates.longitude, coordinates.latitude]
        },
        properties: {
          custom: {
            tag,
            searchCount,
            topicCount,
            clickCount
          },
          fsDocId: d.id
        }
      };
    });
    const cluster = new Supercluster({
      radius: 10,
      maxZoom: 14,
      reduce: (a, p) => {
        if (a.custom.topicCount < p.custom.topicCount) {
          firestore
            .doc(`/tags/${a.fsDocId}`)
            .update(
              "d.zoomLevel",
              firebase.firestore.FieldValue.arrayRemove(zoom)
            );
          a.custom = p.custom;
        } else {
          firestore
            .doc(`/tags/${p.fsDocId}`)
            .update(
              "d.zoomLevel",
              firebase.firestore.FieldValue.arrayRemove(zoom)
            );
        }
      }
      // map: p => {
      //   console.log(p);
      // }
    });
    cluster.load(rawMarkers);
    const padding = 0;
    const markers = cluster.getClusters(
      [
        longitude - longitudeDelta * (0.5 + padding),
        latitude - latitudeDelta * (0.5 + padding),
        longitude + longitudeDelta * (0.5 + padding),
        latitude + latitudeDelta * (0.5 + padding)
      ],
      zoom
    );
    console.log(markers);
    return markers;
  }
};

export { firestore, firebase, GeoPoint, user, fs };
