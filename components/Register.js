import React, { Component } from "react";
import RegisterForm from "./Screen/registerForm";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Keyboard,
  Platform,
  Dimensions,
  View,
  Image,
  Text,
  StatusBar,
  ScrollView
} from "react-native";

const STATUS_BAR_HEIGHT = Platform.OS === "ios" ? 36 : StatusBar.currentHeight;
function StatusBarPlaceHolder() {
  return (
    <View
      style={{
        width: "100%",

        height: STATUS_BAR_HEIGHT,
        backgroundColor: "#FFF",
      }}
    >
      <StatusBar />
    </View>
  );
}
var { width, height } = Dimensions.get("window");

export default class Register extends Component {
  static navigationOptions = {
    title: "Screen One",
    header: null,
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <KeyboardAvoidingView behavior="padding" enabled style={styles.container}>
        <ScrollView onPress={Keyboard.dismiss} showsVerticalScrollIndicator={false}>
          <StatusBarPlaceHolder />
          <View style={styles.mainView}>
            <Text style={styles.AdminText}></Text>
            <Text style={styles.RegisterText}>REGISTER</Text>
          </View>
          <RegisterForm />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    flex: 1,
    //justifyContent:'flex-end',
  },
  logo: {
    //flex: 1,
    width: 355,
    height: 250,
    top: -35,
  },
  AdminText: {
    fontFamily: "Montserrat_Bold",
    fontSize: 20,
    textAlign: "left",
    color: "#9f9f9f",
  },
  RegisterText: {
    fontFamily: "Montserrat_Bold",
    fontSize: 31,
    textAlign: "left",
    color: "#030303",
  },
  mainView: {
    flexDirection: "column",
    justifyContent: "flex-start",
  },
});
