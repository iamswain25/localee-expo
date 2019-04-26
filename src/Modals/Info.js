import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import gs from "../globalStyles";

export default props => {
  return (
    <View style={{ backgroundColor: "#782DD5BB", flex: 1 }}>
      <View style={[gs.flex1, gs.centeredH]}>
        <View
          style={[gs.paddingLR, { backgroundColor: "yellow", borderRadius: 5 }]}
        >
          <Text style={[gs.text.large]}>Localee</Text>
        </View>
        <View style={[gs.flex1, gs.centered]}>
          <Text style={[gs.text.larger, gs.text.white]}>Team Localee</Text>
        </View>
        <View style={[gs.flex1, gs.centered]}>
          <Text style={[gs.text.medium, gs.text.white]}>SWAIN HWANG</Text>
          <Text style={[gs.text.medium, gs.text.white]}>XIANLU YI</Text>
        </View>
        <TouchableOpacity
          style={[gs.flex1, gs.centered]}
          onPress={() => Linking.openURL("http://WWW.LOCALEE.SPACE")}
        >
          <Text
            style={[
              gs.text.small,
              gs.text.yellow,
              { borderBottomColor: "yellow", borderBottomWidth: 1 }
            ]}
          >
            WWW.LOCALEE.SPACE
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ backgroundColor: "yellow", flex: 1, padding: 20 }}>
        <View
          style={[
            {
              flexDirection: "row",
              paddingBottom: 10,
              marginBottom: 20,
              borderBottomColor: "#782DD5",
              borderBottomWidth: 2
            },
            gs.centered
          ]}
        >
          <MaterialIcons name="info-outline" size={50} color="#782DD5" />
          <Text style={[gs.text.large]}>ABOUT US</Text>
          <TouchableOpacity
            onPress={() => props.navigation.goBack()}
            style={{ right: 0, position: "absolute" }}
          >
            <Ionicons
              name="md-close"
              size={30}
              style={{ padding: 10, paddingLeft: 20 }}
            />
          </TouchableOpacity>
        </View>
        <View>
          <Text style={[gs.text.medium]}>
            Our vision is to unite the world republic. Our mission is the
            decentralization of local discourse within the powers.
          </Text>
        </View>
        <View
          style={[
            { position: "absolute", bottom: 10, width: "100%" },
            gs.centered
          ]}
        >
          <Text style={[gs.text.large]}>Contact</Text>
        </View>
      </View>
    </View>
  );
};
