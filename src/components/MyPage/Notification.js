import React from "react";
import gs from "../../globalStyles";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
export default props => {
  return (
    <View style={[props.style, { width: "100%", padding: 10, flex: 1 }]}>
      <Text style={[gs.text.white, gs.text.huge]}>MY PAGE</Text>
      <View style={[{ flexDirection: "row" }]}>
        <Text style={[gs.text.yellow, { paddingRight: 5, paddingLeft: 5 }]}>
          215
        </Text>
        <Text
          style={[
            gs.text.white,
            {
              paddingRight: 5,
              paddingLeft: 5,
              borderRightWidth: 2,
              borderRightColor: "grey"
            }
          ]}
        >
          TAGS
        </Text>
        <Text style={[gs.text.yellow, { paddingRight: 5, paddingLeft: 5 }]}>
          1222
        </Text>
        <Text style={[gs.text.white, { paddingRight: 5, paddingLeft: 5 }]}>
          LIKED TAGS
        </Text>
      </View>
      <FlatList
        style={{ flex: 1 }}
        data={["TRUMP", "MOON", "BILATERAL", "WEAPON", "KIM", "EXPO"]}
        keyExtractor={index => index}
        renderItem={({ item, index }) => (
          <View style={{ marginTop: 20 }} key={index}>
            <Text style={[gs.text.white, gs.text.small]}>
              someone liked your tag:
            </Text>
            <Text style={[gs.text.yellow, gs.text.medium]}>#{item}</Text>
          </View>
        )}
      />
    </View>
  );
};
