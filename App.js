import React from "react";
import { fs } from "./components/firebase";
import { StyleSheet, Text, View, Alert } from "react-native";
import {
  MapView,
  Constants,
  Location,
  Permissions,
  IntentLauncherAndroid as IntentLauncher
} from "expo";

// import BottomSearch from "./components/BottomSearch";
import Tagging from "./components/Tagging";
import TopIcons from "./components/TopIcons";
import Loader from "./components/Loader";
const initialRegion = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421
};
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      locationPermission: "pending",
      address: {},
      loading: false,
      tags: [
        {
          geometry: {
            coordinates: [-122.4324, 37.78825]
          },
          properties: {
            tag: "#loadingTest",
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
      coords: {}
    };
  }
  _onRegionChangeComplete = async region => {
    const tags = await fs.getMapTags(region);
    this.setState({ tags });
  };
  _getLocationAsync = async () => {
    if (this.state.locationPermission !== "granted") {
      // {
      //   "gpsAvailable": true,
      //   "locationServicesEnabled": true,
      //   "networkAvailable": true,
      //   "passiveAvailable": true,
      // }
      const {
        locationServicesEnabled
      } = await Location.getProviderStatusAsync();
      if (!locationServicesEnabled) {
        return Alert.alert(
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
      const perm = await this._askAddrPermission();
      if (perm === "denied") {
        this._setTaggingModal(false);
        return Alert.alert(
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
    }
    return await this._getAddressAsync();
  };

  _askAddrPermission = async () => {
    console.log("ask permission");

    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    const locationPermission = status;
    // if (status !== "granted") {
    console.log(`locationPermission: ${locationPermission}`);
    this.setState({ locationPermission });
    return locationPermission;
  };

  _getAddressAsync = async () => {
    console.log("get address");
    if (this.state.loading) {
      console.log(`loading: ${this.state.loading}`);
      return false;
    }
    this.setState({ loading: true });
    const location = await Location.getCurrentPositionAsync({
      maximumAge: 5000,
      enableHighAccuracy: true
    });
    const { latitude, longitude } = location.coords;
    const { address } = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=16&addressdetails=1&osm_type=N`
    ).then(response => response.json());
    console.log(address);
    this.setState({ address, coords: location.coords, loading: false });
    const { latitudeDelta, longitudeDelta } = initialRegion;
    this.mapView.animateToRegion(
      { latitude, longitude, latitudeDelta, longitudeDelta },
      2000
    );
    return { address, latitude, longitude };
  };

  _setTaggingModal = async isShow => {
    if (isShow) {
      if (this.state.locationPermission !== "granted") {
        await this._getLocationAsync();
        if (this.state.locationPermission === "granted") {
          this.setState({ modalVisible: isShow });
        }
      } else {
        this.setState({ modalVisible: isShow });
      }
    } else {
      this.setState({ modalVisible: isShow });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <MapView
          ref={ref => (this.mapView = ref)}
          style={{ alignSelf: "stretch", height: 200, flex: 1 }}
          initialRegion={initialRegion}
          onRegionChangeComplete={this._onRegionChangeComplete}
        >
          {this.state.tags.map((t, i) => {
            const [longitude, latitude] = t.geometry.coordinates;
            return (
              <MapView.Marker
                coordinate={{ latitude, longitude }}
                key={i}
                zIndex={i}
              >
                <View>
                  <Text>#{t.properties.tag}</Text>
                </View>
                <MapView.Callout>
                  <View style={styles.tooltip}>
                    <Text>{t.properties.tag}</Text>
                    <Text>topicCount: {t.properties.topicCount}</Text>
                    <Text>clickCount: {t.properties.clickCount}</Text>
                    <Text>searchCount: {t.properties.searchCount}</Text>
                  </View>
                </MapView.Callout>
              </MapView.Marker>
            );
          })}
        </MapView>
        <TopIcons
          moveToMyLocation={this._getLocationAsync}
          setTaggingModal={this._setTaggingModal}
        />
        {/* <BottomSearch /> */}
        <Tagging
          modalVisible={this.state.modalVisible}
          closeModal={e => this._setTaggingModal(false)}
          address={this.state.address}
          coords={this.state.coords}
          getLocationAsync={this._getLocationAsync}
        />
        <Loader style={styles.loader} visible={this.state.loading} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  tooltip: {
    width: 100
  },
  loader: {
    position: "absolute",
    justifyContent: "center",
    flex: 1
  }
});
