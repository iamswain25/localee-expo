import React from "react";
import { StyleSheet, Text, View, Alert, ActivityIndicator } from "react-native";
export default class extends React.Component {
  render() {
    if (this.props.visible) {
      return (
        <View style={styles.box}>
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={styles.spinner}
          />
          <Text style={{ fontSize: 20 }}>{this.props.text}</Text>
        </View>
      );
    } else {
      return <View />;
    }
  }
}

const styles = StyleSheet.create({
  box: {
    position: "absolute",
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 20,
    padding: 20
  }
});
