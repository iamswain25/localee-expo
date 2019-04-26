import { combineReducers } from "redux";
import * as me from "./me";
import * as loading from "./loading";
import * as tags from "./tags";
import * as timeline from "./timeline";
import { RESET_STORE } from "../types";

const appReducer = combineReducers({ ...me, ...loading, ...tags, ...timeline });

const rootReducer = (state, action) => {
  if (action.type === RESET_STORE) {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
