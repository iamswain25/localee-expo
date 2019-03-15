import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { GeoCollectionReference, GeoFirestore } from "geofirestore";
import { Post, Tag, Areas, QueryDocumentSnapshot } from "./types";
import { DocumentSnapshot } from "firebase-functions/lib/providers/firestore";
import { extractHashtags } from "twitter-text";
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
    const content: string = snap.get("content");
    const tags: string[] = extractHashtags(content);
    const createdAt = context.timestamp;
    void snap.ref.update({ createdAt, tags });
    const posts = <Post>snap.data();
    return Promise.all(tags.map(async (tag: string) => eachTag(tag, posts)));
  });

async function eachTag(tag: string, posts: Post) {
  const { areas, coords, createdBy } = posts;
  const coordinates = randomizeGeopoint(coords);
  const baseTag = await getBaseTagIfExist(tag, areas);
  const newTag: Tag = {
    createdAt: new Date(),
    createdBy,
    tag,
    areas,
    coordinates,
    topicCount: 1,
    clickCount: 0,
    searchCount: 0,
    zoomLevel: arrFrom1to20(),
    parentRef: null
  };
  if (baseTag) {
    await incrementTopicCount(baseTag, createdBy);
  } else {
    await geocollection.add(newTag);
  }

  return true;
}
function arrFrom1to20() {
  return Array.from(Array(20).keys()).map(a => a + 1);
}
async function incrementTopicCount(
  snap: DocumentSnapshot | QueryDocumentSnapshot,
  createdBy: string
) {
  const updatedAt = new Date();
  const updatedBy = createdBy;
  let topicCount = snap.get("d.topicCount") || 1;
  topicCount++;
  await snap.ref.update({
    "d.topicCount": topicCount,
    "d.updatedAt": updatedAt,
    "d.updatedBy": updatedBy,
    "d.zoomLevel": arrFrom1to20()
  });
  const parentRef = snap.get("d.parentRef");
  if (parentRef) {
    const parentSnap = await parentRef.get();
    await incrementTopicCount(parentSnap, createdBy);
  }
}

async function getBaseTagIfExist(tag: string, areas: any) {
  const {
    country,
    state,
    county,
    region,
    city,
    town,
    suburb,
    neighbourhood
  } = <Areas>areas;
  let query = admin
    .firestore()
    .collection("tags")
    .where("d.tag", "==", tag)
    .where("d.areas.country", "==", country);
  if (state) {
    query = query.where("d.areas.state", "==", state);
  }
  if (county) {
    query = query.where("d.areas.county", "==", county);
  }
  if (region) {
    query = query.where("d.areas.region", "==", region);
  }
  if (city) {
    query = query.where("d.areas.city", "==", city);
  }
  if (town) {
    query = query.where("d.areas.town", "==", town);
  }
  if (suburb) {
    query = query.where("d.areas.suburb", "==", suburb);
  }
  if (neighbourhood) {
    query = query.where("d.areas.neighbourhood", "==", neighbourhood);
  }
  const { docs, empty } = await query.get();
  return empty ? null : docs[0];
}
