import * as types from "../types";
import { set, createReducer } from "../lib";
export const loading = createReducer(false, {
  [types.SET_LOADING]: set
});
export const error = createReducer(false, {
  [types.SET_ERROR]: set
});
