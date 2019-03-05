import React from "react";
import {
  StyleSheet,
  Modal,
  View,
  TextInput,
  Text,
  TouchableOpacity
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { firestore, GeoPoint } from "./firebase";
const styles = StyleSheet.create({
  statusBar: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  }
});

export default class Tagging extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: "", address: "" };
  }
  componentDidUpdate() {
    if (!this.props.locationPermission) {
      this.props.askAddrPermission().then(perm => {
        if (!perm) {
          alert("Permission to access location was denied");
        } else {
          this.props.getAddressAsync();
        }
      });
    }
  }
  _postTagging = async () => {
    const content = this.state.text;
    const tags = content.match(/#(\w+)/g);
    const areas = this.props.address;
    const coords = new GeoPoint(
      this.props.coords.latitude,
      this.props.coords.longitude
    );
    await firestore.collection("topics").add({
      content,
      tags,
      areas,
      coords
    });
    this.props.closeModal();
  };
  render() {
    if (this.props.locationPermission) {
      const { city, street, region, postalCode, country } = this.props.address;
      return (
        <Modal
          animationType="slide"
          presentationStyle="fullScreen"
          visible={this.props.modalVisible}
          onRequestClose={e => e}
        >
          <View style={styles.statusBar}>
            <TouchableOpacity onPress={this.props.closeModal}>
              <Ionicons
                name="md-close"
                size={30}
                style={{ padding: 10, paddingLeft: 20 }}
              />
            </TouchableOpacity>
            <Text>{`${region} - ${city}`}</Text>
            <TouchableOpacity onPress={this._postTagging}>
              <Text style={{ padding: 10, fontSize: 30, paddingLeft: 20 }}>
                tag
              </Text>
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
            placeholder="What's happening in your zone?"
          />
        </Modal>
      );
    } else {
      return <View />;
    }
  }
}
