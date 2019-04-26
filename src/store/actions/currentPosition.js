import { Location } from "expo";
import * as mutate from "./mutate";
import * as set from "./set";
import {
  checkLocationServicesEnabled,
  askLocationPermission
} from "./permission";

export const getCoordsAddress = () => {
  return async (dispatch, getState) => {
    try {
      const { loading, me } = getState();
      if (loading) {
        console.log(`loading: ${this.state.loading}`);
        return false;
      }
      if (!me.locationPermission) {
        const locationServicesEnabled = await dispatch(
          checkLocationServicesEnabled()
        );
        const locationPermission = await dispatch(askLocationPermission());
        if (!(locationServicesEnabled && locationPermission)) {
          dispatch(set.setError("denied"));
        }
      }
      dispatch(set.setLoading("locating your position..."));
      const location = await Location.getCurrentPositionAsync({
        maximumAge: 5000,
        enableHighAccuracy: true
      });
      const { latitude, longitude } = location.coords;
      const { address } = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=16&addressdetails=1&osm_type=N`
      ).then(response => response.json());
      console.log(address);
      dispatch(mutate.mutateAddress(address));
      dispatch(mutate.mutateCoords(location.coords));
      return { address, latitude, longitude };
    } catch (err) {
      dispatch(set.setError(err));
      return false;
    } finally {
      dispatch(set.setLoading(false));
    }
  };
};
