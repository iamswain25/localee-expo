import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { GeoCollectionReference, GeoFirestore } from "geofirestore";
import {
  Post,
  Tag,
  USCity,
  KoreanCity,
  KoreanNonCity,
  QueryDocumentSnapshot
} from "./types";
import { DocumentSnapshot } from "firebase-functions/lib/providers/firestore";
admin.initializeApp();

const randomizeGeopoint = (geoPoint: admin.firestore.GeoPoint) => {
  const lat = geoPoint.latitude + Math.random() / 500;
  const lng = geoPoint.longitude + Math.random() / 500;
  return new admin.firestore.GeoPoint(lat, lng);
};
const geofirestore: GeoFirestore = new GeoFirestore(admin.firestore());
const geocollection: GeoCollectionReference = geofirestore.collection("tags");
exports.topicsToTags = functions.firestore
  .document("topics/{uuid}")
  .onCreate((snap, context) => {
    const createdAt = context.timestamp;
    void snap.ref.update({ createdAt });
    const posts = <Post>snap.data();
    const { tags } = posts;
    return Promise.all(tags.map(async (tag: String) => eachTag(tag, posts)));
  });

async function eachTag(tag: String, posts: Post) {
  const { areas, coords, createdBy } = posts;
  const coordinates = randomizeGeopoint(coords);
  const baseTag = await getBaseTagIfExist(tag, areas);
  const newTag: Tag = {
    createdAt: new Date(),
    createdBy,
    tag,
    areas,
    coordinates,
    topicCount: 0,
    clickCount: 0,
    searchCount: 0,
    zoomLevel: Array.from(Array(21).keys()),
    parentRef: null
  };
  if (baseTag) {
    await incrementTopicCount(baseTag, createdBy);
  } else {
    await geocollection.add(newTag);
  }

  return true;
}
async function incrementTopicCount(
  snap: DocumentSnapshot | QueryDocumentSnapshot,
  createdBy: String
) {
  const updatedAt = new Date();
  const updatedBy = createdBy;
  let topicCount = snap.get("d.topicCount") || 0;
  topicCount++;
  await snap.ref.update({
    "d.topicCount": topicCount,
    "d.updatedAt": updatedAt,
    "d.updatedBy": updatedBy
  });
  const parentRef = snap.get("d.parentRef");
  if (parentRef) {
    const parentSnap = await parentRef.get();
    await incrementTopicCount(parentSnap, createdBy);
  }
}

async function getBaseTagIfExist(tag: String, areas: any) {
  if (areas.hasOwnProperty("village")) {
    //Korean
    if (areas.hasOwnProperty("city")) {
      const { country, state, city, town } = <KoreanCity>areas;
      if (state) {
        const { docs, empty } = await admin
          .firestore()
          .collection("tags")
          .where("d.tag", "==", tag)
          .where("d.areas.country", "==", country)
          .where("d.areas.state", "==", state)
          .where("d.areas.city", "==", city)
          .where("d.areas.town", "==", town)
          .get();
        return empty ? null : docs[0];
      } else {
        const { docs, empty } = await admin
          .firestore()
          .collection("tags")
          .where("d.tag", "==", tag)
          .where("d.areas.country", "==", country)
          .where("d.areas.city", "==", city)
          .where("d.areas.town", "==", town)
          .get();
        return empty ? null : docs[0];
      }
    } else {
      const { country, state, region } = <KoreanNonCity>areas;
      const { docs, empty } = await admin
        .firestore()
        .collection("tags")
        .where("d.tag", "==", tag)
        .where("d.areas.country", "==", country)
        .where("d.areas.state", "==", state)
        .where("d.areas.region", "==", region)
        .get();
      return empty ? null : docs[0];
    }
  } else {
    // US, SF for now
    const { country, state, city, neighbourhood } = <USCity>areas;
    if (state) {
      const { docs, empty } = await admin
        .firestore()
        .collection("tags")
        .where("d.tag", "==", tag)
        .where("d.areas.country", "==", country)
        .where("d.areas.state", "==", state)
        .where("d.areas.city", "==", city)
        .where("d.areas.neighbourhood", "==", neighbourhood)
        .get();
      return empty ? null : docs[0];
    }

    return false;
  }
}
