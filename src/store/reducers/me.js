import * as types from "../types";
import { mutate, createReducer } from "../lib";
export const me = createReducer(
  {
    auth: null,
    coords: null,
    tag: null,
    locationPermission: null,
    address: null
  },
  {
    [types.MUTATE_AUTH]: mutate,
    [types.MUTATE_COORDS]: mutate,
    [types.MUTATE_TAG]: mutate,
    [types.MUTATE_LOCATION_PERMISSION]: mutate,
    [types.MUTATE_ADDRESS]: mutate
  }
);
