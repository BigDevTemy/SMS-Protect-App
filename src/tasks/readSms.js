import { postSMS } from "../utils";
import PushNotification from "react-native-push-notification";

export default async (taskData) => {
  console.log("JSAPI: Read SMS task started", { taskData });

  try {
    PushNotification.localNotification({
      channelId: "smsProtectApp",
      title: "SPAM detected",
      message: "You recieved a spam message",
    });
  } catch (e) {
    console.log("JSAPI: ", e);
  }
  const sms = await postSMS([
    {
      body: taskData.message,
    },
  ]);
  console.log("JSAPI: ", { ...sms });
};
