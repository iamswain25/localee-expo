import { Location } from "expo";
import * as mutate from "./mutate";
import * as set from "./set";
import { fs } from "../../firebase";
export const getTimelineByTag = tag => {
  const timelinePromise = fs.getTimeline(tag);
  console.log("get timeline");
  return async (dispatch, getState) => {
    dispatch(set.setLoading("loading timeline..."));
    dispatch(mutate.mutateTag(tag));
    return timelinePromise
      .then(timeline => dispatch(set.setTimeline(timeline)))
      .catch(err => dispatch(set.setError(err)))
      .finally(dispatch(set.setLoading(false)));
  };
};
export const getMapTags = region => {
  const promiseTags = fs.getMapTags(region);
  console.log("get map tags");
  return async (dispatch, getState) => {
    dispatch(set.setLoading("loading map tags..."));
    return promiseTags
      .then(tags => dispatch(set.setTags(tags)))
      .catch(err => dispatch(set.setError(err)))
      .finally(dispatch(set.setLoading(false)));
  };
};
