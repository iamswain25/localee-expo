import React from "react";
import { StyleSheet, Text, View, Animated } from "react-native";
import { MapView, Constants, Location, Permissions } from "expo";
// import BottomSearch from "./components/BottomSearch";
import Tagging from "./components/Tagging";
import TopIcons from "./components/TopIcons";
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
      locationPermission: false,
      address: {
        city: "Mountain View",
        country: "United States",
        isoCountryCode: "US",
        name: "1600",
        postalCode: "94043",
        region: "California",
        street: "Amphitheatre Parkway"
      },
      coords: {}
    };
  }
  _onRegionChangeComplete = async region => {
    let zoom = Math.round(Math.log(360 / region.longitudeDelta) / Math.LN2);
    // const boundaries = await this.mapView.getMapBoundaries();
    const { latitude, longitude, latitudeDelta, longitudeDelta } = region;
    let northeast = {
        latitude: latitude + latitudeDelta / 2,
        longitude: longitude + longitudeDelta / 2
      },
      southwest = {
        latitude: latitude - latitudeDelta / 2,
        longitude: longitude - longitudeDelta / 2
      };

    console.log(zoom, northeast, southwest);
  };
  _getLocationAsync = async () => {
    if (!this.state.locationPermission) {
      const perm = await this._askAddrPermission();
      if (!perm) {
        return alert("Permission to access location was denied");
      }
    }
    const { latitude, longitude } = this._getAddressAsync();
    const { latitudeDelta, longitudeDelta } = initialRegion;
    this.mapView.animateToRegion(
      { latitude, longitude, latitudeDelta, longitudeDelta },
      2000
    );
  };

  _askAddrPermission = async () => {
    console.log("ask permission");
    let locationPermission = null;
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      locationPermission = false;
      this.setState({ locationPermission });
    } else {
      locationPermission = true;
      this.setState({ locationPermission });
    }
    return locationPermission;
  };

  _getAddressAsync = async () => {
    console.log("get address");
    const location = await Location.getCurrentPositionAsync({
      maximumAge: 5000,
      enableHighAccuracy: true
    });
    const { latitude, longitude } = location.coords;
    const [address] = await Location.reverseGeocodeAsync({
      latitude,
      longitude
    });
    // console.log(address);
    this.setState({ address, coords: location.coords });
    return { address, latitude, longitude };
  };

  _setTaggingModal = isShow => {
    this.setState({ modalVisible: isShow });
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
          <MapView.Marker
            coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
            title="ok"
            description="desc"
          >
            <View>
              <Text>#OK!</Text>
            </View>
          </MapView.Marker>
        </MapView>
        <TopIcons
          moveToMyLocation={this._getLocationAsync}
          setTaggingModal={this._setTaggingModal}
        />
        {/* <BottomSearch /> */}
        <Tagging
          modalVisible={this.state.modalVisible}
          closeModal={e => this._setTaggingModal(false)}
          locationPermission={this.state.locationPermission}
          address={this.state.address}
          coords={this.state.coords}
          askAddrPermission={this._askAddrPermission}
          getAddressAsync={this._getAddressAsync}
        />
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
  }
});
