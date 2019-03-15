import {
  QueryDocumentSnapshot,
  DocumentReference,
  GeoPoint
} from "@firebase/firestore-types";
interface Areas {
  country_code: string;
  country: string;
  state: string | undefined;
  county: string | undefined;
  region: string | undefined;
  city: string | undefined;
  island: string | undefined;
  suburb: string | undefined;
  town: string | undefined;
  neighbourhood: string | undefined;
  village: string | undefined;
  city_district: string | undefined;
  road: string | undefined;
  postcode: string | undefined;
}

// interface USCity {
//   country_code: string;
//   country: string;
//   state: string;
//   county: string;
//   city: string;
//   island: string | undefined;
//   suburb: string | undefined;
//   town: string | undefined;
//   neighbourhood: string | undefined;
//   road: string | undefined;
//   postcode: string;
// }
// interface USNonCity {
//   country_code: string;
//   country: string;
//   state: string;
//   county: string;
// }
// interface KoreanCity {
//   country_code: string;
//   country: string;
//   state: string | undefined;
//   city: string;
//   town: string;
//   village: string;
//   city_district: string;
//   road: string | undefined;
//   postcode: string;
// }
// interface KoreanNonCity {
//   country_code: string;
//   country: string;
//   state: string;
//   region: string;
//   village: string;
//   road: string;
//   postcode: string;
// }
// type Areas = any | USCity | USNonCity | KoreanCity | KoreanNonCity;
interface Post {
  tags: Array<string>;
  areas: Areas;
  coords: GeoPoint;
  createdBy: string;
}
interface Tag {
  tag: string;
  areas: Areas;
  zoomLevel: Number[];
  createdAt: Date;
  createdBy: string;
  coordinates: GeoPoint;
  topicCount: Number;
  clickCount: Number;
  searchCount: Number;
  parentRef: DocumentReference | null;
}
export { QueryDocumentSnapshot, DocumentReference, GeoPoint, Areas, Post, Tag };
