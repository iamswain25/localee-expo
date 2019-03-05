import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
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
// interface Tag {
//   tag: String;
//   areas: {
//     city: String;
//     country: String;
//     isoCountryCode: String;
//     name: String;
//     postalCode: String;
//     region: String;
//     street: String;
//   };
//   coords: admin.firestore.GeoPoint;
//   topicCount: Number;
//   clickCount: Number;
//   searchCount: Number;
// }
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
    // const createdBy = context.auth;
    void snap.ref.update({ createdAt });
    return Promise.all(
      tags.map(async (tag: String) => {
        const geoPoint = randomizeGeopoint(coords);
        return admin
          .firestore()
          .collection("tags")
          .where("tag", "==", tag)
          .where("areas.region", "==", areas.region)
          .where("areas.city", "==", areas.city)
          .get()
          .then(async ({ docs, empty }) => {
            if (empty) {
              return admin
                .firestore()
                .collection("tags")
                .add({
                  createdAt,
                  createdBy,
                  tag,
                  areas,
                  geoPoint,
                  topicCount: 0,
                  clickCount: 0,
                  searchCount: 0
                });
            } else {
              const updatedAt = new Date();
              const updatedBy = createdBy;
              let topicCount = docs[0].get("topicCount") || 0;
              topicCount++;
              return docs[0].ref.update({ topicCount, updatedAt, updatedBy });
            }
          });
      })
    );
  });
