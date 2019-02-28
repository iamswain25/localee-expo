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
    // height: Constants.statusBarHeight,
    flexDirection: "row",
    alignItems: "center",
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
          <TouchableOpacity onPress={this.props.closeModal}>
            <Ionicons name="md-close" size={30} style={{ padding: 10 }} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={{ padding: 10, fontSize: 30 }}>tag</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          autoFocus={true}
          multiline={true}
          style={{
            backgroundColor: "white",
            fontSize: 30,
            flex: 1,
            textAlignVertical: "top",
            padding: 20
          }}
          value={this.state.text}
          onChangeText={text => this.setState({ text })}
          maxLength={300}
        />
      </Modal>
    );
  }
}
