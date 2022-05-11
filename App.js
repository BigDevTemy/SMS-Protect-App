import React, { useState, useEffect } from "react";
import {
  Text,
  Link,
  HStack,
  Center,
  Heading,
  Switch,
  useColorMode,
  NativeBaseProvider,
  extendTheme,
  VStack,
  Code,
  Button,
  Menu,
  HamburgerIcon,
  Box,
  Pressable,
  ScrollView,
} from "native-base";
import NativeBaseIcon from "./components/NativeBaseIcon";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import SmsAndroid from "react-native-get-sms-android";
import useStore from "./store";
import { PermissionsAndroid, Platform } from "react-native";
import Request from "./components/RequestPerm";
import Config from "./config";
import CryptoES from "crypto-es";
import { RSA } from "react-native-rsa-native";

import * as ReadSms from "react-native-read-sms/ReadSms";
import axios from "axios";

// if (Platform.OS === 'web') { //TODO: render web version

// }
// import { check, PERMISSIONS, RESULTS } from "react-native-permissions";

const Stack = createNativeStackNavigator();

// Define the config
const config = {
  useSystemColorMode: false,
  initialColorMode: "dark",
};

// extend the theme
export const theme = extendTheme({ config });

function HomeScreen({ navigation }) {
  const smsList = useStore((state) => state.smslist);
  const setSms = useStore((state) => state.setSms);

  const requestCameraPermission = async () => {
    try {
      // const granted = await PermissionsAndroid.request(
      const granted = PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Cool Photo App Camera Permission",
          message:
            "Cool Photo App needs access to your camera " +
            "so you can take awesome pictures.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the camera");
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // check(PERMISSIONS.ANDROID.READ_SMS)
  //   .then((result) => {
  //     switch (result) {
  //       case RESULTS.UNAVAILABLE:
  //         console.log(
  //           "This feature is not available (on this device / in this context)"
  //         );
  //         break;
  //       case RESULTS.DENIED:
  //         console.log(
  //           "The permission has not been requested / is denied but requestable"
  //         );
  //         break;
  //       case RESULTS.LIMITED:
  //         console.log("The permission is limited: some actions are possible");
  //         break;
  //       case RESULTS.GRANTED:
  //         console.log("The permission is granted");
  //         break;
  //       case RESULTS.BLOCKED:
  //         console.log("The permission is denied and not requestable anymore");
  //         break;
  //     }
  //   })
  //   .catch((error) => {
  //     // …
  //     console.log(error);
  //   });

  /* List SMS messages matching the filter */
  // var filter = {
  //   box: "inbox", // 'inbox' (default), 'sent', 'draft', 'outbox', 'failed', 'queued', and '' for all

  //   /**
  //    *  the next 3 filters can work together, they are AND-ed
  //    *
  //    *  minDate, maxDate filters work like this:
  //    *    - If and only if you set a maxDate, it's like executing this SQL query:
  //    *    "SELECT * from messages WHERE (other filters) AND date <= maxDate"
  //    *    - Same for minDate but with "date >= minDate"
  //    */
  //   minDate: 1554636310165, // timestamp (in milliseconds since UNIX epoch)
  //   maxDate: 1556277910456, // timestamp (in milliseconds since UNIX epoch)
  //   bodyRegex: "(.*)How are you(.*)", // content regex to match

  //   /** the next 5 filters should NOT be used together, they are OR-ed so pick one **/
  //   read: 0, // 0 for unread SMS, 1 for SMS already read
  //   _id: 1234, // specify the msg id
  //   thread_id: 12, // specify the conversation thread_id
  //   address: "+1888------", // sender's phone number
  //   body: "How are you", // content to match
  //   /** the next 2 filters can be used for pagination **/
  //   indexFrom: 0, // start from index 0
  //   maxCount: 10, // count of SMS to return each time
  // };

  // SmsAndroid.list(
  //   // JSON.stringify(filter),
  //   JSON.stringify(),
  //   (fail) => {
  //     console.log("Failed with this error: " + fail);
  //   },
  //   (count, smsList) => {
  //     console.log("Count: ", count);
  //     console.log("List: ", smsList);
  //     var arr = JSON.parse(smsList);

  //     arr.forEach(function (object) {
  //       console.log("Object: " + object);
  //       console.log("-->" + object.date);
  //       console.log("-->" + object.body);
  //     });
  //   }
  // );

  const postSMS = async (payload) => {
    const encrypted = CryptoES.AES.encrypt(
      payload || "Message",
      "Secret Passphrase"
    );
    console.log(encrypted.key.toString()); // 74eb593087a982e2a6f5dded54ecd96d1fd0f3d44a58728cdcd40c55227522223
    console.log(encrypted.iv.toString()); // 7781157e2629b094f0e3dd48c4d786115
    console.log(encrypted.toString()); // 73e54154a15d1beeb509d9e12f1e462a0

    const hashed = CryptoES.HmacSHA256(encrypted.toString(), Config.PUBLIC_KEY);
    console.log(hashed.toString());

    // RSA.encrypt("my_secret_message", Config.PUBLIC_KEY).then(
    //   (encodedMessage) => {
    //     console.log(`the encoded message is ${encodedMessage}`);
    //     // RSA.decrypt(encodedMessage, keys.private).then((decryptedMessage) => {
    //     //   console.log(`The original message was ${decryptedMessage}`);
    //     // });
    //   }
    // );

    const response = await axios
      .post(`https://sms-backend-ng.herokuapp.com/classify`, {
        key: encrypted.key.toString(CryptoES.enc.Base64),
        iv: encrypted.iv.toString(CryptoES.enc.Base64),
        message: hashed.toString(CryptoES.enc.Base64),
      })
      .catch((err) => {
        console.log(err);
      });
    // const response = await axios
    //   .post(`https://sms-backend-ng.herokuapp.com/classify`, {
    //     key: "gKBW2okM8nh7YJvaeJel2236SigokTjgfkWu1/WkgqeF9359pZMPRMA3OINrEx0L48OKrZ2QBy9HROckl4eZgYEJMTK4PjOwCr/LX3DmB5ZbrvsFd1E7Wxk5rrxhtsLybPzEnF+2dCIVabH/ckAMMG44Xd1D7hdWL8xODHCpzQA+MX16vNxpgCpNiuqHzqlFCTqXPmvaxrt1cmPRs4ZrvsWgv/DYBpE7Ai0g7gLpDO4yS//fdMMXbbERedGAPxKPiCTRiAqxf+TYy1WlyOUC2FRaiUuLVWulUv1R6191bIv8uR5p7X87OaX101v0CxjVOprHK3PYOLnT0MtM5Aa1VKcFl/331Guaxz7uGbrFOqnUWEb4yZTSrdgAvS4yI2o/a2GroL4NEjb7yYQUeHh5BVVOTmkWrG4ZX0QAn58eCXsZltSE1cjcBOfbHhK4dPce5ycemwnCr84QhGy0fK08/zWj+m1t7r1rwmeLYTzScrRuGRBuYNsTHexyyfFUIT+A7JrnC1JxtniwnelPzvSJgHR5PUk75AsmljxH/uguBpWoSl0MINd8ZkLW/NAMIOkPMvSzHUC3iA+EZkJymgmaq0tGmDI/X5O9NK79jvsrHAHkwDVDjGAngA68Sxro6+flPs1cviLP0V0oQBXjnUDJtu1FIKPasbGb3IIIqtCmrzE=",
    //     iv: "oyE9N786v2dlaYewDbNzRe7tCSUNesROkOQs6a1lGkk5aKHhuFpJbQMQ9NGnfMH3RLlt4lOFWwj3sCpaZ4nUNgOBx2hMcX1wsp6+uQVy6WKMqhrWIaEjuw9dEs9Gk27hpm4VcXSreo2LlXvKM0GVl/Zs9w3r4Aplx8sHo8z+gm/Tks+VWUZ/4XOU73X6plu9j76mJKC2JD5QXU0ILJp4/T1k2woxtsul2GG7Kgw35s0GYZxN9e+/pznMAIxDc1wmjMy+nRtZtUumFkjATBtMsyZZPocGGsutJtlSCCfh2JzEOBOr3DY3wLEUFElBRNvwcXTAnvPYlEsxDVLMtKyur6gIaLEj5W4g366Gd8MvIVCoXTlVUHamRMwD3P0qvG5Pk9M4s06etP2h8obchG4NXpQO1A9HP8htn7sAwsudxIAwnzfx8H878bexEWBMaflUNCLuVTkfnbr9log5ynP+cmHzm2ZSoENGE/iiPotC2SRHdli+gi4szczfENS9WKcxZPjAnFkr4zS5GHy6GL3Aus3qAcjf9NK8YjKSLw3oi9wUazsA0KWTpxkznW3qN2/8l0R0D1W/HvarEe+Y4T0zap1IrGwYa1k2qsYRaQxVXw/UMLI8fN0ZsWX3bRVbbWxt/4FQ4nzJZXNZg/8HZZXLChY4Ny3Oe7GQqVfQSmXKh5E=",
    //     message:
    //       "jl3A64sEbA3sMnv+wHt1szQPnYFdC8Aqs8XUCV8QhrkiRdoDtRdYk7cP384gK/xElOk5xS89DDrJkddaXYoYRq16IB8GUT5v72Jw0gfOs3D1rMMazXYlySiImzWmx33c+WSlQjN6OfaWeOrVbGAhk/eUNTgsNZSc88D0kSjhC2VGloTRaArVyu33fl3MVJYisPW2DODjHMBzBSlhrpFwSGp3wWuGAiZS52H71PaIRESADBpCsbc654zbKhLb8EBM",
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    console.log(response?.data);
    return response;
  };

  const startReadSMS = async () => {
    const hasPermission = await ReadSms.requestReadSMSPermission();
    console.log("hasPermission: ", hasPermission);
    if (hasPermission) {
      try {
        ReadSms.startReadSMS((status, sms, error) => {
          if (status == "success") {
            console.log("Great!! you have received new sms:", sms);
          }
          postSMS();
        });
      } catch (error) {
        console.log("error: ", error);
      }
    }
  };

  useEffect(() => {
    startReadSMS();
  }, []);

  return (
    <Center
      _dark={{ bg: "blueGray.900" }}
      _light={{ bg: "blueGray.50" }}
      px={4}
      flex={1}
    >
      <ScrollView
        h="80"
        _contentContainerStyle={{
          px: "20px",
          mb: "4",
          minW: "72",
        }}
        mt="4"
      >
        <VStack space={1} flex="1">
          {smsList.map((sms, index) => {
            return (
              <Button
                py="8"
                bg="gray.500"
                key={sms.id}
                onPress={() => {
                  setSms(sms);
                  navigation.navigate("Message");
                }}
              >
                {sms.body}
                <Request />
              </Button>
            );
          })}
        </VStack>
      </ScrollView>
    </Center>
  );
}
function MessageScreen({ navigation }) {
  const selectedSms = useStore((state) => state.selectedSms);
  return (
    <ScrollView
      h="80"
      _contentContainerStyle={{
        px: "20px",
        mb: "4",
        minW: "72",
      }}
      _dark={{ bg: "blueGray.900" }}
      _light={{ bg: "blueGray.50" }}
    >
      <VStack flex="1">
        <Center py="4" bg="gray.500" mt="4">
          {selectedSms?.body}
          {selectedSms?.id}
        </Center>
      </VStack>
      <VStack space={5} alignItems="center" mt="4">
        <Button onPress={() => navigation.navigate("Home")}>Go to Home</Button>
        <ToggleDarkMode />
      </VStack>
    </ScrollView>
  );
}

function LogoTitle(pp) {
  return (
    <Box display="flex" flexDirection="row" justifyContent="space-between">
      <Heading fontSize="md">Cyan</Heading>
      <Menu
        trigger={(triggerProps) => {
          return (
            <Pressable accessibilityLabel="More options menu" {...triggerProps}>
              <HamburgerIcon />
            </Pressable>
          );
        }}
      >
        <Menu.Item>Spam</Menu.Item>
        <Menu.Item>others</Menu.Item>
      </Menu>
    </Box>
  );
}
export default function App() {
  return (
    <NavigationContainer>
      <NativeBaseProvider>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "Messages" }}
          />
          <Stack.Screen
            name="Message"
            component={MessageScreen}
            options={{ headerTitle: (props) => <LogoTitle {...props} /> }}
          />
        </Stack.Navigator>
      </NativeBaseProvider>
    </NavigationContainer>
  );
}

// Color Switch Component
function ToggleDarkMode() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <HStack space={2} alignItems="center">
      <Text>Dark</Text>
      <Switch
        isChecked={colorMode === "light" ? true : false}
        onToggle={toggleColorMode}
        aria-label={
          colorMode === "light" ? "switch to dark mode" : "switch to light mode"
        }
      />
      <Text>Light</Text>
    </HStack>
  );
}
