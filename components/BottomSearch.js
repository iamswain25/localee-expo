import React from "react";
import { StyleSheet, Text, View, Animated, TextInput } from "react-native";
import { GestureHandler } from "expo";

const TOP_SHOW_HEIGHT = 600;
const BOTTOM_SHOW_HEIGHT = 100;
const BOTTOM_HIDDEN = 600;
const styles = StyleSheet.create({
  searchBar: {
    width: "100%",
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    bottom: BOTTOM_SHOW_HEIGHT - TOP_SHOW_HEIGHT - BOTTOM_HIDDEN,
    height: TOP_SHOW_HEIGHT + BOTTOM_HIDDEN
  }
});

export default class BottomSearch extends React.Component {
  constructor(props) {
    super(props);
    this._translateY = new Animated.Value(0);
    this._lastOffset = { y: 0 };
    this._onGestureEvent = Animated.event([
      {
        nativeEvent: {
          translationY: this._translateY
        }
      }
    ]);
    this.state = { text: "" };
  }
  _onHandlerStateChange = event => {
    if (event.nativeEvent.oldState === GestureHandler.State.ACTIVE) {
      this._lastOffset.y += event.nativeEvent.translationY;
      const y = this._lastOffset.y;
      if (y > 0) {
        console.log(y, "down");
        this._translateY.setOffset(0);
        this._lastOffset.y = 0;
      } else if (y < BOTTOM_SHOW_HEIGHT - TOP_SHOW_HEIGHT) {
        console.log(y, "up");
        this._translateY.setOffset(BOTTOM_SHOW_HEIGHT - TOP_SHOW_HEIGHT);
        this._lastOffset.y = BOTTOM_SHOW_HEIGHT - TOP_SHOW_HEIGHT;
      } else {
        console.log(y, "else");
        this._translateY.setOffset(this._lastOffset.y);
      }
      this._translateY.setValue(0);
    }
  };

  render() {
    return (
      <GestureHandler.PanGestureHandler
        onGestureEvent={this._onGestureEvent}
        onHandlerStateChange={this._onHandlerStateChange}
      >
        <Animated.View
          style={[
            styles.searchBar,
            {
              transform: [
                // { translateX: this._translateX },
                { translateY: this._translateY }
              ]
            }
          ]}
        >
          <View style={{ borderBottom: "1px solid black", width: "50%" }} />
          <TextInput
            style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
            onChangeText={text => this.setState({ text })}
            value={this.state.text}
          />
        </Animated.View>
      </GestureHandler.PanGestureHandler>
    );
  }
}
