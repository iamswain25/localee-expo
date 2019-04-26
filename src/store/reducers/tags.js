import * as types from "../types";
import { set, createReducer } from "../lib";
export const tags = createReducer(
  [
    {
      geometry: {
        coordinates: [-122.4324, 37.78825]
      },
      properties: {
        tag: "loadingTest",
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
  ],
  {
    [types.SET_TAGS]: set
  }
);
