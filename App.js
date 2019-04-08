import React from "react";
import { fs } from "./components/firebase";
import { StyleSheet, Text, View, Alert } from "react-native";
import {
  MapView,
  Location,
  Permissions,
  IntentLauncherAndroid as IntentLauncher
} from "expo";

// import BottomSearch from "./components/BottomSearch";
import Tagging from "./components/Tagging";
import Timeline from "./components/Timeline";
import BottomSearch from "./components/BottomSearch";
import TopIcons from "./components/TopIcons";
import Loader from "./components/Loader";
import Info from "./components/Info";
const initialRegion = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 9.22,
  longitudeDelta: 4.21
};
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taggingVisible: false,
      timelineVisible: false,
      infoVisible: false,
      locationPermission: "pending",
      address: {},
      loading: false,
      timeline: [],
      loaderText: "locating your position...",
      tag: {
        geometry: {
          coordinates: [-122.4324, 37.78825]
        },
        properties: {
          tag: "loadingTest",
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
      },
      tags: [
        {
          geometry: {
            coordinates: [-122.4324, 37.78825]
          },
          properties: {
            tag: "loadingTest",
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
    this.setState({ loading: true, loaderText: "locating your position..." });
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
          this.setState({ taggingVisible: isShow });
        }
      } else {
        this.setState({ taggingVisible: isShow });
      }
    } else {
      this.setState({ taggingVisible: isShow });
    }
  };
  setStateModal = state => this.setState(state);
  _onPressMarker = async tag => {
    this.setState({
      timelineVisible: true,
      tag,
      loading: true,
      loaderText: "loading timeline..."
    });
    // console.log(tag);
    const timeline = await fs.getTimeline(tag);
    this.setState({ timeline, loading: false });
  };
  _getTimelineArea = async areas => {
    const { tag } = this.state;
    tag.properties.tag = "";
    this.setState({
      timelineVisible: true,
      loading: true,
      tag,
      loaderText: "loading timeline..."
    });
    const timeline = await fs.getTimelineArea(areas);
    this.setState({ timeline, loading: false });
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
                onPress={() => this._onPressMarker(t)}
              >
                <View>
                  <Text
                    style={{
                      fontSize: Math.log(t.properties.topicCount) + 15
                    }}
                  >
                    #{t.properties.tag}
                  </Text>
                </View>
              </MapView.Marker>
            );
          })}
        </MapView>
        <TopIcons
          moveToMyLocation={this._getLocationAsync}
          setTaggingModal={this._setTaggingModal}
        />
        <BottomSearch
          visible={this.state.taggingVisible}
          setTaggingModal={this._setTaggingModal}
          setStateModal={this.setStateModal}
        />
        <Timeline
          timelineVisible={this.state.timelineVisible}
          closeModal={e => this.setStateModal({ timelineVisible: false })}
          address={this.state.address}
          timeline={this.state.timeline}
          getTimelineArea={this._getTimelineArea}
          tag={this.state.tag}
          writeTagging={e => this._setTaggingModal(true)}
        />
        <Tagging
          visible={this.state.taggingVisible}
          closeModal={e => this._setTaggingModal(false)}
          address={this.state.address}
          coords={this.state.coords}
          getLocationAsync={this._getLocationAsync}
          tag={this.state.tag}
        />
        <Info
          visible={this.state.infoVisible}
          closeModal={e => this.setState({ infoVisible: false })}
        />
        <Loader
          style={styles.loader}
          visible={this.state.loading}
          text={this.state.loaderText}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
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
    flex: 1,
    zIndex: 99999999
  }
});
