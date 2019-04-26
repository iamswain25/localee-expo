import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MapView } from "expo";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actions from "./store/actions";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomSearch, TopIcons, Loader } from "./components/index";

class App extends React.Component {
  state = {
    myLocationVisible: true
  };
  _onRegionChangeComplete = async region => this.props.getMapTags(region);
  _getLocationAsync = async () => {
    // this.setState(state => ({ myLocationVisible: !state.myLocationVisible }));
    const { latitude, longitude } = await this.props.getCoordsAddress();
    const [latitudeDelta, longitudeDelta] = [0.01, 0.01];
    this.mapView.animateToRegion(
      { latitude, longitude, latitudeDelta, longitudeDelta },
      2000
    );
  };

  _onPressMarker = async tag => {
    await this.props.getTimelineByTag(tag);
    this.props.navigation.navigate("Timeline");
  };

  render() {
    return (
      <View style={styles.container}>
        <MapView
          ref={ref => (this.mapView = ref)}
          style={{ alignSelf: "stretch", height: 200, flex: 1 }}
          onRegionChangeComplete={this._onRegionChangeComplete}
          showsBuildings={false}
          showsTraffic={false}
          showsIndoors={false}
          maxZoomLevel={18}
          initialRegion={{
            latitude: -122,
            longitude: 38,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
          }}
        >
          {this.props.tags.map((t, i) => {
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
          {this.state.myLocationVisible && this.props.me.coords && (
            <MapView.Marker
              onPress={() => this.props.navigation.navigate("MyPage")}
              coordinate={{
                latitude: this.props.me.coords.latitude,
                longitude: this.props.me.coords.longitude
              }}
            >
              <MaterialIcons
                name="my-location"
                size={50}
                color="#782DD5"
                style={{ backgroundColor: "yellow", borderRadius: 50 }}
              />
            </MapView.Marker>
          )}
        </MapView>
        <TopIcons
          moveToMyLocation={this._getLocationAsync}
          openTagging={() => this.props.navigation.navigate("Tagging")}
        />
        <BottomSearch {...this.props} />
        <Loader
          style={styles.loader}
          visible={!!this.props.loading}
          text={this.props.loading}
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

export default connect(
  all => all,
  dispatch => bindActionCreators(actions, dispatch)
)(App);
