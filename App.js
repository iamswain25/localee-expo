import React from "react";
import { YellowBox, SafeAreaView, Platform } from "react-native";
import { AppLoading } from "expo";
import { Provider } from "react-redux";
import { createStackNavigator, createAppContainer } from "react-navigation";
import * as Modals from "./src/Modals";
import Map from "./src/Map";
import { Tagging, Timeline } from "./src/components";
import { store } from "./src/store";

const MainStack = createStackNavigator(
  { Map, Tagging, Timeline },
  {
    initialRouteName: "Map",
    headerMode: "none"
  }
);
const RootStack = createStackNavigator(
  {
    MainStack,
    ...Modals
  },
  {
    mode: "modal",
    headerMode: "none",
    transparentCard: true,
    cardStyle: {
      backgroundColor: "transparent",
      opacity: 1
    }
  }
);
const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  state = {
    isReady: false
  };
  componentDidMount() {
    YellowBox.ignoreWarnings(["Require cycle:", "Setting a timer"]);
    console.warn = message => {
      if (message.indexOf("Setting a timer") <= -1) {
        console.log(message);
      }
    };
  }
  loadFont = async () => true;

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this.loadFont}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      );
    }
    return (
      <SafeAreaView //only works for iOS
        style={
          { flex: 1, paddingTop: Platform.OS === "android" ? 25 : 0 } // make it work for android
        }
      >
        <Provider store={store}>
          <AppContainer />
        </Provider>
      </SafeAreaView>
    );
  }
}
