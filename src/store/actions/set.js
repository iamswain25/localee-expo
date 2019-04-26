import * as types from "../types";

export const setLoading = _ => {
  return {
    type: types.SET_LOADING,
    payload: { _ }
  };
};
export const setTags = _ => {
  return {
    type: types.SET_TAGS,
    payload: { _ }
  };
};
export const setTimeline = _ => {
  return {
    type: types.SET_TIMELINE,
    payload: { _ }
  };
};
export const setError = _ => {
  return {
    type: types.SET_ERROR,
    payload: { _ }
  };
};
