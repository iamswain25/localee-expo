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
          tag,
          searchCount,
          topicCount,
          clickCount,
          fsDocId: d.id
        }
      };
    });

    const cluster = new Supercluster({
      radius: 40,
      maxZoom: 20,
      reduce: (a, p) => {
        // console.log(a.topicCount, p.topicCount);
        if (a.topicCount < p.topicCount) {
          Object.assign(a, p);
        }
      }
    });
    cluster.load(rawMarkers);
    const padding = 0.1;
    const markers = cluster.getClusters(
      [
        longitude - longitudeDelta * (1 + padding),
        latitude - latitudeDelta * (0.5 + padding),
        longitude + longitudeDelta * (1 + padding),
        latitude + latitudeDelta * (0.5 + padding)
      ],
      zoom
    );
    // console.log(markers.map(m => m.properties.topicCount))
    removeTagZoomLevel(qs, zoom, markers);
    return markers;
  }
};

async function removeTagZoomLevel({ docs, size }, zoom, geoJsonMarkers) {
  console.log(
    `zoom: ${zoom}, size: ${size}, clusterSize: ${geoJsonMarkers.length}`
  );
  if (docs && zoom && geoJsonMarkers && size) {
    if (size !== geoJsonMarkers.length) {
      const remainingMarkerIds = geoJsonMarkers.map(m => m.properties.fsDocId);
      docs.forEach(d => {
        if (!remainingMarkerIds.includes(d.id)) {
          firestore
            .doc(`/tags/${d.id}`)
            .update(
              "d.zoomLevel",
              firebase.firestore.FieldValue.arrayRemove(zoom)
            );
        }
      });
    }
  }
}

export { firestore, firebase, GeoPoint, user, fs };
