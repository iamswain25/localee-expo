import { StyleSheet } from "react-native";

styles = StyleSheet.create({});
styles.btn = {
  small: {
    borderWidth: 1,
    borderColor: "#FFF",
    borderStyle: "solid",
    borderRadius: 40,
    padding: 20,
    width: 150,
    height: 60
  },
  normal: {
    borderWidth: 1,
    borderColor: "#FFF",
    borderStyle: "solid",
    borderRadius: 40,
    padding: 20,
    width: 250,
    height: 60
  }
};
styles.text = StyleSheet.create({
  hero: {
    color: "#FFF",
    fontFamily: "Hero"
  },
  gothic: {
    color: "#FFF",
    fontFamily: "Century Gothic"
  },
  tiny: {
    fontSize: 11
  },
  small: {
    fontSize: 16
  },
  smallMedium: {
    fontSize: 20
  },
  medium: {
    fontSize: 22
  },
  mediumLarge: {
    fontSize: 24
  },
  large: {
    fontSize: 30
  },
  huge: {
    fontSize: 55
  },
  centered: {
    textAlign: "center"
  }
});

export default styles;
