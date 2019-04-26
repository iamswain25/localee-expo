import * as types from "../types";

export const mutateAuth = auth => {
  return {
    type: types.MUTATE_AUTH,
    payload: { auth }
  };
};
export const mutateCoords = coords => {
  return {
    type: types.MUTATE_COORDS,
    payload: { coords }
  };
};
export const mutateTag = tag => {
  return {
    type: types.MUTATE_TAG,
    payload: { tag }
  };
};
export const mutateLocationPermission = locationPermission => {
  return {
    type: types.MUTATE_LOCATION_PERMISSION,
    payload: { locationPermission }
  };
};
export const mutateAddress = address => {
  return {
    type: types.MUTATE_ADDRESS,
    payload: { address }
  };
};
