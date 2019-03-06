import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { GeoCollectionReference, GeoFirestore } from "geofirestore";
import { DocumentSnapshot } from "firebase-functions/lib/providers/firestore";
admin.initializeApp();
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
interface Post {
  tags: Array<String>;
  areas: {
    city: String;
    country: String;
    isoCountryCode: String;
    name: String;
    postalCode: String;
    region: String;
    street: String;
  };
  coords: admin.firestore.GeoPoint;
  createdBy: String;
}
interface Tag {
  tag: String;
  areas: {
    city: String;
    country: String;
    isoCountryCode: String;
    name: String;
    postalCode: String;
    region: String;
    street: String;
  };
  areaLevel: String[];
  createdAt: String;
  createdBy: String;
  coordinates: admin.firestore.GeoPoint;
  topicCount: Number;
  clickCount: Number;
  searchCount: Number;
}
const randomizeGeopoint = (geoPoint: admin.firestore.GeoPoint) => {
  const lat = geoPoint.latitude + Math.random() / 1000;
  const lng = geoPoint.longitude + Math.random() / 1000;
  return new admin.firestore.GeoPoint(lat, lng);
};
exports.topicsToTags = functions.firestore
  .document("topics/{uuid}")
  .onCreate((snap, context) => {
    // console.log(context);
    const posts = <Post>snap.data();
    const { tags, areas, coords, createdBy } = posts;
    const createdAt = context.timestamp;
    const geofirestore: GeoFirestore = new GeoFirestore(admin.firestore());
    const geocollection: GeoCollectionReference = geofirestore.collection(
      "tags"
    );
    // const createdBy = context.auth;
    void snap.ref.update({ createdAt });
    return Promise.all(
      tags.map(async (tag: String) => {
        const coordinates = randomizeGeopoint(coords);
        return admin
          .firestore()
          .collection("tags")
          .where("d.tag", "==", tag)
          .where("d.areas.country", "==", areas.country)
          .where("d.areas.region", "==", areas.region)
          .where("d.areas.city", "==", areas.city)
          .get()
          .then(async ({ docs, empty }) => {
            if (empty) {
              const fsTag: Tag = {
                createdAt,
                createdBy,
                tag,
                areas,
                coordinates,
                topicCount: 0,
                clickCount: 0,
                searchCount: 0,
                areaLevel: []
              };
              return geocollection.add(fsTag);
            } else {
              const updatedAt = new Date();
              const updatedBy = createdBy;
              const tagSnap = docs[0];
              let topicCount = tagSnap.get("d.topicCount") || 0;
              topicCount++;
              return Promise.all([
                setCityAreaLevel(tagSnap),
                setRegionAreaLevel(tagSnap),
                setCountryAreaLevel(tagSnap),
                tagSnap.ref.update({
                  "d.topicCount": topicCount,
                  "d.updatedAt": updatedAt,
                  "d.updatedBy": updatedBy
                })
              ]);
            }
          });
      })
    );
  });

// exports.onUpdateTagAreaLevel = functions.firestore
//   .document("tags/{uuid}")
//   .onUpdate(async change => {
//     const snap = change.after!;
//     // create or update
//     return Promise.all([
//       setCityAreaLevel(snap),
//       setRegionAreaLevel(snap),
//       setCountryAreaLevel(snap)
//     ]);
//   });

async function setCityAreaLevel(snap: DocumentSnapshot) {
  const tagId: String = snap.id;
  const tag: Tag = snap.data()!.d;
  if (!tag) {
    return new Error("wrong data format");
  }
  return admin
    .firestore()
    .collection("tags")
    .where("d.areas.country", "==", tag.areas.country)
    .where("d.areas.region", "==", tag.areas.region)
    .where("d.areas.city", "==", tag.areas.city)
    .orderBy("d.topicCount", "desc")
    .limit(1)
    .get()
    .then(async ({ docs, empty }) => {
      if (empty) {
        return true;
      } else if (docs[0].get("d.topicCount") > tag.topicCount) {
        return true;
      } else if (
        docs[0].id !== tagId &&
        docs[0].get("d.topicCount") < tag.topicCount
      ) {
        return Promise.all([
          snap.ref.update({
            "d.areaLevel": admin.firestore.FieldValue.arrayUnion("city")
          }),
          docs[0].ref.update({
            "d.areaLevel": admin.firestore.FieldValue.arrayRemove("city")
          })
        ]);
      } else {
        return true;
      }
    });
}
async function setRegionAreaLevel(snap: DocumentSnapshot) {
  const tagId: String = snap.id;
  const tag: Tag = snap.data()!.d;
  if (!tag) {
    return new Error("wrong data format");
  }
  return admin
    .firestore()
    .collection("tags")
    .where("d.areas.country", "==", tag.areas.country)
    .where("d.areas.region", "==", tag.areas.region)
    .orderBy("d.topicCount", "desc")
    .limit(1)
    .get()
    .then(async ({ docs, empty }) => {
      if (empty) {
        return true;
      } else if (docs[0].get("d.topicCount") > tag.topicCount) {
        return true;
      } else if (
        docs[0].id !== tagId &&
        docs[0].get("d.topicCount") < tag.topicCount
      ) {
        return Promise.all([
          snap.ref.update({
            "d.areaLevel": admin.firestore.FieldValue.arrayUnion("region")
          }),
          docs[0].ref.update({
            "d.areaLevel": admin.firestore.FieldValue.arrayRemove("region")
          })
        ]);
      } else {
        return true;
      }
    });
}
async function setCountryAreaLevel(snap: DocumentSnapshot) {
  const tagId: String = snap.id;
  const tag: Tag = snap.data()!.d;
  if (!tag) {
    return new Error("wrong data format");
  }
  return admin
    .firestore()
    .collection("tags")
    .where("d.areas.country", "==", tag.areas.country)
    .orderBy("d.topicCount", "desc")
    .limit(1)
    .get()
    .then(async ({ docs, empty }) => {
      if (empty) {
        return true;
      } else if (docs[0].get("d.topicCount") > tag.topicCount) {
        return true;
      } else if (
        docs[0].id !== tagId &&
        docs[0].get("d.topicCount") < tag.topicCount
      ) {
        return Promise.all([
          snap.ref.update({
            "d.areaLevel": admin.firestore.FieldValue.arrayUnion("country")
          }),
          docs[0].ref.update({
            "d.areaLevel": admin.firestore.FieldValue.arrayRemove("country")
          })
        ]);
      } else {
        return true;
      }
    });
}
