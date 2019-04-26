import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Text, View, TouchableOpacity } from "react-native";
import gs from "../globalStyles";
export default props => {
  return (
    <View
      style={[
        props.style,
        gs.centered,
        { position: "absolute", bottom: 0, width: "100%" }
      ]}
      pointerEvents="box-none"
    >
      <TouchableOpacity
        style={{ alignSelf: "flex-end" }}
        onPress={() => props.navigation.navigate("Info")}
      >
        <MaterialIcons name="info-outline" size={50} color="#782DD5" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => props.navigation.navigate("Tagging")}
        style={[
          gs.centered,
          gs.violetBG,
          {
            width: "100%",
            height: 60
          }
        ]}
      >
        <Text style={[gs.text.white, gs.text.large]}># WRITE TAGS</Text>
        {/* <Image source={}/> */}
      </TouchableOpacity>
    </View>
  );
};
