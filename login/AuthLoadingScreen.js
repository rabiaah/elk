import React from "react";
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View
} from "react-native";
import { Actions } from 'react-native-router-flux';
import {
  loadFromStorage,
  storage,
  CurrentUserProfile,
  clearStorageValue
} from "../common/storage";
import { RemoveDeviceToken } from "../services/AccountService";
import { getPushNotificationExpoTokenAsync } from "../services/api/RegisterForPushNotificationsAsync";


export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    Actions.DailyAttendance();
    // var response = await loadFromStorage(storage, CurrentUserProfile);

    // if (response && response.isSuccess && response.item.UserName) {
    //   const userToken = await AsyncStorage.getItem("userToken");
    //   if (userToken) {
    //     Actions.DailyAttendance();
    //   }
    //   else {
    //     await clearStorageValue();
    //     Actions.login();
    //   }
    // } else {
    //   await clearStorageValue();
    //   Actions.login();
    // }
  };

  _signOutAsync = async () => {
    var token = await getPushNotificationExpoTokenAsync();
    if (token) {
      await RemoveDeviceToken(token);
    }

    await AsyncStorage.clear();

    this.props.navigation.navigate("Auth");
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
