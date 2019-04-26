import {
  Location,
  Permissions,
  IntentLauncherAndroid as IntentLauncher
} from "expo";
import { Alert } from "react-native";
import * as mutate from "./mutate";

export const checkLocationServicesEnabled = () => {
  return async (dispatch, getState) => {
    const { me } = getState();
    // {
    //   "gpsAvailable": true,
    //   "locationServicesEnabled": true,
    //   "networkAvailable": true,
    //   "passiveAvailable": true,
    // }
    const { locationServicesEnabled } = await Location.getProviderStatusAsync();
    if (!locationServicesEnabled) {
      Alert.alert(
        "Location service denied",
        "Need to turn on the location service in order to post on your area. Please turn on device setting for location",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "SETTING",
            onPress: () => {
              IntentLauncher.startActivityAsync(
                IntentLauncher.ACTION_LOCATION_SOURCE_SETTINGS
                // need package name but doens't look like it's supported by expo yet

                // IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS
              );
            }
          }
        ]
      );
    }
    return locationServicesEnabled;
  };
};

export const askLocationPermission = () => {
  return async (dispatch, getState) => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === "denied") {
      Alert.alert(
        "Location permission denied",
        "Need to turn on the location permission in order to post on your area. Otherwise, view only. Please turn on app-level permissions for location",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "SETTING",
            onPress: () => {
              IntentLauncher.startActivityAsync(
                IntentLauncher.ACTION_LOCATION_SOURCE_SETTINGS
                // need package name but doens't look like it's supported by expo yet
                // IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS
              );
            }
          }
        ]
      );
    }
    const locationPermission = status === "granted";
    console.log(`locationPermission: ${locationPermission}`);
    dispatch(mutate.mutateLocationPermission(locationPermission));
    return locationPermission;
  };
};
