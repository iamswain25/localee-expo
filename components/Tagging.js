import React from "react";
import { Constants } from "expo";
import {
  StyleSheet,
  Modal,
  View,
  TextInput,
  Text,
  TouchableOpacity
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
const styles = StyleSheet.create({
  statusBar: {
    backgroundColor: "white",
    height: Constants.statusBarHeight,
    flexDirection: "row",
    justifyContent: "space-between"
  }
});

export default class Tagging extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: "" };
  }

  render() {
    return (
      <Modal
        animationType="slide"
        presentationStyle="fullScreen"
        visible={this.props.modalVisible}
        onRequestClose={e => e}
      >
        <View style={styles.statusBar}>
          <TouchableOpacity>
            <Ionicons name="md-close" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Text>Tag</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          value={this.state.text}
          onChange={e => this.setState({ text: e })}
        />
      </Modal>
    );
  }
}
