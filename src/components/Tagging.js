import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actions from "../store/actions";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Constants } from "expo";
import { fs, GeoPoint } from "../firebase";
import gs from "../globalStyles";

class Tagging extends React.Component {
  state = { text: "", address: "" };
  componentDidMount() {
    console.log("tagging");
    if (!this.props.me.locationPermission) {
      this.props.getCoordsAddress();
    }
  }
  closeModal = () => this.props.navigation.goBack();
  _postTagging = async () => {
    console.log("tagging");
    const content = this.state.text;
    if (content.length < 1) {
      return alert("no input");
    }
    // const tags = content.match(/#(\w+)/g);
    const areas = this.props.navigation.getParam("address");
    const { latitude, longitude } = this.props.navigation.getParam("coords");
    const coords = new GeoPoint(latitude, longitude);
    fs.addTopic({
      content,
      areas,
      coords,
      createdBy: Constants.installationId
    });
    this.closeModal();
    this.setState({ text: "" });
  };
  render() {
    const {
      country,
      state,
      county,
      region,
      city,
      town,
      suburb,
      neighbourhood
    } = this.props.navigation.getParam("address", {});
    const minAddress = [
      country,
      state,
      county,
      region,
      city,
      town,
      suburb,
      neighbourhood
    ]
      .reverse()
      .find(a => a && a.length > 0);
    return (
      <View style={[gs.flex1]}>
        <View
          style={{
            backgroundColor: "white",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <TouchableOpacity onPress={this.closeModal}>
            <Ionicons
              name="md-close"
              size={30}
              style={{ padding: 10, paddingLeft: 20 }}
            />
          </TouchableOpacity>
          <Text>{minAddress}</Text>
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
      </View>
    );
  }
}

export default connect(
  all => all,
  dispatch => bindActionCreators(actions, dispatch)
)(Tagging);
