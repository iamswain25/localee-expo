import {
  QueryDocumentSnapshot,
  DocumentReference,
  GeoPoint
} from "@firebase/firestore-types";

interface USCity {
  country_code: String;
  country: String;
  state: String;
  county: String;
  city: String;
  island: String | undefined;
  suburb: String | undefined;
  town: String | undefined;
  neighbourhood: String | undefined;
  road: String | undefined;
  postcode: String;
}
interface USNonCity {
  country_code: String;
  country: String;
  state: String;
  county: String;
}
interface KoreanCity {
  country_code: String;
  country: String;
  state: String | undefined;
  city: String;
  town: String;
  village: String;
  city_district: String;
  road: String | undefined;
  postcode: String;
}
interface KoreanNonCity {
  country_code: String;
  country: String;
  state: String;
  region: String;
  village: String;
  road: String;
  postcode: String;
}
type Areas = any | USCity | USNonCity | KoreanCity | KoreanNonCity;
interface Post {
  tags: Array<String>;
  areas: Areas;
  coords: GeoPoint;
  createdBy: String;
}
interface Tag {
  tag: String;
  areas: Areas;
  zoomLevel: Number[];
  createdAt: Date;
  createdBy: String;
  coordinates: GeoPoint;
  topicCount: Number;
  clickCount: Number;
  searchCount: Number;
  parentRef: DocumentReference | null;
}
export {
  QueryDocumentSnapshot,
  DocumentReference,
  GeoPoint,
  Areas,
  Post,
  Tag,
  USCity,
  USNonCity,
  KoreanCity,
  KoreanNonCity
};
