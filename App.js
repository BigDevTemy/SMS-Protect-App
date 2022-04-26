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

import * as ReadSms from "react-native-read-sms/ReadSms";

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

  const startReadSMS = async () => {
    const hasPermission = await ReadSms.requestReadSMSPermission();
    console.log("hasPermission: ", hasPermission);
    if (hasPermission) {
      try {
        ReadSms.startReadSMS((status, sms, error) => {
          if (status == "success") {
            console.log("Great!! you have received new sms:", sms);
          }
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
