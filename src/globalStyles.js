import { StyleSheet } from "react-native";

styles = StyleSheet.create({
  flex1: { flex: 1 },
  flex2: { flex: 2 },
  flex3: { flex: 3 },
  flex4: { flex: 4 },
  flex5: { flex: 5 },
  centered: { alignItems: "center", justifyContent: "center" },
  flexRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center"
  },
  centeredH: { alignItems: "center" },
  centeredV: { justifyContent: "center" },
  paddingLR: { paddingLeft: 20, paddingRight: 20 },
  marginLR: { marginLeft: 20, marginRight: 20 },
  marginTB: { marginTop: 20, marginBottom: 20 },
  paddingTB: { paddingTop: 20, paddingBottom: 20 },
  violetBG: { backgroundColor: "#782DD5" },
  blueBG: { backgroundColor: "#0087E7" },
  whiteBG: { backgroundColor: "#FFFFFF" },
  overlay: {
    position: "absolute",
    top: 0,
    width: "100%",
    justifyContent: "space-between",
    height: "100%",
    flex: 1
  }
});
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
  white: {
    color: "#FFF"
  },
  black: {
    color: "black"
  },
  yellow: {
    color: "yellow"
  },
  tiny: {
    fontSize: 11
  },
  14: {
    fontSize: 14
  },
  small: {
    fontSize: 16
  },
  18: {
    fontSize: 18
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
  larger: {
    fontSize: 35
  },
  largest: {
    fontSize: 45
  },
  40: {
    fontSize: 40
  },
  huge: {
    fontSize: 55
  },
  centered: {
    textAlign: "center"
  },
  bold: {
    fontWeight: "bold"
  }
});

export default styles;
