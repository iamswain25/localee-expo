import React from "react";
import {
  StyleSheet,
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import gstyles from "./globalStyles";
export default class extends React.Component {
  constructor(props) {
    super(props);
  }
  _getTimelineArea = () =>
    this.props.getTimelineArea(this.props.tag.properties.areas);
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
    } = this.props.tag.properties.areas || {};
    const { timeline } = this.props;
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
      <Modal
        animationType="slide"
        presentationStyle="fullScreen"
        visible={this.props.timelineVisible}
        onRequestClose={this.props.closeModal}
      >
        <View style={styles.statusBar}>
          <TouchableOpacity onPress={this.props.closeModal}>
            <Ionicons name="md-close" size={30} style={[styles.pad20]} />
          </TouchableOpacity>
          <TouchableOpacity onPress={this._getTimelineArea}>
            <Text style={[gstyles.text.medium]}>{minAddress}</Text>
          </TouchableOpacity>
          <View style={[styles.pad20]}>
            <Text style={[gstyles.text.smallMedium]}>
              #{this.props.tag.properties.tag}
            </Text>
          </View>
        </View>
        <ScrollView style={[styles.pad20]}>
          {timeline.map((t, i) => (
            <View key={i} style={styles.feedContainer}>
              <Text style={[gstyles.text.small]}>{t.content}</Text>
            </View>
          ))}
        </ScrollView>
        <View style={[styles.back, styles.pad20]}>
          <TouchableOpacity onPress={this.props.writeTagging}>
            <Text style={[styles.textCenter]}>Write Topics</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
