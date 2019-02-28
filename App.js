import React from "react";
import { StyleSheet, Text, View, Animated } from "react-native";
import { MapView, Constants, Location, Permissions } from "expo";
// import BottomSearch from "./components/BottomSearch";
import Tagging from "./components/Tagging";
import TopIcons from "./components/TopIcons";
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
      modalVisible: false
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
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      return alert("Permission to access location was denied");
    }

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    const { latitudeDelta, longitudeDelta } = this.state;
    this.setState({ latitude, longitude });
    this.mapView.animateToRegion(
      { latitude, longitude, latitudeDelta, longitudeDelta },
      2000
    );
    const address = await Location.reverseGeocodeAsync({ latitude, longitude });
    console.log(address);
  };

  _getAddressAsync = async () => {
    Location.reverseGeocodeAsync(location);
  };

  _setTaggingModal = isShow => {
    this.setState({ modalVisible: isShow });
  };

  render() {
    const { latitude, longitude, latitudeDelta, longitudeDelta } = this.state;
    return (
      <View style={styles.container}>
        <MapView
          ref={ref => (this.mapView = ref)}
          style={{ alignSelf: "stretch", height: 200, flex: 1 }}
          initialRegion={{ latitude, longitude, latitudeDelta, longitudeDelta }}
          onRegionChangeComplete={this._onRegionChangeComplete}
          // region={{ latitude, longitude, latitudeDelta, longitudeDelta }}
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
