// Array [
//   Object {
//     "geometry": Object {
//       "coordinates": Array [
//         -122.45530843171903,
//         37.710596915926274,
//       ],
//       "type": "Point",
//     },
//     "id": 12,
//     "properties": Object {
//       "cluster": true,
//       "cluster_id": 12,
//       "custom": Object {
//         "clickCount": 0,
//         "searchCount": 0,
//         "tag": "#hello",
//         "topicCount": 0,
//       },
//       "fsDocId": "NNF09Mt3utC0unchdVvZ",
//       "point_count": 2,
//       "point_count_abbreviated": 2,
//     },
//     "type": "Feature",
//   },
// ],
const good = {
  address: {
    city: "Mountain View",
    country: "United States",
    isoCountryCode: "US",
    name: "1600",
    postalCode: "94043",
    region: "California",
    street: "Amphitheatre Parkway"
  },

  address: {
    city: "Incheon",
    country: "South Korea",
    isoCountryCode: "KR",
    name: "155",
    postalCode: "404-250",
    region: "Incheon",
    street: "Gajwa 1(il)-dong"
  },

  address: {
    city: "인천",
    country: "대한민국",
    country_code: "kr",
    postcode: "22547",
    town: "동구"
  },
  tags: [
    {
      geometry: {
        coordinates: [-122.4324, 37.78825]
      },
      properties: {
        tag: "#loadingTest",
        areas: {
          city: "SF",
          country: "USA",
          country_code: "us",
          county: "SF",
          neighbourhood: "Ocean View",
          postcode: "94112",
          road: "Regent Street",
          state: "California"
        },
        topicCount: 1,
        clickCount: 0,
        searchCount: 0
      }
    }
  ]
};
