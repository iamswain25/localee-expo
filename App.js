import React from "react";
import { StyleSheet, Text, View, Animated } from "react-native";
import { MapView, Constants, GestureHandler } from "expo";
import BottomSearch from "./components/BottomSearch";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this._translateY = new Animated.Value(0);
  }
  _onHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this._lastOffset.x += event.nativeEvent.translationX;
      this._lastOffset.y += event.nativeEvent.translationY;
      this._translateX.setOffset(this._lastOffset.x);
      this._translateX.setValue(0);
      this._translateY.setOffset(this._lastOffset.y);
      this._translateY.setValue(0);
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={{ alignSelf: "stretch", height: 200, flex: 1 }}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
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
        <BottomSearch />
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
  searchBar: {
    position: "absolute",
    bottom: 0,
    height: "10%"
  }
});
