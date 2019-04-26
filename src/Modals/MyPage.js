import React from "react";
import { LinearGradient } from "expo";
import { View, Text, TouchableOpacity } from "react-native";
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons
} from "@expo/vector-icons";
import gs from "../globalStyles";
import Notification from "../components/MyPage/Notification";
export default class extends React.Component {
  state = { page: 0 };
  render() {
    let comp;
    switch (this.state.page) {
      case 0:
        comp = <Notification {...this.props} />;
        break;
      default:
    }
    return (
      <LinearGradient
        colors={["#782DD5BB", "transparent"]}
        locations={[0.4, 1]}
        style={{ flex: 1 }}
      >
        <View style={[gs.flex1, gs.centeredH]}>
          <View
            style={[
              gs.paddingLR,
              { backgroundColor: "yellow", borderRadius: 5 }
            ]}
          >
            <Text style={[gs.text.large]}>San Francisco</Text>
          </View>
          {comp}
        </View>
        <View style={{ flex: 1, padding: 20 }}>
          <View style={[gs.flex1, gs.centered]}>
            <View>
              <TouchableOpacity style={[gs.centered, { padding: 5 }]}>
                <MaterialCommunityIcons
                  name="pencil-circle-outline"
                  size={50}
                  color="#782DD5"
                  style={{ backgroundColor: "yellow", borderRadius: 50 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  position: "absolute",
                  translateX: 60,
                  translateY: 30,
                  padding: 5
                }}
              >
                <MaterialCommunityIcons
                  name="heart-circle-outline"
                  size={50}
                  color="#782DD5"
                  style={{ backgroundColor: "yellow", borderRadius: 50 }}
                />
              </TouchableOpacity>
              <TouchableOpacity style={[{ padding: 5 }, gs.centered]}>
                <MaterialIcons
                  name="my-location"
                  size={50}
                  color="#782DD5"
                  style={{ backgroundColor: "yellow", borderRadius: 50 }}
                />
                <Text style={[gs.text.yellow, gs.text.medium]}>XIANLU</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={[gs.flex1, gs.centeredH]}>
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <Ionicons
                name="md-close"
                size={30}
                color="white"
                style={{ padding: 10, paddingLeft: 20 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    );
  }
}
