import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Text, View, Image, TouchableOpacity } from "react-native";
import gs from "./globalStyles";
export default props => {
  if (!props.visible) {
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
          onPress={() => props.setStateModal({ infoVisible: true })}
        >
          <MaterialIcons name="info-outline" size={50} color="#782DD5" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => props.setTaggingModal(true)}
          style={[
            gs.centered,
            gs.violetBG,
            {
              width: "100%",
              height: 60
            }
          ]}
        >
          <Text style={[gs.text.white, gs.text.large]}>
            # WRITE TAGS
          </Text>
          {/* <Image source={}/> */}
        </TouchableOpacity>
      </View>
    );
  } else {
    return null;
  }
};
