/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Fragment } from "react";
import {
  ActivityIndicator,
  AsyncStorage,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import * as Font from "expo-font";

import AppNavigator from "./AppNavigator";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: null,
      show_Main_App: true,
      loading: true,
      fontsLoaded: false,
    };
  }
  async componentDidMount() {
    await Font.loadAsync({
      PRODUCT_SANS_REGULAR: require("./assets/fonts/PRODUCT_SANS_REGULAR.ttf"),
      Montserrat_Bold: require("./assets/fonts/Montserrat_Bold.ttf"),
      Montserrat_Medium: require("./assets/fonts/Montserrat_Medium.ttf"),
      Montserrat_SemiBold: require("./assets/fonts/Montserrat_SemiBold.ttf"),
      OPENSANS_BOLD: require("./assets/fonts/OPENSANS_BOLD.ttf"),
      OPENSANS_REGULAR: require("./assets/fonts/OPENSANS_REGULAR.ttf"),
      PRODUCT_SANS_BOLD: require("./assets/fonts/PRODUCT_SANS_BOLD.ttf"),
    });

    this.setState({ fontsLoaded: true, loading: false });
  }

  async fontLoad() {
    await Font.loadAsync({
      PRODUCT_SANS_REGULAR: require("./assets/fonts/PRODUCT_SANS_REGULAR.ttf"),
      Montserrat_Bold: require("./assets/fonts/Montserrat_Bold.ttf"),
      Montserrat_Medium: require("./assets/fonts/Montserrat_Medium.ttf"),
      Montserrat_SemiBold: require("./assets/fonts/Montserrat_SemiBold.ttf"),
      OPENSANS_BOLD: require("./assets/fonts/OPENSANS_BOLD.ttf"),
      OPENSANS_REGULAR: require("./assets/fonts/OPENSANS_REGULAR.ttf"),
      PRODUCT_SANS_BOLD: require("./assets/fonts/PRODUCT_SANS_BOLD.ttf"),
    });

    this.setState({ fontsLoaded: true, loading: false });
  }

  componentWillUnmount() {}

  render() {
    if (this.state.loading === true) {
      return (
        <SafeAreaView style={styles.container}>
          <ActivityIndicator
            size="large"
            color="#1B7F67"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              top: 0,
              justifyContent: "center",
              alignContent: "center",
            }}
          />
        </SafeAreaView>
      );
    } else {
      return (
        <SafeAreaView style={styles.container}>
          <AppNavigator />
        </SafeAreaView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
