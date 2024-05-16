import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#f00",
    margin: 10,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderBottomWidth: 0.75,
    borderBottomColor: "#888",
    width: 175,
    height: 30,
    marginBottom: 3,
    fontSize: 14,
  },
  dropdown: {
    width: 175,
    height: 30,
    borderBottomWidth: 0.75,
    borderBottomColor: "#888",
    marginBottom: 3,
  },
  dropdownPlaceholderStyle: {
    color: "#888",
    fontSize: 14,
  },
  dropdownSelectedTextStyle: {
    fontSize: 14,
  },
  image: {
    width: 360,
    height: 202.5,
    margin: 20,
    borderRadius: 5,
  },
  bodyText: {
    fontSize: 16,
  },
  italicText: {
    fontStyle: "italic",
    fontSize: 13,
    marginBottom: 10,
  },
  logText: {
    fontSize: 15,
  },
});
