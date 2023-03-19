import "react-native-gesture-handler";
import { registerRootComponent } from "expo";
import App from "./App";
import PushNotification from "react-native-push-notification";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

// Must be outside of any component LifeCycle (such as `componentDidMount`).
PushNotification.configure({
  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    console.log("NOTIFICATION:", notification);

    // process the notification

    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish();
  },

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   * - if you are not using remote notification or do not have Firebase installed, use this:
   *     requestPermissions: Platform.OS === 'ios'
   */
  requestPermissions: Platform.OS === "ios",
});

PushNotification.createChannel({
  channelId: "smsProtectApp",
  channelName: "SMSProtectApp",
});
