import { postSMS } from "../utils";
import PushNotification from "react-native-push-notification";

export default async (taskData) => {
  if (!taskData.message) {
    return;
  }

  const sms = await postSMS([
    {
      body: taskData.message,
    },
  ]);

  if (!sms?.error && sms?.spam) {
    PushNotification.localNotification({
      channelId: "smsProtectApp",
      title: "SPAM detected",
      message: "You recieved a spam message",
    });
  }
};
