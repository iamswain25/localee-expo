import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actions from "../store/actions";
import { Ionicons } from "@expo/vector-icons";
import gs from "../globalStyles";
class Timeline extends React.Component {
  constructor(props) {
    super(props);
  }
  getTimelineArea = () => {};
  closeModal = () => this.navigation.goBack();
  render() {
    const nav = this.props.navigation;
    const tag = nav.getParam("tag", {});
    const timeline = nav.getParam("timeline", []);
    const openTagging = nav.getParam("openTagging");
    const {
      country,
      state,
      county,
      region,
      city,
      town,
      suburb,
      neighbourhood
    } = tag.properties.areas || {};
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
        <View style={styles.statusBar}>
          <TouchableOpacity onPress={this.closeModal}>
            <Ionicons name="md-close" size={30} style={[styles.pad20]} />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.getTimelineArea}>
            <Text style={[gs.text.medium]}>{minAddress}</Text>
          </TouchableOpacity>
          <View style={[styles.pad20]}>
            <Text style={[gs.text.smallMedium]}>#{tag.properties.tag}</Text>
          </View>
        </View>
        <ScrollView style={[styles.pad20]}>
          {timeline.map((t, i) => (
            <View key={i} style={styles.feedContainer}>
              <Text style={[gs.text.small]}>{t.content}</Text>
            </View>
          ))}
        </ScrollView>
        <View style={[styles.back, styles.pad20]}>
          <TouchableOpacity onPress={openTagging}>
            <Text style={[styles.textCenter]}>Write Topics</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  feefeedContainerdContainer: {
    backgroundColor: "#fff",
    padding: 20,
    backgroundColor: "yellowgreen"
  },
  pad20: { padding: 20 },
  back: { backgroundColor: "#fcf03c" },
  textCenter: { textAlign: "center" },
  statusBar: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  }
});

export default connect(
  all => all,
  dispatch => bindActionCreators(actions, dispatch)
)(Timeline);
