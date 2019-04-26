import * as types from "../types";
import { set, createReducer } from "../lib";
export const timeline = createReducer([], {
  [types.SET_TIMELINE]: set
});
