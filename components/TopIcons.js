import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity
} from "react-native";
import { Feather } from "@expo/vector-icons";
const styles = StyleSheet.create({
  floatingTop: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    top: 10,
    right: 10,
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    padding: 5
  }
});

export default class TopIcons extends React.Component {
  constructor(props) {
    super(props);
  }
  _onPressNavigation = this.props.moveToMyLocation;
  _onPressHash = () => this.props.setTaggingModal(true);
  render() {
    return (
      <View style={styles.floatingTop}>
        <TouchableOpacity onPress={this._onPressNavigation}>
          <Feather name="navigation" size={40} color="black" />
        </TouchableOpacity>
        <View
          style={{
            borderBottomWidth: 3,
            borderBottomColor: "black",
            marginTop: 20,
            marginBottom: 20,
            width: 30
          }}
        />
        <TouchableOpacity onPress={this._onPressHash}>
          <Feather name="hash" size={40} color="black" />
        </TouchableOpacity>
      </View>
    );
  }
}
